import Layout_User from "@/Layouts/Layout_User";
import { Link, usePage } from "@inertiajs/react";
import { CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Toggle } from "@/Components/ui/toggle";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Input } from "@/Components/ui/input";
import { SearchIcon, Heart, RotateCcw } from "lucide-react";
import { IconFolderCode } from "@tabler/icons-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/Components/ui/empty";
import { Skeleton } from "@/Components/ui/skeleton";
import { useMemo, useState } from "react";
import { Spinner } from "@/Components/ui/spinner";

export default function LikedArticlesPage() {
    const { likedArticles } = usePage().props;

    // =========================
    // STATE
    // =========================
    const [searchTerm, setSearchTerm] = useState(""); // input user
    const [searchQuery, setSearchQuery] = useState(""); // yang dipakai filter saat tombol search
    const [chosenCategory, setChosenCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("desc");
    const [visibleArticles, setVisibleArticles] = useState(8);
    const [isShowMoreLoading, setIsShowMoreloading] = useState(false);

    // =========================
    // CATEGORY LIST
    // =========================
    const categories = useMemo(() => {
        const unique = Array.from(
            new Set(likedArticles.map((a) => a.category)),
        );
        return ["All", ...unique];
    }, [likedArticles]);

    // Skeleton component
    const ArticleSkeleton = () => (
        <div className="border dark:border-gray-700 rounded-lg p-4 shadow-md flex flex-col justify-between bg-white dark:bg-gray-800">
            <Skeleton className="w-full h-64 mb-4 rounded" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex justify-between items-center mt-auto">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-4 w-8" />
                </div>
            </div>
        </div>
    );

    // =========================
    // HANDLE SEARCH
    // =========================
    const handleSearch = () => {
        setIsShowMoreloading(true);
        setTimeout(() => {
            setSearchQuery(searchTerm);
            setVisibleArticles(8);
            setIsShowMoreloading(false);
        }, 500);
    };

    const handleReset = () => {
        setIsShowMoreloading(true);
        setTimeout(() => {
            setSearchTerm("");
            setSearchQuery("");
            setChosenCategory("All");
            setSortOrder("desc");
            setVisibleArticles(8);
            setIsShowMoreloading(false);
        }, 500);
    };

    const handleShowMore = () => {
        // show spinner, then load more (small delay so spinner is visible)
        setIsShowMoreloading(true);
        setTimeout(() => {
            setVisibleArticles((prev) => prev + 8);
            setIsShowMoreloading(false);
        }, 400);
    };

    // =========================
    // FILTERING SYSTEM
    // =========================
    const filteredList = useMemo(() => {
        let data = [...likedArticles];

        if (chosenCategory !== "All") {
            data = data.filter((a) => a.category === chosenCategory);
        }

        if (searchQuery.trim() !== "") {
            const t = searchQuery.toLowerCase();
            data = data.filter(
                (a) =>
                    a.title.toLowerCase().includes(t) ||
                    a.user?.nickname?.toLowerCase().includes(t),
            );
        }

        data.sort((a, b) =>
            sortOrder === "asc"
                ? new Date(a.created_at) - new Date(b.created_at)
                : new Date(b.created_at) - new Date(a.created_at),
        );

        return data;
    }, [chosenCategory, searchQuery, sortOrder, likedArticles]);

    // =========================
    // CARD COMPONENT
    // =========================
    const cardRepeater = (data) =>
        data.slice(0, visibleArticles).map((article, idx) => {
            const previewText =
                article.contents?.find(
                    (c) =>
                        (c.type === "text" || c.type === "paragraph") &&
                        c.order_x === 1 &&
                        c.order_y === 1,
                )?.content ?? "";

            return (
                <div
                    key={idx}
                    className="border rounded-lg p-4 shadow-md flex flex-col justify-between dark:bg-gray-800 dark:border-gray-600"
                >
                    {article.thumbnail_url && (
                        <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-64 object-cover mb-4 rounded"
                        />
                    )}

                    <h2 className="text-lg font-semibold mb-2 text-center min-h-8 max-h-12 overflow-hidden dark:text-white">
                        {article.title.length > 50
                            ? article.title.slice(0, 50) + "..."
                            : article.title}
                    </h2>

                    <p className="text-sm text-gray-600 text-center mb-1 dark:text-gray-300">
                        by {article.user?.nickname ?? "Unknown"} ·{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-gray-500 text-center mb-2 dark:text-gray-400">
                        {article.category}
                    </p>

                    <p className="h-40 text-sm text-gray-700 mb-4 text-justify dark:text-gray-300">
                        {previewText.replace(/(<([^>]+)>)/gi, "").slice(0, 180)}
                        ...
                    </p>

                    <div className="flex justify-between items-center mt-auto">
                        <Link
                            href={`/articles/view/${article.id}?from=liked_articles`}
                            className="text-purple-700 hover:underline"
                        >
                            Read more →
                        </Link>

                        <div className="flex items-center gap-2">
                            <Toggle
                                pressed={true}
                                size="lg"
                                variant="outline"
                                className="data-[state=on]:bg-transparent
                                           data-[state=on]:*:[svg]:fill-red-500
                                           data-[state=on]:*:[svg]:stroke-red-500"
                            >
                                <Heart className="w-5 h-5" />
                            </Toggle>

                            <span className="text-sm text-gray-500 dark:text-gray-300">
                                {article.likes_count}
                            </span>
                        </div>
                    </div>
                </div>
            );
        });

    //Empty View
    const emptyView = (
        <Empty className="mt-20">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <IconFolderCode className="w-10 h-10 text-purple-600" />
                </EmptyMedia>
                <EmptyTitle>No Liked Articles Yet</EmptyTitle>
                <EmptyDescription>
                    Articles that you like will appear here.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
                <Button variant="outline" asChild>
                    <Link href="/articles/list">Browse Articles</Link>
                </Button>
            </EmptyContent>
        </Empty>
    );

    return (
        <Layout_User>
            {/* === Banner Section === */}
            <div className="w-full flex flex-col">
                <div
                    className="relative w-full h-[260px] md:h-[300px] bg-purple-700 overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/articleBook.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                            Liked Articles
                        </h1>
                        <p className="text-white/90 mt-2 text-sm md:text-base">
                            Your favorite and saved articles in one place.
                        </p>
                    </div>
                </div>

                {/* === Category Bar === */}
                <div
                    className="flex flex-row space-x-4 h-[75px] bg-purple-700 bg-cover bg-center w-full items-center justify-center"
                    style={{ background: "#7A338C" }}
                >
                    {categories.map((item, idx) => (
                        <Button
                            key={idx}
                            onClick={() => {
                                setIsShowMoreloading(true);
                                setTimeout(() => {
                                    setChosenCategory(item);
                                    setVisibleArticles(8);
                                    setIsShowMoreloading(false);
                                }, 500);
                            }}
                            className={`${
                                chosenCategory === item
                                    ? "bg-white text-purple-700 font-semibold shadow-md hover:bg-white"
                                    : " text-white hover:bg-purple-700 bg-purple-800"
                            }`}
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </div>

            {/* === Search + Sort === */}
            <div className="w-11/12 flex m-10 items-end justify-end gap-3 ">
                {/* Sort */}
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        setIsShowMoreloading(true);
                        setTimeout(() => {
                            setSortOrder(e.target.value);
                            setVisibleArticles(8);
                            setIsShowMoreloading(false);
                        }, 500);
                    }}
                    className="border rounded-md px-3 text-sm h-[38px] flex items-center focus:outline-none focus:ring-1 focus:ring-purple-700 bg-white hover:ring-1 hover:ring-purple-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                {/* Search */}
                <div className="flex">
                    <Input
                        placeholder="Search Articles"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus-visible:ring-1 focus-visible:ring-purple-700 hover:ring-1 hover:ring-purple-700 focus-visible:bg-purple-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />

                    <Button
                        variant="outline"
                        aria-label="Search"
                        onClick={handleSearch}
                        className="ml-0.5 hover:ring-1 hover:ring-purple-700 hover:bg-purple-100"
                    >
                        <SearchIcon />
                    </Button>

                    <Button
                        variant="outline"
                        aria-label="Reset"
                        onClick={handleReset}
                        className="hover:ring-1 ml-0.5 hover:ring-red-500 text-red-600 hover:bg-red-100 hover:text-red-800"
                    >
                        <RotateCcw />
                    </Button>
                </div>
            </div>

            {/* === Content Section === */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4">
                        <Separator className="flex-1" />
                        Liked Articles
                        <Separator className="flex-1" />
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {isShowMoreLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, idx) => (
                                <ArticleSkeleton key={idx} />
                            ))}
                        </div>
                    ) : filteredList.length === 0 ? (
                        emptyView
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cardRepeater(filteredList)}
                            </div>

                            {visibleArticles < filteredList.length && (
                                <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full gap-4 mt-10">
                                    <Separator className="flex-1 bg-gray-400 h-px" />
                                    <p
                                        onClick={() => handleShowMore()}
                                        className="text-xl text-black font-medium cursor-pointer inline-flex items-center gap-2"
                                    >
                                        {isShowMoreLoading && (
                                            <Spinner className="w-4 h-4" />
                                        )}
                                        Show More
                                    </p>
                                    <Separator className="flex-1 bg-gray-400 h-px" />
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </div>
        </Layout_User>
    );
}
