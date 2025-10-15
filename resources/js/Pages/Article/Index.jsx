import Layout_User from "@/Layouts/Layout_User";
import { Link, usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Index() {
    const { props } = usePage();
    const articles = props.articles || [];
    const categories = props.categories || [];
    const selectedCategory = props.selectedCategory || "";
    const sortOrder = props.sortOrder || "desc";
    const initialSearch = props.searchQuery || "";
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    const handleFilterChange = (e) => {
        const newCategory = e.target.value;
        router.get("/articles/list", {
            category: newCategory,
            sort: sortOrder,
            search: searchQuery,
        });
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        router.get("/articles/list", {
            category: selectedCategory,
            sort: newSort,
            search: searchQuery,
        });
    };

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
                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Category */}
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

                        {/* Sort */}
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="border rounded p-2"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-4">
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

                {/* Filter Label */}
                <div className="mb-4">
                    <span className="font-medium">
                        Filter:{" "}
                        {selectedCategory ? selectedCategory : "All Categories"}
                        ,{" "}
                        {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                    </span>
                    <br></br>
                    <span className="font-medium">
                        {searchQuery && `Search: "${searchQuery}"`}
                    </span>
                </div>

                {/* Article List */}
                {articles.length === 0 ? (
                    <p className="text-gray-500">No articles found.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Card
                                key={article.id}
                                className="hover:shadow-md transition overflow-hidden"
                            >
                                {/* Thumbnail */}
                                {article.thumbnail && (
                                    <img
                                        src={`/storage/${article.thumbnail}`}
                                        alt={article.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}

                                {/* PDF Preview (kalau ada attachment) */}
                                {article.attachment && (
                                    <iframe
                                        src={`/storage/${article.attachment}`}
                                        className="w-full h-64 border-t"
                                        title={`Preview ${article.title}`}
                                    ></iframe>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {article.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-500">
                                        by {article.user?.nickname ?? "Unknown"}{" "}
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
                                    {article.content ? (
                                        <p className="text-gray-700 line-clamp-3">
                                            {article.content
                                                .replace(/(<([^>]+)>)/gi, "")
                                                .slice(0, 150)}
                                            ...
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            PDF-only article
                                        </p>
                                    )}

                                    {/* Link ke detail */}
                                    <Link
                                        href={`/articles/${article.id}`}
                                        className="text-blue-600 hover:underline mt-2 inline-block"
                                    >
                                        Read more →
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout_User>
    );
}
