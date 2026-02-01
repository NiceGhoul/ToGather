import Layout_User from "@/Layouts/Layout_User";
import { Link, router, usePage } from "@inertiajs/react";
import { CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { ButtonGroup } from "@/Components/ui/button-group";
import { Input } from "@/Components/ui/input";
import { SearchIcon, RotateCcw, Currency } from "lucide-react";
import { useEffect, useState } from "react";
import { IconFolderCode } from "@tabler/icons-react";
import { Spinner } from "@/Components/ui/spinner";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/Components/ui/empty";
import Popup from "@/Components/Popup";
import { toast } from "sonner";

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
    const [images, setImages] = useState({ thumbnail: null });
    const [openPop, setOpenPop] = useState(-1);
    const [isShowMoreLoading, setIsShowMoreloading] = useState(false);

    useEffect(() => {
        if (campaigns.images && images.thumbnail === null) {
            campaigns.images.map((dat) => {
                dat.url.toLowerCase().includes("thumbnail")
                    ? setImages((prev) => ({ ...prev, thumbnail: dat.url }))
                    : setImages((prev) => ({ ...prev, logo: dat.url }));
            });
        }
    }, [campaigns]);

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

    const handleShowMore = () => {
        setIsShowMoreloading(true);
        setTimeout(() => {
            setVisibleCampaigns((prev) => prev + 8);
            setIsShowMoreloading(false);
        }, 400);
    };

    const handleMoveToEdit = (id) => {
        router.get(`/campaigns/create/detailsPreview/${id}?from=myCampaigns`);
    };

    const handleDeleteCampaign = (id) => {
        setCampaignList(campaignList.filter((dat) => dat.id != id));
        router.post(`/campaigns/deleteCampaign/${id}`);
        setOpenPop(-1);
    };

    const cardRepeater = (data) => {
        if (!data || data.length === 0) {
            return <p>No campaigns available.</p>;
        } else {
            return data.slice(0, visibleCampaigns).map((campaign, idx) => {
                const progress =
                    campaign.goal_amount > 0
                        ? Math.round(
                              (campaign.collected_amount /
                                  campaign.goal_amount) *
                                  100
                          )
                        : 0;

                return (
                    <div
                        key={idx}
                        className="border rounded-lg p-4 shadow-md flex flex-col justify-between dark:bg-gray-800"
                    >
                        {!images.thumbnail && (
                            <img
                                src={campaign?.images[0]?.url}
                                alt={campaign.title}
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                        )}

                        <h2 className="text-lg font-semibold mb-2 items-center justify-center flex text-center min-h-12 max-h-12 overflow-hidden leading-snug dark:text-white">
                            {campaign.title.length > 50
                                ? campaign.title.substring(0, 50) + "..."
                                : campaign.title}
                        </h2>

                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                            {new Date(campaign.created_at).toLocaleDateString()}
                        </p>

                        <div className="flex justify-center gap-2 mb-4">
                            <span
                                className={`text-sm font-semibold rounded-sm text-center px-4 py-1 mb-2 bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-white`}
                            >
                                {campaign.category ?? "Uncategorized"}
                            </span>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 text-justify min-h-25">
                            {campaign.description
                                ?.replace(/(<([^>]+)>)/gi, "")
                                .slice(0, 150) || "No description available."}
                            ...
                        </p>

                        <div className="w-full bg-gray-200 dark:bg-gray-400 rounded-full h-3 mb-3">
                            <div
                                className="bg-purple-700 h-3 rounded-full"
                                style={{
                                    width: `${Math.min(progress, 100).toFixed(1)}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex flex-row gap-2 justify-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 text-center">
                                Raised{" "}
                                {parseInt(
                                    campaign.collected_amount,
                                )?.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 2,
                                })}
                                {"/"}
                                {parseInt(campaign.goal_amount)?.toLocaleString(
                                    "id-ID",
                                    {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 2,
                                    },
                                )}{" "}
                                ({progress}%)
                            </p>
                        </div>

                        <div className="flex justify-center gap-2 mb-4">
                            <span
                                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full
                            ${
                                campaign.status === "active"
                                    ? "bg-green-200 dark:bg-green-700 text-green-700 dark:text-white"
                                    : campaign.status === "pending"
                                      ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-500 dark:text-white"
                                      : campaign.status === "rejected"
                                        ? "bg-red-200 dark:bg-red-700 text-red-700 dark:text-white"
                                        : campaign.status === "banned"
                                          ? "bg-red-200 dark:bg-red-700 text-red-700 dark:text-white"
                                          : "bg-purple-200 text-purple-700 dark:bg-purple-700 dark:text-white"
                            }`}
                            >
                                {campaign.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-center mt-auto">
                            {campaign.status != "completed" ? (
                                <div className="gap-4 flex justify-center items-center">
                                    {campaign.status === "draft" && (
                                        <Button
                                            className="bg-transparent text-purple-700 dark:text-purple-500 hover:bg-purple-100 text-lg"
                                            onClick={() =>
                                                setOpenPop(campaign.id)
                                            }
                                        >
                                            {"✖ Cancel"}
                                        </Button>
                                    )}
                                    {campaign.status != "rejected" && (
                                        <>
                                            {campaign.status === "active" && (
                                                <Link
                                                    href={`/campaigns/details/${campaign.id}?from=myCampaigns`}
                                                    className="text-purple-700 dark:text-purple-500 hover:underline text-lg font-medium"
                                                >
                                                    View Details →
                                                </Link>
                                            )}
                                            <Button
                                                onClick={() =>
                                                    handleMoveToEdit(
                                                        campaign.id,
                                                    )
                                                }
                                                className="bg-transparent text-purple-700 dark:text-purple-500 hover:bg-purple-100 text-lg"
                                            >
                                                Edit →
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={`/campaigns/details/${campaign.id}`}
                                    className="text-purple-700 dark:text-purple-500 hover:underline text-lg font-medium"
                                >
                                    View Details →
                                </Link>
                            )}
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
                <div
                    className="relative w-full h-[260px] md:h-[300px] bg-purple-700 overflow-hidden"
                    style={{
                        backgroundImage: "url('/images/celenganWang.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-30"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
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
                            },
                        );
                    }}
                    className="border rounded-md px-3 text-sm h-[38px] focus:outline-none focus:ring-1 focus:ring-purple-700 appearance-none dark:bg-black hover:ring-1 hover:ring-purple-700"
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
                                        const sorted = [
                                            ...page.props.campaigns,
                                        ].sort((a, b) => {
                                            const order = {
                                                active: 1,
                                                pending: 2,
                                                approved: 3,
                                                rejected: 4,
                                                banned: 5,
                                            };
                                            return (
                                                (order[a.status] || 99) -
                                                (order[b.status] || 99)
                                            );
                                        });
                                        setCampaignList(sorted);
                                    },
                                },
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

                            {visibleCampaigns < campaignList?.length && (
                                <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full gap-4 mt-10">
                                    <Separator className="flex-1 bg-gray-400 h-px" />
                                    <p
                                        onClick={() => handleShowMore()}
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

            <Popup
                open={openPop === -1 ? false : true}
                onClose={() => setOpenPop(-1)}
                triggerText={null}
                title={"you are about to delete a campaign!"}
                description={
                    "This will remove all instances of data associated to this campaign. Are you sure to continue?"
                }
                confirmText={"Confirm"}
                cancelText="Cancel"
                showCancel={true}
                confirmColor={"bg-red-600 hover:bg-red-700 text-white"}
                onConfirm={() => handleDeleteCampaign(openPop)}
            />
        </Layout_User>
    );
}
