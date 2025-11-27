import Layout_User from "@/Layouts/Layout_User";
import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Heart, ArrowLeft } from "lucide-react";
import Layout_Guest from "@/Layouts/Layout_Guest";

export default function Details() {
    const { article, auth } = usePage().props;
    const [isLogin, setIsLogin] = useState(false);

    // 🟣 Check authentication status
    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);

    // ---------- LIKE ----------
    const [liked, setLiked] = useState(article.is_liked_by_user ?? false);
    const [likeCount, setLikeCount] = useState(article.likes_count ?? 0);

    const handleLike = async () => {
        try {
            const res = await fetch(`/articles/${article.id}/like`, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            setLiked(data.isLiked);
            setLikeCount(data.likeCount);
        } catch (e) {
            console.error(e);
        }
    };

    // ---------- MODAL ----------
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // ---------- SORTED CONTENT ----------
    const sortedContents = [...(article.contents || [])].sort((a, b) => {
        if (a.order_y === b.order_y) return a.order_x - b.order_x;
        return a.order_y - b.order_y;
    });

    // 🟣 Dynamic Layout based on authentication
    const Layout = isLogin ? Layout_User : Layout_Guest;

    return (
        <Layout>
            <div className="w-full flex flex-col items-center py-10">
                {/* HEADER */}
                <div className="w-full max-w-4xl flex items-center justify-start mb-6">
                    <Button
                        variant="secondary"
                        className="flex items-center gap-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                {/* THUMBNAIL */}
                {article.thumbnail_url && (
                    <div className="w-full max-w-4xl h-[300px] rounded-xl overflow-hidden bg-gray-100 shadow-sm mb-8 dark:bg-gray-800">
                        <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-full object-cover object-center"
                            onClick={() => {
                                setModalImage(article.thumbnail_url);
                                setShowModal(true);
                            }}
                        />
                    </div>
                )}

                {/* TITLE & AUTHOR */}
                <div className="w-full max-w-4xl text-left mb-4">
                    <h1 className="text-3xl font-bold dark:text-white">
                        {article.title}
                    </h1>
                </div>

                <div className="w-full max-w-4xl flex items-center gap-3 text-gray-500 mb-6 dark:text-gray-400">
                    <p>
                        by {article.user?.nickname ?? "Unknown"} ·{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                    </p>

                    {/* LIKE SECTION */}
                    <div className="ml-auto flex items-center gap-2">
                        <Toggle
                            pressed={liked}
                            onPressedChange={handleLike}
                            size="lg"
                            variant="outline"
                            className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                        >
                            <Heart className="w-5 h-5" />
                        </Toggle>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {likeCount} {likeCount === 1 ? "like" : "likes"}
                        </span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="w-full max-w-4xl">
                    {sortedContents.length > 0 ? (
                        (() => {
                            const maxX = Math.max(
                                ...sortedContents.map((b) => b.order_x)
                            );
                            const maxY = Math.max(
                                ...sortedContents.map((b) => b.order_y)
                            );
                            const cells = [];

                            for (let y = 1; y <= maxY; y++) {
                                for (let x = 1; x <= maxX; x++) {
                                    const block = sortedContents.find(
                                        (b) =>
                                            b.order_x === x && b.order_y === y
                                    );
                                    cells.push({ x, y, block });
                                }
                            }

                            return (
                                <div
                                    className="grid w-full gap-6 mb-8"
                                    style={{
                                        gridTemplateColumns: `repeat(${maxX}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {cells.map(({ x, y, block }, index) => (
                                        <div
                                            key={`${y}-${x}`}
                                            className="w-full rounded-md p-2 overflow-hidden break-words"
                                            style={{
                                                gridColumnStart: x,
                                                gridRowStart: y,
                                            }}
                                        >
                                            {block ? (
                                                block.type === "paragraph" ||
                                                block.type === "text" ? (
                                                    <div
                                                        className="max-w-none text-justify leading-relaxed tracking-normal"
                                                        style={{
                                                            textJustify:
                                                                "inter-word",
                                                            wordSpacing:
                                                                "-0.2em",
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                block.content ??
                                                                "",
                                                        }}
                                                    ></div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="w-full max-w-[420px]">
                                                            <img
                                                                src={
                                                                    block.image_url
                                                                }
                                                                className="w-full max-h-[400px] object-contain rounded-lg shadow-md bg-white hover:scale-[1.02] transition-transform cursor-pointer dark:bg-gray-800"
                                                                onClick={() => {
                                                                    setModalImage(
                                                                        block.image_url
                                                                    );
                                                                    setShowModal(
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="min-h-[100px]"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()
                    ) : (
                        <p className="text-gray-500 italic mb-6 text-center dark:text-gray-400">
                            This article has no content blocks.
                        </p>
                    )}
                </div>
            </div>

            {/* IMAGE MODAL VIEWER */}
            {showModal && modalImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={modalImage}
                        alt="Full View"
                        className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-6 right-6 text-white text-3xl font-bold"
                        onClick={() => setShowModal(false)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </Layout>
    );
}
