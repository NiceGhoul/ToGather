import Layout_User from "@/Layouts/Layout_User";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/Components/ui/empty";
import { CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { IconFolderCode } from "@tabler/icons-react";
import { Skeleton } from "@/Components/ui/skeleton";
import { useMemo, useState } from "react";
import { Separator } from "@/Components/ui/separator";
import { SearchIcon, RotateCcw } from "lucide-react";
import { Spinner } from "@/Components/ui/spinner";

export default function LikedCampaign() {
    const { likedCampaign } = usePage().props;

    // STATE
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [chosenCategory, setChosenCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("desc");
    const [visibleItems, setVisibleItems] = useState(8);
    const [isShowMoreLoading, setIsShowMoreloading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // CATEGORIES
    const categories = useMemo(() => {
        const unique = Array.from(
            new Set(likedCampaign.map((c) => c.category))
        );
        return ["All", ...unique];
    }, [likedCampaign]);

    // Skeleton component
    const CampaignSkeleton = () => (
        <div className="border dark:border-gray-700 rounded-lg p-4 shadow-md flex flex-col justify-between bg-white dark:bg-gray-800">
            <Skeleton className="w-full h-64 mb-4 rounded" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
            <Skeleton className="h-3 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex justify-center gap-2 mb-4">
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center mt-auto">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
    );

    // SEARCH / RESET
    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => {
            setSearchQuery(searchTerm);
            setVisibleItems(8);
            setIsLoading(false);
        }, 500);
    };
    const handleReset = () => {
        setIsLoading(true);
        setTimeout(() => {
            setSearchTerm("");
            setSearchQuery("");
            setChosenCategory("All");
            setSortOrder("desc");
            setVisibleItems(8);
            setIsLoading(false);
        }, 500);
    };

    const handleShowMore = () => {
        // show spinner, then load more (small delay so spinner is visible)
        setIsShowMoreloading(true);
        setTimeout(() => {
            setVisibleItems((prev) => prev + 8);
            setIsShowMoreloading(false);
        }, 400);
    };

    // FILTER
    const filteredList = useMemo(() => {
        let data = [...likedCampaign];

        if (chosenCategory !== "All") {
            data = data.filter((c) => c.category === chosenCategory);
        }

        if (searchQuery.trim() !== "") {
            const t = searchQuery.toLowerCase();
            data = data.filter(
                (c) =>
                    c.title.toLowerCase().includes(t) ||
                    (c.organizer?.toLowerCase?.() ?? "").includes(t)
            );
        }

        data.sort((a, b) =>
            sortOrder === "asc"
                ? new Date(a.created_at) - new Date(b.created_at)
                : new Date(b.created_at) - new Date(a.created_at)
        );

        return data;
    }, [chosenCategory, searchQuery, sortOrder, likedCampaign]);

    // CARD
    const cardRepeater = (data) =>
        data.slice(0, visibleItems).map((campaign, idx) => {
            const progress =
                campaign.goal_amount > 0
                    ? Math.min(
                          (campaign.collected_amount / campaign.goal_amount) *
                              100,
                          100
                      ).toFixed(1)
                    : "0.0";

            const previewDesc =
                campaign.description
                    ?.replace(/(<([^>]+)>)/gi, "")
                    .slice(0, 180) ?? "No description available.";

            return (
                <div
                    key={idx}
                    className="border rounded-lg p-4 shadow-md flex flex-col justify-between dark:bg-gray-800 dark:border-gray-600"
                >
                    {campaign.thumbnail_url ? (
                        <img
                            src={campaign.thumbnail_url}
                            alt={campaign.title}
                            className="w-full h-64 object-cover mb-4 rounded"
                        />
                    ) : (
                        <img
                            src="http://127.0.0.1:8000/images/boat.jpg"
                            alt={campaign.title}
                            className="w-full h-64 object-cover mb-4 rounded"
                        />
                    )}

                    <h2 className="text-lg font-semibold mb-2 text-center min-h-8 max-h-12 overflow-hidden dark:text-white">
                        {campaign.title.length > 50
                            ? campaign.title.slice(0, 50) + "..."
                            : campaign.title}
                    </h2>

                    <p className="text-sm text-gray-600 text-center mb-1 dark:text-gray-300">
                        {new Date(campaign.created_at).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-gray-500 text-center mb-2 dark:text-gray-400">
                        {campaign.category ?? "Uncategorized"}
                    </p>

                    <p className="h-20 text-sm text-gray-700 mb-4 text-justify dark:text-gray-300">
                        {previewDesc}...
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div
                            className="bg-purple-700 h-3 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 text-center dark:text-gray-300">
                        Raised{" "}
                        {parseInt(
                            campaign.collected_amount || 0
                        ).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}{" "}
                        /{" "}
                        {parseInt(campaign.goal_amount || 0).toLocaleString(
                            "id-ID",
                            {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 2,
                            }
                        )}{" "}
                        ({progress}%)
                    </p>

                    <div className="flex justify-center gap-2 mb-4">
                        <span
                            className={`inline-block text-xs font-semibold px-2 py-1 rounded-full
                            ${
                                campaign.status === "active"
                                    ? "dark:bg-green-700 dark:text-white  bg-green-200  text-green-700"
                                    : campaign.status === "pending"
                                    ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-600 dark:text-white"
                                    : campaign.status === "rejected" ||
                                      campaign.status === "banned"
                                    ? "bg-red-200 text-red-700 dark:bg-red-600 dark:text-white"
                                    : "bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-white"
                            }`}
                        >
                            {campaign.status?.toUpperCase?.() ?? "UNKNOWN"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                        <Link
                            href={`/campaigns/details/${campaign.id}?from=likedCampaign`}
                            className="text-purple-700 hover:underline"
                        >
                            View Details →
                        </Link>
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                            {campaign.likes_count ?? campaign.likes ?? 0} Likes
                        </span>
                    </div>
                </div>
            );
        });

    // EMPTY
    const emptyView = (
        <Empty className="mt-20">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <IconFolderCode className="w-10 h-10 text-purple-600" />
                </EmptyMedia>
                <EmptyTitle>No Campaigns Liked Yet</EmptyTitle>
                <EmptyDescription>
                    All of your liked campaigns will be shown here.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
                <Button variant="outline" asChild>
                    <Link href="/campaigns/list">Browse Campaigns</Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
    const randomIndex = Math.floor(Math.random() * filteredList.length);
    return (
        <Layout_User>
            {/* Banner */}
            <div className="w-full flex flex-col">
                <div className="relative w-full h-[260px] md:h-[300px] bg-purple-700 overflow-hidden">
                    <img
                        src={
                            filteredList.length > 0 &&
                            filteredList[randomIndex].thumbnail_url
                                ? filteredList[randomIndex].thumbnail_url
                                : "http://127.0.0.1:8000/images/boat.jpg"
                        }
                        alt="Campaign Banner"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                            Liked Campaigns
                        </h1>
                        <p className="text-white/90 mt-2 text-sm md:text-base">
                            Your favorite campaigns in one place.
                        </p>
                    </div>
                </div>

                {/* Category Bar */}
                <div
                    className="flex flex-row space-x-4 h-[75px] bg-purple-700 bg-cover bg-center w-full items-center justify-center"
                    style={{ background: "#7A338C" }}
                >
                    {categories.map((item, idx) => (
                        <Button
                            key={idx}
                            onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    setChosenCategory(item);
                                    setVisibleItems(8);
                                    setIsLoading(false);
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

            {/* Search + Sort */}
            <div className="w-11/12 flex m-10 items-end justify-end gap-3 ">
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        setIsLoading(true);
                        setTimeout(() => {
                            setSortOrder(e.target.value);
                            setVisibleItems(8);
                            setIsLoading(false);
                        }, 500);
                    }}
                    className="border rounded-md px-3 text-sm h-[38px] flex items-center focus:outline-none focus:ring-1 focus:ring-purple-700 bg-white hover:ring-1 hover:ring-purple-700 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <div className="flex">
                    <Input
                        placeholder="Search Campaigns"
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

            {/* Content */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4">
                        <Separator className="flex-1" />
                        Liked Campaigns
                        <Separator className="flex-1" />
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, idx) => (
                                <CampaignSkeleton key={idx} />
                            ))}
                        </div>
                    ) : filteredList.length === 0 ? (
                        emptyView
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cardRepeater(filteredList)}
                            </div>

                            {visibleItems < filteredList.length && (
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
