import Layout_User from "@/Layouts/Layout_User";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Show() {
    const { props } = usePage();
    const article = props.article;
    const [showModal, setShowModal] = useState(false);

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Thumbnail */}
                <img
                    src={`/storage/${article.thumbnail}`}
                    alt={article.title}
                    className="w-full max-h-[600px] object-contain rounded-md mb-6 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    onClick={() => setShowModal(true)}
                />

                {/* Title*/}
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>

                {/* Writer*/}
                <p className="text-gray-500 mb-6">
                    by {article.user?.name ?? "Unknown"} ·{" "}
                    {new Date(article.created_at).toLocaleDateString()}
                </p>

                {/* Content*/}
                {article.content ? (
                    <div
                        className="prose max-w-none mb-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    ></div>
                ) : (
                    <p className="text-gray-500 italic mb-6">
                        This article only contains an attached PDF.
                    </p>
                )}

                {/* Preview PDF */}
                {article.attachment && (
                    <div className="space-y-4">
                        {/* Open PDF */}
                        <a
                            href={`/storage/${article.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            View Full PDF
                        </a>

                        {/* Preview PDF */}
                        <iframe
                            src={`/storage/${article.attachment}`}
                            className="w-full h-[50rem] border rounded"
                            title={`Preview of ${article.title}`}
                        ></iframe>
                    </div>
                )}
            </div>
            {/* Modal Image Viewer */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={`/storage/${article.thumbnail}`}
                        alt={article.title}
                        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
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
