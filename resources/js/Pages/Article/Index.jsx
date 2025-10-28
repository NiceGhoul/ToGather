import Layout_User from "@/Layouts/Layout_User";
import { Link, usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Heart } from "lucide-react";

export default function Index() {
    const { props } = usePage();
    const articles = props.articles || [];
    const categories = props.categories || [];
    const selectedCategory = props.selectedCategory || "";
    const sortOrder = props.sortOrder || "desc";
    const initialSearch = props.searchQuery || "";
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    // --- Like state untuk setiap artikel ---
    const [likesState, setLikesState] = useState(
        Object.fromEntries(
            articles.map((a) => [a.id, a.is_liked_by_user ?? false])
        )
    );

    // --- Handler LIKE / UNLIKE ---
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

            // Update state lokal
            setLikesState((prev) => ({
                ...prev,
                [articleId]: data.isLiked,
            }));

            // Refresh hanya jumlah likes
            router.reload({ only: ["articles"] });
        } catch (error) {
            console.error("Error liking article:", error);
        }
    };

    // --- Filter & Search ---
    const handleFilterChange = (e) =>
        router.get("/articles/list", {
            category: e.target.value,
            sort: sortOrder,
            search: searchQuery,
        });

    const handleSortChange = (e) =>
        router.get("/articles/list", {
            category: selectedCategory,
            sort: e.target.value,
            search: searchQuery,
        });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/articles/list", {
            category: selectedCategory,
            sort: sortOrder,
            search: searchQuery,
        });
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 space-y-6">
                <h1 className="text-3xl font-bold">All Articles</h1>

                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <select
                            value={selectedCategory}
                            onChange={handleFilterChange}
                            className="border rounded p-2"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category, i) => (
                                <option key={i} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="border rounded p-2"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search articles..."
                            className="border rounded-l p-2 w-48 md:w-64"
                        />
                        <button type="submit" className="register-btn rounded">
                            Search
                        </button>
                    </form>
                </div>

                {/* Article List */}
                {articles.length === 0 ? (
                    <p className="text-gray-500">No articles found.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => {
                            const previewText =
                                article.contents?.find(
                                    (c) =>
                                        c.type === "text" &&
                                        c.order_x === 1 &&
                                        c.order_y === 1
                                )?.content || "";

                            const liked = likesState[article.id] || false;

                            return (
                                <Card
                                    key={article.id}
                                    className="hover:shadow-md transition overflow-hidden"
                                >
                                    {/* Thumbnail */}
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
                                            by{" "}
                                            {article.user?.nickname ??
                                                "Unknown"}{" "}
                                            ·{" "}
                                            {new Date(
                                                article.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {article.category ?? "Unknown"}
                                        </p>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-gray-700 line-clamp-3">
                                            {previewText
                                                .replace(/(<([^>]+)>)/gi, "")
                                                .slice(0, 150) ||
                                                "No preview text."}
                                            ...
                                        </p>

                                        <Link
                                            href={`/articles/${article.id}?from=articles_list`}
                                            className="text-blue-600 hover:underline mt-2 inline-block"
                                        >
                                            Read more →
                                        </Link>

                                        {/* ❤️ Tombol Like */}
                                        <div className="mt-3 flex items-center gap-3">
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
                                            <span className="text-sm text-gray-700">
                                                {article.likes_count ?? 0}{" "}
                                                {article.likes_count === 1
                                                    ? "like"
                                                    : "likes"}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout_User>
    );
}
