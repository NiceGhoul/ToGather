import Layout_User from "@/Layouts/Layout_User";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function MyArticle({ articles = [] }) {
    // 🟢 duplikasi data articles ke state supaya bisa diubah likes_count-nya
    const [articlesState, setArticlesState] = useState(articles);

    const [likesState, setLikesState] = useState(
        Object.fromEntries(
            articles.map((a) => [a.id, a.is_liked_by_user ?? false])
        )
    );

    const handleLike = async (articleId) => {
        try {
            const response = await fetch(`/articles/${articleId}/like`, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    Accept: "application/json",
                },
            });

            const data = await response.json(); // { isLiked: true/false }

            // 🔁 update state likesState
            setLikesState((prev) => ({ ...prev, [articleId]: data.isLiked }));

            // 🟢 update juga jumlah likes di articlesState
            setArticlesState((prev) =>
                prev.map((article) =>
                    article.id === articleId
                        ? {
                              ...article,
                              likes_count: data.isLiked
                                  ? (article.likes_count ?? 0) + 1
                                  : Math.max((article.likes_count ?? 1) - 1, 0),
                          }
                        : article
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 space-y-6">
                <h1 className="text-3xl font-bold">My Articles</h1>

                {articlesState.length === 0 ? (
                    <p className="text-gray-500">
                        You haven't written any articles yet.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articlesState.map((article) => (
                            <Card
                                key={article.id}
                                className="hover:shadow-md transition overflow-hidden flex flex-col h-full"
                            >
                                {article.thumbnail && (
                                    <img
                                        src={`/storage/${article.thumbnail}`}
                                        alt={article.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}

                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {article.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            article.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </CardHeader>

                                <CardContent className="flex flex-col flex-grow">
                                    <p className="text-gray-700 line-clamp-3 mb-3">
                                        {article.contents?.[0]?.content
                                            ?.replace(/(<([^>]+)>)/gi, "")
                                            .slice(0, 95) || "No preview text."}
                                        ...
                                    </p>

                                    <div className="flex flex-row items-center gap-2 mt-3 mb-2">
                                        <span
                                            className={`inline-block text-xs font-semibold px-2 py-1 rounded-full
                ${
                    article.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : article.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : article.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                }`}
                                        >
                                            {article.status.toUpperCase()}
                                        </span>

                                        {article.status === "rejected" &&
                                            article.rejected_reason && (
                                                <p className="text-sm text-red-600">
                                                    <strong>Reason:</strong>{" "}
                                                    {article.rejected_reason}
                                                </p>
                                            )}
                                    </div>

                                    <div className="flex-grow" />

                                    <div className="mt-auto">
                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="text-blue-600 hover:underline inline-block mb-2"
                                        >
                                            View details →
                                        </Link>

                                        <div className="flex items-center gap-3">
                                            <Toggle
                                                pressed={likesState[article.id]}
                                                onPressedChange={() =>
                                                    handleLike(article.id)
                                                }
                                                size="lg"
                                                variant="outline"
                                                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                                            >
                                                <Heart className="w-5 h-5" />
                                            </Toggle>
                                            <span className="text-sm text-gray-700">
                                                {article.likes_count ?? 0}{" "}
                                                {article.likes_count === 1
                                                    ? "like"
                                                    : "likes"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout_User>
    );
}
