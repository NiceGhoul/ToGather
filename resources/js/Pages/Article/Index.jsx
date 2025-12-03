import { Button } from "@/Components/ui/button";
import Layout_User from "@/Layouts/Layout_User";
import Layout_Guest from "@/Layouts/Layout_Guest";
import { CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Link, router, usePage } from "@inertiajs/react";
import { Separator } from "@/Components/ui/separator";
import { Skeleton } from "@/Components/ui/skeleton";
import { useEffect, useState } from "react";
import { ButtonGroup } from "@/Components/ui/button-group";
import { Input } from "@/Components/ui/input";
import { SearchIcon, Heart, RotateCcw } from "lucide-react";
import { Toggle } from "@/Components/ui/toggle";
import { Spinner } from "@/Components/ui/spinner";

const ArticleList = () => {
    // 🟣 Ambil props dari backend
    const {
        articles,
        categories,
        sortOrder: initialSortOrder,
        auth,
    } = usePage().props;
    const [isShowMoreLoading, setIsShowMoreloading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // 🟣 Inisialisasi state lokal
    const [visibleArticles, setVisibleArticles] = useState(8);
    const [articleList, setArticleList] = useState(articles || []);
    const [chosenCategory, setChosenCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState(initialSortOrder || "desc");
    const [isLogin, setIsLogin] = useState(false);

    // 🟣 Check authentication status
    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);

    // 🟣 State untuk Like
    const [likesState, setLikesState] = useState(
        Object.fromEntries(
            (articles || []).map((a) => [a.id, a.is_liked_by_user ?? false])
        )
    );

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
            "/articles/list",
            {
                category: activeCategory,
                search: searchTerm, // ⬅️ ikutkan search
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
            "/articles/list",
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
            if (response.status === 401) {
                router.visit("/login");
                return;
            }

            const data = await response.json();

            setLikesState((prev) => ({
                ...prev,
                [articleId]: data.isLiked,
            }));

            router.reload({ only: ["articles"] });
        } catch (error) {
            console.error("Error liking article:", error);
        }
    };

    const handleShowMore = () => {
        // show spinner, then load more (small delay so spinner is visible)
        setIsShowMoreloading(true);
        setTimeout(() => {
            setVisibleArticles((prev) => prev + 8);
            setIsShowMoreloading(false);
        }, 400);
    };

    // Skeleton card component
    const ArticleSkeleton = () => (
        <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
            <Skeleton className="w-full h-64 mb-4 rounded" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-16 w-full mb-6" />
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
                        className="border rounded-lg p-4 shadow-md flex flex-col justify-between dark:bg-gray-800 dark:border-gray-700"
                    >
                        {article.thumbnail_url && (
                            <img
                                src={article.thumbnail_url}
                                alt={article.title}
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                        )}

                        <h2 className="text-lg font-semibold mb-2 min-h-8 max-h-12 overflow-hidden text-center leading-snug dark:text-white">
                            {article.title.length > 50
                                ? article.title.substring(0, 50) + "..."
                                : article.title}
                        </h2>

                        <p className="text-sm text-gray-600 text-center mb-2 dark:text-gray-400">
                            by {article.user?.nickname ?? "Unknown"} ·{" "}
                            {new Date(article.created_at).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500 text-center mb-4 dark:text-gray-400">
                            {article.category ?? "Uncategorized"}
                        </p>

                        <p className="text-sm text-gray-700 mb-6 text-justify dark:text-gray-300 h-40 overflow-hidden">
                            {previewText
                                .replace(/(<([^>]+)>)/gi, "")
                                .slice(0, 180) || "No preview text."}
                            ...
                        </p>

                        <div className="flex justify-between items-center mt-auto">
                            <Link
                                href={`/articles/${article.id}?from=articles_list`}
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

    // 🟣 Dynamic Layout based on authentication
    const Layout = isLogin ? Layout_User : Layout_Guest;

    return (
        <Layout>
            {/* === Banner Section === */}
            <div className="w-full flex flex-col">
                <div
                    className="relative w-full h-[260px] md:h-[300px] bg-purple-700 overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/articleBook.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md dark:text-white">
                            Discover Stories, Insights & Ideas
                        </h1>
                        <p className="text-white/90 mt-2 text-sm md:text-base">
                            Stay inspired with our latest articles and
                            perspectives
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

            {/* === Search Bar + Sort === */}
            <div className="w-11/12 flex m-10 items-end justify-end gap-3">
                {/* Dropdown Sort */}
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setSortOrder(newSort);
                        setIsLoading(true);
                        router.get(
                            "/articles/list",
                            {
                                category:
                                    chosenCategory === ""
                                        ? "All"
                                        : chosenCategory, // ⬅️ pastikan tetap kirim kategori
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
                    className="border rounded-md px-3 text-sm h-[38px] flex items-center focus:outline-none focus:ring-1 focus:ring-purple-700 appearance-none  bg-white hover:ring-1 hover:ring-purple-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                {/* Search Input */}
                <ButtonGroup className="w-84">
                    <Input
                        placeholder="Search Articles"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus-visible:ring-1 focus-visible:ring-purple-700 hover:ring-1 hover:ring-purple-700 focus-visible:bg-purple-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus-visible:bg-purple-900/30"
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
                                "/articles/list",
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

            {/* === Article Section === */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4">
                        <Separator className="flex-1" />
                        {chosenCategory === "All"
                            ? "All Articles"
                            : chosenCategory}
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
                        <p className="flex flex-col justify-center items-center w-full mx-auto text-center text-gray-500 mt-20 dark:text-gray-400">
                            No articles found.
                        </p>
                    )}

                    {!isLoading && visibleArticles < articleList?.length && (
                        <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full gap-4 mt-10">
                            <Separator className="flex-1 bg-gray-400 h-px" />
                            <p
                                onClick={handleShowMore}
                                className=" text-xl text-black font-medium cursor-pointer inline-flex items-center gap-2"
                            >
                                {isShowMoreLoading && (
                                    <Spinner className="w-4 h-4" />
                                )}
                                Show More
                            </p>
                            <Separator className="flex-1 bg-gray-400 h-px" />
                        </div>
                    )}
                </CardContent>
            </div>
        </Layout>
    );
};

export default ArticleList;
