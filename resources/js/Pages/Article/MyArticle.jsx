import Layout_User from "@/Layouts/Layout_User";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function MyArticle({ articles = [] }) {
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
            const data = await response.json();
            setLikesState((prev) => ({ ...prev, [articleId]: data.isLiked }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 space-y-6">
                <h1 className="text-3xl font-bold">My Articles</h1>

                {articles.length === 0 ? (
                    <p className="text-gray-500">
                        You haven't written any articles yet.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Card
                                key={article.id}
                                className="hover:shadow-md transition overflow-hidden"
                            >
                                {article.thumbnail_url && (
                                    <img
                                        src={article.thumbnail_url}
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
                                <CardContent>
                                    <p className="text-gray-700 line-clamp-3">
                                        {article.contents?.[0]?.content
                                            ?.replace(/(<([^>]+)>)/gi, "")
                                            .slice(0, 150) ||
                                            "No preview text."}
                                        ...
                                    </p>
                                    <Link
                                        href={`/articles/${article.id}`}
                                        className="text-blue-600 hover:underline mt-2 inline-block"
                                    >
                                        View details →
                                    </Link>

                                    <div className="mt-3 flex items-center gap-3">
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout_User>
    );
}
