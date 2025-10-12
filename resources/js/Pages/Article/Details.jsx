import Layout_User from "@/Layouts/Layout_User";
import { usePage } from "@inertiajs/react";

export default function Show() {
    const { props } = usePage();
    const article = props.article;

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Thumbnail */}
                {article.thumbnail && (
                    <img
                        src={`/storage/${article.thumbnail}`}
                        alt={article.title}
                        className="w-full h-80 object-cover rounded-md mb-6"
                    />
                )}

                {/* Judul */}
                <h1 className="text-3xl font-bold mb-2">{article.title}</h1>

                {/* Info Penulis */}
                <p className="text-gray-500 mb-6">
                    by {article.user?.name ?? "Unknown"} ·{" "}
                    {new Date(article.created_at).toLocaleDateString()}
                </p>

                {/* Isi Artikel */}
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                ></div>
            </div>
        </Layout_User>
    );
}
