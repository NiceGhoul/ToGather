import { Button } from "@/Components/ui/button";
import Layout_User from "@/Layouts/Layout_User";
import Layout_Guest from "@/Layouts/Layout_Guest";
import { CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Link, router, usePage } from "@inertiajs/react";
import { Separator } from "@/Components/ui/separator";
import { useEffect, useState } from "react";
import { ButtonGroup } from "@/Components/ui/button-group";
import { Input } from "@/Components/ui/input";
import { SearchIcon } from "lucide-react";
import { Spinner } from "@/Components/ui/spinner";

const CampaignList = () => {
    const { campaigns, lookups, auth } = usePage().props;
    const [visibleCampaign, setVisibleCampaign] = useState(8);
    const [campaignList, setCampaignList] = useState(campaigns || []);
    const [chosenCategory, setChosenCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [isShowMoreLoading, setIsShowMoreloading] = useState(false);
    const [images, setImages] = useState({ thumbnail: null, logo: null });
    const [isLogin, setIsLogin] = useState(false);

    // 🟣 Check authentication status
    useEffect(() => {
        setIsLogin(!!auth?.user);
    }, [auth]);

    const handleShowMore = () => {
        // show spinner, then load more (small delay so spinner is visible)
        setIsShowMoreloading(true);
        setTimeout(() => {
            setVisibleCampaign((prev) => prev + 8);
            setIsShowMoreloading(false);
        }, 400);
    };

    useEffect(() => {
        if (
            campaigns.images &&
            (images.thumbnail === null || images.logo === null)
        ) {
            campaigns.images.map((dat) => {
                dat.url.toLowerCase().includes("thumbnail")
                    ? setImages((prev) => ({ ...prev, thumbnail: dat.url }))
                    : setImages((prev) => ({ ...prev, logo: dat.url }));
            });
        }
    }, [campaigns]);

    useEffect(() => {
        setVisibleCampaign(8);
    }, [chosenCategory, searchTerm]);

    useEffect(() => {
        if (!searchTerm) {
            setCampaignList(campaigns);
        } else {
            handleSearch();
        }
    }, [searchTerm]);

    const handleCategoryChange = (activeCategory) => {
        router.get(
            "/campaigns/getList",
            { category: activeCategory },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    setCampaignList(page.props.campaigns);
                    setChosenCategory(activeCategory);
                    setVisibleCampaign(8);
                },
            }
        );
    };

    const handleSearch = () => {
        let temp = campaigns?.filter((campaign) =>
            campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCampaignList(temp);
    };

    const colorCoder = (data) => {
        if (data === "Foods & Beverage") {
            return "bg-[#B8DF5D]";
        } else if (data === "Beauty & Cosmetic") {
            return "bg-[#FB84B2]";
        } else if (data === "Clothes & Fashion") {
            return "bg-[#CDADF1]";
        } else if (data === "Services") {
            return "bg-[#EDAC6B]";
        } else if (data === "Lifestyle") {
            return "bg-[#D3DE5D]";
        } else if (data === "Logistics") {
            return "bg-[#80BDF6]";
        }
    };
    const cardRepeater = (data, images) => {
        if (!data || data.length === 0) {
            return <p>No campaigns available.</p>;
        } else {
            return data.map((campaign, idx) => {
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
                        className="border rounded-lg p-4 shadow-md flex flex-col justify-between dark:bg-gray-800 dark:border-gray-700"
                    >
                        {campaign.images && (
                            <img
                                src={campaign?.images[0]?.url}
                                alt={campaign.title}
                                className="w-full h-[200px] object-fit mb-4 rounded"
                            />
                        )}

                        <h2 className="h-12 flex justify-center items-center text-lg font-semibold mb-2 text-center min-h-8 max-h-12 overflow-hidden leading-snug dark:text-white">
                            {campaign.title.length > 50
                                ? campaign.title.substring(0, 50) + "..."
                                : campaign.title}
                        </h2>

                        {/* <p className="text-sm text-gray-600 text-center mb-2 dark:text-gray-400">
                            {new Date(
                                campaign.start_campaign
                            ).toLocaleDateString() +
                                " - " +
                                new Date(
                                    campaign.end_campaign
                                ).toLocaleDateString()}
                        </p> */}
                        <div className="flex justify-center gap-2 mb-4">
                            <span
                                className={`text-sm font-semibold dark:text-gray-100 rounded-sm text-center px-4 py-1 mb-2 text-gray-600`}
                            >
                                {campaign.category ?? "Uncategorized"}
                            </span>
                        </div>

                        <p className="h-20 text-sm text-gray-700 mb-3 text-justify dark:text-gray-300">
                            {campaign.description
                                ?.replace(/(<([^>]+)>)/gi, "")
                                .slice(0, 150) || "No description available."}
                            {"..."}
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 dark:bg-gray-700">
                            <div
                                className="bg-purple-700 h-3 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2 text-center dark:text-gray-400">
                            Raised{" "}
                            {parseInt(campaign.collected_amount).toLocaleString(
                                "id-ID",
                                {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 2,
                                }
                            )}{" "}
                            /{" "}
                            {parseInt(campaign.goal_amount).toLocaleString(
                                "id-ID",
                                {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 2,
                                }
                            )}{" "}
                            {/* ({progress}%) */}
                        </p>

                        <div className="flex justify-center gap-2 mb-4">
                            <span
                                className={`inline-block text-sm font-semibold px-2 py-1 rounded-full ${
                                    campaign.duration
                                }
                            ${
                                campaign.status === "active"
                                    ? "bg-gray-100 text-gray-700 dark:bg-gray-500 dark:text-white"
                                    : "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-white"
                            }`}
                            >
                                {campaign.status === "completed"
                                    ? campaign.status.toUpperCase()
                                    : `${Math.max(
                                          Math.floor(
                                              (new Date(campaign.end_campaign) -
                                                  Date.now()) /
                                                  (1000 * 60 * 60 * 24)
                                          ),
                                          0
                                      )} Days left`}
                            </span>
                        </div>

                        <div className="flex justify-center mt-auto">
                            <Link
                                href={`/campaigns/details/${campaign.id}?from=campaignList`}
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
    const Layout = isLogin ? Layout_User : Layout_Guest;

    return (
        <Layout>
            {/* upper part (banner and category picker) */}
            <div className="w-full flex flex-col">
                <div
                    className="relative h-72 w-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('http://127.0.0.1:8000/images/handshake.jpg')",
                    }}
                >
                    <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full">
                        <h1 className="text-4xl font-bold text-white text-center dark:text-white">
                            <p>Together we Rise ToGather we Grow</p>
                        </h1>
                    </div>
                </div>
                <div
                    className="flex flex-row space-x-4 h-[75px] bg-gray-300 bg-cover bg-center w-full items-center justify-center"
                    style={{ background: "#7A338C" }}
                >
                    {lookups?.length > 0 && (
                        <Button
                            key={998}
                            onClick={() => handleCategoryChange("All")}
                            className={`px-4 py-2 rounded-md text-white transition-all duration-200 ${
                                chosenCategory === "All"
                                    ? "bg-white text-purple-700 font-semibold shadow-md hover:bg-white"
                                    : " text-white hover:bg-purple-700 bg-purple-800"
                            }`}
                        >
                            Home
                        </Button>
                    )}
                    {lookups
                        ?.filter(
                            (dat) => dat.lookup_type === "CampaignCategory"
                        )
                        .map((item, idx) => (
                            <Button
                                key={idx}
                                onClick={() =>
                                    handleCategoryChange(item.lookup_value)
                                }
                                className={`px-4 py-2 rounded-md text-white transition-all duration-200 ${
                                    chosenCategory === item.lookup_value
                                        ? "bg-white text-purple-700 font-semibold shadow-md hover:bg-white"
                                        : `text-white hover:bg-purple-700 bg-purple-800`
                                }`}
                            >
                                {item.lookup_value}
                            </Button>
                        ))}
                    <Button
                        key={999}
                        onClick={() => handleCategoryChange("Completed")}
                        className={`px-4 py-2 rounded-md text-white transition-all duration-200 ${
                            chosenCategory === "Completed"
                                ? "bg-white text-purple-700 font-semibold shadow-md hover:bg-white"
                                : " text-white hover:bg-purple-700 bg-purple-800"
                        }`}
                    >
                        Completed
                    </Button>
                </div>
            </div>

            {/* search bar  */}
            <div className="w-11/12 flex m-10 items-end justify-end">
                <ButtonGroup className="w-84">
                    <Input
                        placeholder="Search Campaign"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                    <Button variant="outline" aria-label="Search">
                        <SearchIcon />
                    </Button>
                </ButtonGroup>
            </div>

            {/* lower part (campaigns) */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4 dark:text-white">
                        <Separator className="flex-1" />
                        {chosenCategory === "All"
                            ? "All Campaigns"
                            : chosenCategory}
                        <Separator className="flex-1" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {campaigns?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {cardRepeater(
                                campaignList.slice(0, visibleCampaign),
                                images
                            )}
                        </div>
                    ) : (
                        <p className="flex flex-col justify-center items-center w-full mx-auto text-center text-gray-500 mt-20 dark:text-gray-400">
                            No campaigns found.
                        </p>
                    )}
                    {visibleCampaign < campaigns?.length ? (
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
                    ) : (
                        <></>
                    )}
                </CardContent>
            </div>
        </Layout>
    );
};

export default CampaignList;
