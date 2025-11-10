import { Button } from "@/Components/ui/button"
import { Card } from "@/Components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty"
import { Label } from "@/Components/ui/label"
import { Toggle } from "@/Components/ui/toggle"
import Layout_User from "@/Layouts/Layout_User"
import { Link, usePage } from "@inertiajs/react"
import { IconFolderCode } from "@tabler/icons-react"
import { Heart } from "lucide-react"
import { useState } from "react"

const LikedArticle = () => {

    const { likedArticles } = usePage().props


    const cardRepeater = (data) => {
        if (!data || data.length === 0) {
            return emptyList();
        } else {
            return data.map((article, idx) => {
                const previewText =
                    article.contents?.find(
                        (c) =>
                            c.type === "text" &&
                            c.order_x === 1 &&
                            c.order_y === 1
                    )?.content || "";

                    const liked = true
                return (
                    <div
                        key={idx}
                        className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
                    >
                        {article.thumbnail_url && (
                            <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                        )}

                        <h2 className="text-lg font-semibold mb-2 min-h-[2rem] max-h-[3rem] overflow-hidden text-center leading-snug">
                            {article.title.length > 50
                                ? article.title.substring(0, 50) + "..."
                                : article.title}
                        </h2>

                        <p className="text-sm text-gray-600 text-center mb-2">
                            by {article.user?.nickname ?? "Unknown"} ·{" "}
                            {new Date(article.created_at).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500 text-center mb-2">
                            {article.category ?? "Uncategorized"}
                        </p>

                        <p className="h-[80px] text-sm text-gray-700 mb-4 text-justify">
                            {previewText
                                .replace(/(<([^>]+)>)/gi, "")
                                .slice(0, 180) || "No preview text."}
                            ...
                        </p>

                        <div className="flex justify-center gap-2 mb-4">
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
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                            <Link
                                href={`/articles/${article.id}/details`}
                                className="text-purple-700 hover:underline font-medium"
                            >
                                Read more →
                            </Link>

                            <div className="flex items-center gap-2">
                                <Toggle
                                    pressed={liked}
                                    onPressedChange={() =>
                                        handleLike(article.id)
                                    }
                                    size="lg"
                                    variant="outline"
                                    className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                                >
                                    <Heart className="w-5 h-5" />
                                </Toggle>
                                <span className="text-sm text-gray-600">
                                    {article.likes_count ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            });
        }
    };

    const emptyList = () => {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <IconFolderCode className="w-10 h-10 text-purple-600" />
                        </EmptyMedia>
                        <EmptyTitle>No Articles liked Yet</EmptyTitle>
                        <EmptyDescription>
                            all of your liked Articles will be shown here!
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent>
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/articles/list">
                                    Browse Articles
                                </Link>
                            </Button>
                        </div>
                    </EmptyContent>
                </Empty>
            </div>
        );
    }

    return (
        <Layout_User>
            <div className="w-full flex flex-col gap-5">
                {likedArticles.length > 0 ? (
                    <Label className="text-2xl mx-5 my-5">Liked Articles</Label>
                ) : (
                    <></>
                )}
                {likedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {cardRepeater(likedArticles)}
                    </div>
                ) : (
                    emptyList()
                )}
            </div>
        </Layout_User>
    );
}


export default LikedArticle
