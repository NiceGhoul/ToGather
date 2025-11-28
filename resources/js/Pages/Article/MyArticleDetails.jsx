import Layout_User from "@/Layouts/Layout_User";
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";

export default function MyArticleDetails() {
    const { article } = usePage().props;

    // ---------- MODAL ----------
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // ---------- SORTED CONTENT ----------
    const sortedContents = [...(article.contents || [])].sort((a, b) => {
        if (a.order_y === b.order_y) return a.order_x - b.order_x;
        return a.order_y - b.order_y;
    });

    // ---------- STATUS COLOR ----------
    const statusColor =
        {
            approved: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
            pending: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
            rejected: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
            disabled: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
        }[article.status] || "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";

    return (
        <Layout_User>
            <div className="w-full flex flex-col items-center py-10">
                {/* HEADER */}
                <div className="w-full max-w-4xl flex items-center justify-between mb-6">
                    <Button
                        variant="secondary"
                        className="flex items-center gap-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    <Button
                        onClick={() =>
                            router.visit(`/articles/${article.id}/edit`)
                        }
                        className="bg-purple-800 text-white hover:bg-purple-700"
                    >
                        Edit Article
                    </Button>
                </div>

                {/* STATUS BADGE */}
                <div className="w-full max-w-4xl mb-4">
                    <div
                        className={`inline-block px-4 py-2 rounded-md border font-medium capitalize ${statusColor}`}
                    >
                        Status: {article.status}
                    </div>
                </div>

                {/* REJECTION MESSAGE */}
                {article.status === "rejected" && article.rejected_reason && (
                    <div className="w-full max-w-4xl mb-6">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                            <p className="font-semibold mb-1">
                                This article was rejected.
                            </p>
                            <p>{article.rejected_reason}</p>
                        </div>
                    </div>
                )}

                {/* THUMBNAIL */}
                {article.thumbnail_url && (
                    <div className="flex justify-center mb-8 w-full">
                        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                            <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>
                )}

                {/* TITLE & AUTHOR */}
                <div className="w-full max-w-4xl text-left mb-4">
                    <h1 className="text-3xl font-bold dark:text-white">{article.title}</h1>
                </div>

                <div className="w-full max-w-4xl text-gray-500 dark:text-gray-400 mb-6">
                    <p>
                        by {article.user?.nickname ?? "Unknown"} ·{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                    </p>
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
                                                block.type === "text" ||
                                                block.type === "paragraph" ? (
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
                                                                alt={`Block ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full max-h-[400px] object-contain rounded-lg shadow-md bg-white hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
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
                        <p className="text-gray-500 italic mb-6 text-center">
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
        </Layout_User>
    );
}
