import Layout_User from "@/Layouts/Layout_User";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Show() {
    const { props } = usePage();
    const article = props.article;
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // Sort content blocks
    const sortedContents = article.contents
        ? [...article.contents].sort((a, b) => {
              if (a.order_y !== b.order_y) return a.order_y - b.order_y;
              return a.order_x - b.order_x;
          })
        : [];

    return (
        <Layout_User>
            <div className="w-full flex flex-col items-center py-10">
                {/*Thumbnail*/}
                {article.thumbnail_url && (
                    <div className="w-full max-w-4xl h-[300px] rounded-xl overflow-hidden bg-gray-100 shadow-sm mb-8">
                        <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-full object-cover object-center cursor-pointer"
                            onClick={() => {
                                setModalImage(article.thumbnail_url);
                                setShowModal(true);
                            }}
                        />
                    </div>
                )}
                {/*Title*/}
                <div className="w-full max-w-4xl text-left">
                    <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
                    <p className="text-gray-500 mb-6">
                        by {article.user.nickname ?? "Unknown"} ·{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/*Content*/}
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
                                                block.type === "text" ? (
                                                    <div
                                                        className="prose max-w-none text-justify"
                                                        dangerouslySetInnerHTML={{
                                                            __html: block.content,
                                                        }}
                                                    ></div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="w-full max-w-[420px]">
                                                            <img
                                                                src={block.image_url}
                                                                alt={`Block ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-64 object-contain rounded-md shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
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
            {/*Modal Image Viewer*/}
            {showModal && modalImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={modalImage}
                        alt="Full View"
                        className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-lg transform scale-105 transition-transform duration-300 ease-out" // 🔹 Zoom halus
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
