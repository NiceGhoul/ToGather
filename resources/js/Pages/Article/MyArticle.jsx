import Layout_User from "@/Layouts/Layout_User";
import { Link, router, usePage } from "@inertiajs/react";
import { CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Toggle } from "@/Components/ui/toggle";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Skeleton } from "@/Components/ui/skeleton";
import { ButtonGroup } from "@/Components/ui/button-group";
import { Input } from "@/Components/ui/input";
import { SearchIcon, Heart } from "lucide-react";
import { Spinner } from "@/Components/ui/spinner";
import { useEffect, useState } from "react";
import { IconFolderCode } from "@tabler/icons-react";
import { ArrowUpRightIcon, RotateCcw } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/Components/ui/empty";

export default function MyArticle({
    articles = [],
    categories = [],
    sortOrder: initialSortOrder,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [visibleArticles, setVisibleArticles] = useState(8);
    const [articleList, setArticleList] = useState(articles || []);
    const [chosenCategory, setChosenCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState(initialSortOrder || "desc");
    const [isShowMoreLoading, setIsShowMoreloading] = useState(false);

    const [likesState, setLikesState] = useState(
        Object.fromEntries(
            (articles || []).map((a) => [a.id, a.is_liked_by_user ?? false])
        )
    );
    const handleShowMore = () => {
        // show spinner, then load more (small delay so spinner is visible)
        setIsShowMoreloading(true);
        setTimeout(() => {
            setVisibleArticles((prev) => prev + 8);
            setIsShowMoreloading(false);
        }, 400);
    };

    useEffect(() => {
        if (articles?.length) {
            setArticleList(articles);
            setIsLoading(false);
        } else {
            // Simulate loading for initial page load
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [articles]);

    useEffect(() => {
        setVisibleArticles(8);
    }, [chosenCategory, searchTerm]);

    const handleCategoryChange = (activeCategory) => {
        setIsLoading(true);
        router.get(
            "/articles/myArticles",
            {
                category: activeCategory,
                search: searchTerm,
                sort: sortOrder,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setArticleList(page.props.articles);
                    setChosenCategory(activeCategory);
                    setVisibleArticles(8);

                    setIsLoading(false);
                },
                onError: () => setIsLoading(false),
            }
        );
    };

    const handleSearch = () => {
        setIsLoading(true);
        router.get(
            "/articles/myArticles",
            {
                category: chosenCategory === "" ? "All" : chosenCategory,
                sort: sortOrder,
                search: searchTerm, // ⬅️ kirim ke backend
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setArticleList(page.props.articles);
                    setIsLoading(false);
                },
                onError: () => setIsLoading(false),
            }
        );
    };

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

            // ubah status liked
            setLikesState((prev) => ({
                ...prev,
                [articleId]: data.isLiked,
            }));

            // 🔥 update juga jumlah likes di articleList supaya langsung kelihatan
            setArticleList((prevList) =>
                prevList.map((article) =>
                    article.id === articleId
                        ? {
                              ...article,
                              likes_count:
                                  data.likesCount ??
                                  article.likes_count + (data.isLiked ? 1 : -1),
                          }
                        : article
                )
            );
        } catch (error) {
            console.error("Error liking article:", error);
        }
    };

    // Skeleton card component
    const ArticleSkeleton = () => (
        <div className="border dark:border-gray-700 rounded-lg p-4 shadow-md flex flex-col justify-between bg-white dark:bg-gray-800">
            <Skeleton className="w-full h-64 mb-4 rounded" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex justify-center gap-2 mb-4">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center mt-auto">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-4 w-8" />
                </div>
            </div>
        </div>
    );

    const cardRepeater = (data) => {
        if (!data || data.length === 0) {
            return <p>No articles available.</p>;
        } else {
            return data.slice(0, visibleArticles).map((article, idx) => {
                const previewText =
                    article.contents?.find(
                        (c) =>
                            (c.type === "text" || c.type === "paragraph") &&
                            c.order_x === 1 &&
                            c.order_y === 1
                    )?.content || "";

                const liked = likesState[article.id] || false;

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

                        <h2 className="text-lg font-semibold mb-2 min-h-8 max-h-12 overflow-hidden text-center leading-snug">
                            {article.title.length > 50
                                ? article.title.substring(0, 50) + "..."
                                : article.title}
                        </h2>

                        <p className="text-sm text-gray-600 text-center mb-2 dark:text-white">
                            {new Date(article.created_at).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500 text-center mb-2 dark:text-white">
                            {article.category ?? "Uncategorized"}
                        </p>

                        <p className="h-32 text-sm text-gray-700 mb-4 text-justify dark:text-white">
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
                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                            >
                                {article.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                            <Link
                                href={`/articles/view/${article.id}/details`}
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
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {article.likes_count ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            });
        }
    };

    return (
        <Layout_User>
            {/* === Banner Section === */}
            <div className="w-full flex flex-col">
                <div
                    className="relative w-full h-[260px] md:h-[300px] bg-purple-700 overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/writingArticle.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                            Manage & Review Your Own Articles
                        </h1>
                        <p className="text-white/90 mt-2 text-sm md:text-base">
                            Track, edit, and see how readers respond to your
                            creations
                        </p>
                    </div>
                </div>

                {/* === Category Bar === */}
                <div
                    className="flex flex-row space-x-4 h-[75px] bg-gray-300 bg-cover bg-center w-full items-center justify-center"
                    style={{ background: "#7A338C" }}
                >
                    {categories?.length > 0 && (
                        <Button
                            key={999}
                            onClick={() => handleCategoryChange("All")}
                            className={`${
                                chosenCategory === "All"
                                    ? "bg-white text-purple-700 font-semibold shadow-md hover:bg-white"
                                    : " text-white hover:bg-purple-700 bg-purple-800"
                            }`}
                        >
                            All
                        </Button>
                    )}

                    {categories?.map((item, idx) => (
                        <Button
                            key={idx}
                            onClick={() => handleCategoryChange(item)}
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
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setSortOrder(newSort);
                        setIsLoading(true);
                        router.get(
                            "/articles/myArticles",
                            {
                                category:
                                    chosenCategory === ""
                                        ? "All"
                                        : chosenCategory,
                                sort: newSort,
                                search: searchTerm,
                            },
                            {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: (page) => {
                                    setArticleList(page.props.articles);
                                    setIsLoading(false);
                                },
                                onError: () => setIsLoading(false),
                            }
                        );
                    }}
                    className="border rounded-md px-3 text-sm h-[38px] flex items-center focus:outline-none focus:ring-1 focus:ring-purple-700 appearance-none bg-white hover:ring-1 hover:ring-purple-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <ButtonGroup className="w-84 ">
                    <Input
                        placeholder="Search My Articles"
                        value={searchTerm} // ⬅️ ini penting biar gak hilang
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className=" focus-visible:ring-1 focus-visible:ring-purple-700 hover:ring-1 hover:ring-purple-700 focus-visible:bg-purple-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                        onClick={() => {
                            setSearchTerm("");
                            setSortOrder("desc");
                            setChosenCategory("All");
                            setIsLoading(true);

                            router.get(
                                "/articles/myArticles",
                                { category: "All", sort: "desc", search: "" },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                    onSuccess: (page) => {
                                        setArticleList(page.props.articles);
                                        setIsLoading(false);
                                    },
                                    onError: () => setIsLoading(false),
                                }
                            );
                        }}
                        className="hover:ring-1 ml-0.5 hover:ring-red-500 text-red-600 hover:bg-red-100 hover:text-red-800"
                    >
                        <RotateCcw />
                    </Button>
                </ButtonGroup>
            </div>

            {/* === Article Grid === */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4">
                        <Separator className="flex-1" />
                        My Articles
                        <Separator className="flex-1" />
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, idx) => (
                                <ArticleSkeleton key={idx} />
                            ))}
                        </div>
                    ) : articleList?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {cardRepeater(articleList)}
                        </div>
                    ) : (
                        // ⬇️ Ganti bagian ini
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <IconFolderCode className="w-10 h-10 text-purple-600" />
                                </EmptyMedia>
                                <EmptyTitle>No Articles Yet</EmptyTitle>
                                <EmptyDescription>
                                    You haven&apos;t written any articles yet.
                                    Start by creating your first one below.
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        asChild
                                        className="bg-purple-700 hover:bg-purple-800 text-white"
                                    >
                                        <Link href="/articles/create">
                                            Create Article
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/articles/list">
                                            Browse Articles
                                        </Link>
                                    </Button>
                                </div>
                            </EmptyContent>

                            <Button
                                variant="link"
                                asChild
                                className="text-muted-foreground mt-2"
                                size="sm"
                            >
                                <a href="#">
                                    Learn More{" "}
                                    <ArrowUpRightIcon className="w-4 h-4 ml-1" />
                                </a>
                            </Button>
                        </Empty>
                    )}
                    {!isLoading && visibleArticles < articleList?.length && (
                        <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full gap-4 mt-10">
                            <Separator className="flex-1 bg-gray-400 h-px" />
                            <p
                                onClick={() => {
                                    handleShowMore();
                                }}
                                className=" text-xl text-black dark:text-white font-medium cursor-pointer inline-flex items-center gap-2"
                            >
                                Show More
                                {isShowMoreLoading && (
                                    <Spinner className="w-4 h-4" />
                                )}
                            </p>
                            <Separator className="flex-1 bg-gray-400 h-px" />
                        </div>
                    )}
                </CardContent>
            </div>
        </Layout_User>
    );
}
