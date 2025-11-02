import Layout_User from "@/Layouts/Layout_User";
import { Link, router, usePage } from "@inertiajs/react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { SearchIcon, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { IconFolderCode } from "@tabler/icons-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { set } from "date-fns";

export default function MyCampaign({
    campaigns = [],
    categories = [],
    sortOrder: initialSortOrder,
}) {
    const [visibleCampaigns, setVisibleCampaigns] = useState(8);
    const [campaignList, setCampaignList] = useState(() => {
        if (!campaigns) return [];
        // Urutkan agar active & pending muncul di depan
        const sorted = [...campaigns].sort((a, b) => {
            const order = {
                active: 1,
                pending: 2,
                approved: 3,
                rejected: 4,
                banned: 5,
            };
            return (order[a.status] || 99) - (order[b.status] || 99);
        });
        return sorted;
    });

    const [chosenCategory, setChosenCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState(initialSortOrder || "desc");

    useEffect(() => {
        setVisibleCampaigns(8);
    }, [chosenCategory, searchTerm]);

    const handleCategoryChange = (activeCategory) => {
        router.get(
            "/campaigns/myCampaigns",
            {
                category: activeCategory,
                search: searchTerm,
                sort: sortOrder,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setCampaignList(page.props.campaigns);
                    setChosenCategory(activeCategory);
                    setVisibleCampaigns(8);
                },
            }
        );
    };

    const handleSearch = () => {
        router.get(
            "/campaigns/myCampaigns",
            {
                category: chosenCategory === "" ? "All" : chosenCategory,
                sort: sortOrder,
                search: searchTerm,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setCampaignList(page.props.campaigns);
                },
            }
        );
    };

    const cardRepeater = (data) => {
        if (!data || data.length === 0) {
            return <p>No campaigns available.</p>;
        } else {
            return data.slice(0, visibleCampaigns).map((campaign, idx) => {
                const progress =
                    campaign.goal_amount > 0
                        ? Math.min(
                              (campaign.collected_amount /
                                  campaign.goal_amount) *
                                  100,
                              100
                          ).toFixed(1)
                        : 0;

                return (
                    <div
                        key={idx}
                        className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
                    >
                        {!campaign.thumbnail_url && (
                            <img
                                src="http://127.0.0.1:8000/images/boat.jpg"
                                alt={campaign.title}
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                        )}

                        <h2 className="text-lg font-semibold mb-2 text-center min-h-[2rem] max-h-[3rem] overflow-hidden leading-snug">
                            {campaign.title.length > 50
                                ? campaign.title.substring(0, 50) + "..."
                                : campaign.title}
                        </h2>

                        <p className="text-sm text-gray-600 text-center mb-2">
                            {new Date(campaign.created_at).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500 text-center mb-2">
                            {campaign.category ?? "Uncategorized"}
                        </p>

                        <p className="text-sm text-gray-700 mb-3 text-justify">
                            {campaign.description
                                ?.replace(/(<([^>]+)>)/gi, "")
                                .slice(0, 150) || "No description available."}
                            ...
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div
                                className="bg-purple-700 h-3 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 text-center">
                            Raised Rp{" "}
                            {campaign.collected_amount?.toLocaleString("id-ID")}{" "}
                            / Rp {campaign.goal_amount?.toLocaleString("id-ID")}{" "}
                            ({progress}%)
                        </p>

                        <div className="flex justify-center gap-2 mb-4">
                            <span
                                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full
                            ${
                                campaign.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : campaign.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : campaign.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : campaign.status === "banned"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-purple-100 text-purple-700"
                            }`}
                            >
                                {campaign.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex justify-center mt-auto">
                            <Link
                                href={`/campaigns/details/${campaign.id}`}
                                className="text-purple-700 hover:underline font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                );
            });
        }
    };

    return (
        <Layout_User>
            {/* === Banner === */}
            <div className="w-full flex flex-col">
                <div className="relative w-full h-[260px] md:h-[300px] bg-purple-700 overflow-hidden">
                    <img
                        src="http://127.0.0.1:8000/images/campaignBanner.jpg"
                        alt="Campaign Banner"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                            Manage & Review Your Campaigns
                        </h1>
                        <p className="text-white/90 mt-2 text-sm md:text-base">
                            Track, edit, and monitor your fundraising progress
                        </p>
                    </div>
                </div>

                {/* === Category Filter === */}
                <div
                    className="flex flex-row space-x-4 h-[75px] bg-cover bg-center w-full items-center justify-center"
                    style={{ background: "#7A338C" }}
                >
                    {categories?.length > 0 && (
                        <Button
                            key={999}
                            onClick={() => handleCategoryChange("All")}
                            className={`${
                                chosenCategory === "All"
                                    ? "bg-white text-purple-700 font-semibold shadow-md hover:bg-white"
                                    : "text-white hover:bg-purple-700 bg-purple-800"
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
                                    : "text-white hover:bg-purple-700 bg-purple-800"
                            }`}
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </div>

            {/* === Search & Sort === */}
            <div className="w-11/12 flex m-10 items-end justify-end gap-3">
                <select
                    value={sortOrder}
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setSortOrder(newSort);
                        router.get(
                            "/campaigns/myCampaigns",
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
                                    setCampaignList(page.props.campaigns);
                                },
                            }
                        );
                    }}
                    className="border rounded-md px-3 text-sm h-[38px] focus:outline-none focus:ring-1 focus:ring-purple-700 appearance-none bg-white hover:ring-1 hover:ring-purple-700"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <ButtonGroup>
                    <Input
                        placeholder="Search My Campaigns"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus-visible:ring-1 focus-visible:ring-purple-700 hover:ring-1 hover:ring-purple-700 focus-visible:bg-purple-100"
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

                            router.get(
                                "/campaigns/myCampaigns",
                                { category: "All", sort: "desc", search: "" },
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                    onSuccess: (page) => {
                                        setCampaignList(page.props.campaigns);
                                    },
                                }
                            );
                        }}
                        className="hover:ring-1 ml-0.5 hover:ring-red-500 text-red-600 hover:bg-red-100 hover:text-red-800"
                    >
                        <RotateCcw />
                    </Button>
                </ButtonGroup>
            </div>

            {/* === Campaign Grid === */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4">
                        <Separator className="flex-1" />
                        My Campaigns
                        <Separator className="flex-1" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {campaignList?.length > 0 ? (
                        <>
                            {/* === Grid === */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cardRepeater(campaignList)}
                            </div>

                            {/* === Show More (gaya seperti di ArticleList) === */}
                            {visibleCampaigns < campaignList?.length && (
                                <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full gap-4 mt-10">
                                    <Separator className="flex-1 bg-gray-400 h-[1px]" />
                                    <p
                                        onClick={() =>
                                            setVisibleCampaigns(
                                                (prev) => prev + 8
                                            )
                                        }
                                        className="text-sm text-gray-400 font-thin cursor-pointer hover:text-gray-600 transition-colors"
                                    >
                                        show more
                                    </p>
                                    <Separator className="flex-1 bg-gray-400 h-[1px]" />
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <IconFolderCode className="w-10 h-10 text-purple-600" />
                                </EmptyMedia>
                                <EmptyTitle>No Campaigns Yet</EmptyTitle>
                                <EmptyDescription>
                                    You haven&apos;t started any campaigns yet.
                                    Launch your first one below!
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        asChild
                                        className="bg-purple-700 hover:bg-purple-800 text-white"
                                    >
                                        <Link href="/campaigns/create">
                                            Create Campaign
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/campaigns/list">
                                            Browse Campaigns
                                        </Link>
                                    </Button>
                                </div>
                            </EmptyContent>
                        </Empty>
                    )}
                </CardContent>
            </div>
        </Layout_User>
    );
}
