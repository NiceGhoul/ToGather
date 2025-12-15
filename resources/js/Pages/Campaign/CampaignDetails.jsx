// import { Accordion, AccordionContent } from "@/Components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Toggle } from "@/Components/ui/toggle";
import Layout_User from "@/Layouts/Layout_User";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Layout_Guest from "@/Layouts/Layout_Guest";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Link, router, usePage } from "@inertiajs/react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Heart, Map } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AboutDetails } from "./AboutDetails";
import { UpdatesDetails } from "./UpdatesDetails";
import { FaqDetails } from "./FAQDetails";
import { DonationsDetails } from "./DonationsDetails";
import axios from "axios";

const scrollDonations = (data, idx) => {
    return (
        <Card
            key={idx}
            className="w-[300px] h-[100px] flex flex-row items-center justify-betweendark:bg-gray-800 dark:border-gray-800"
        >
            <div className="overflow-hidden flex items-center justify-center shrink-0 ml-4">
                <Avatar className="w-14 h-14 border-2 dark:bg-white">
                    <AvatarImage src={data.user ?? data?.user?.images[0].url} />
                    <AvatarFallback>
                        {data.anonymous === 0 ? data.user.nickname[0] : "A"}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex flex-col items-center text-right gap-1 flex-1">
                <CardHeader className="flex text-center justify-center w-full">
                    <CardTitle className="text-base font-bold dark:text-white">
                        {data.anonymous === 0
                            ? data.user.nickname
                            : "anonymous"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-lg font-normal dark:text-gray-300">
                    {parseInt(data.amount).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 2,
                    })}
                </CardContent>
            </div>
        </Card>
    );
};

const contentDivider = (data, campaign, contents, donation) => {
    if (data === "About") {
        return (
            <div>
                <AboutDetails
                    campaign={campaign}
                    contents={contents.filter(
                        (dat) =>
                            dat.type === "paragraph" || dat.type === "media"
                    )}
                />
            </div>
        );
    } else if (data === "FAQ") {
        return (
            <div>
                <FaqDetails
                    contents={contents.filter((dat) => dat.type === "faqs")}
                />
            </div>
        );
    } else if (data === "Updates") {
        return (
            <div>
                <UpdatesDetails
                    contents={contents.filter((dat) => dat.type === "updates")}
                />
            </div>
        );
    } else if (data === "Donations") {
        return (
            <div>
                <DonationsDetails donations={donation} />
            </div>
        );
    }
};

const tabsContentRepeater = (data, campaign, index, contents, donations) => {
    return (
        <TabsContent
            value={index + 1}
            className="w-full h-full text-lg text-center py-4"
        >
            {contentDivider(data, campaign, contents, donations)}
        </TabsContent>
    );
};

export default function Create() {
    const data = ["About", "FAQ", "Updates", "Donations"];
    const { campaign, donations, liked, user, contents, flash } =
        usePage().props;
    const [images, setImages] = useState({ thumbnail: null, logo: null });
    const [like, setLike] = useState(liked);
    const scrollRef = useRef(null);

    const percentage = Math.round(
        (campaign.collected_amount / campaign.goal_amount) * 100
    );
    const from = new URL(window.location.href).searchParams.get("from");

    const backRoutes = {
        verification: "/admin/campaigns/verification",
        myCampaigns: "/campaigns/myCampaigns",
        list: "/admin/campaigns/list",
        campaignList: "/campaigns/list",
        likedCampaign: "/campaigns/likedCampaign",
    };
    const backUrl = backRoutes[from];
    useEffect(() => {
        if (
            campaign.images &&
            (images.thumbnail === null || images.logo === null)
        ) {
            campaign.images.map((dat) => {
                dat.url.toLowerCase().includes("thumbnail")
                    ? setImages((prev) => ({ ...prev, thumbnail: dat.url }))
                    : setImages((prev) => ({ ...prev, logo: dat.url }));
            });
        }
    }, [campaign]);

    const handleLikes = async (id) => {
        const prev = like;
        setLike(!prev);
        try {
            await axios.post("/campaigns/toggleLike", {
                campaign_id: id,
            });
        } catch (err) {
            router.visit("/login");
            setLike(prev);
        }
    };

    const mainData = () => {
        return (
            <div className="max-w-7xl mx-auto px-4 items-center">
                <Button
                    className="mt-8 bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white cursor-pointer"
                    onClick={() => router.get(backUrl)}
                >
                    Back
                </Button>
                <h1 className="text-2xl text-center font-semibold mb-5 mt-10">
                    {/* Recent Donations */}
                </h1>
                <Separator className="flex-1 bg-gray-200 dark:bg-gray-600 h-[1px]" />
                <div className="flex flex-col gap-2 my-4">
                    <div className="w-full overflow-hidden p-2">
                        <div className={donations.length > 4 ? "auto-scroll-horizontal" : "flex flex-row gap-4 justify-center items-center"}>
                            {donations.length > 0 ? (
                                donations
                                    .slice(0, 10)
                                    .map((donation, idx) =>
                                        scrollDonations(donation, idx)
                                    )
                            ) : (
                                <p key={0} className="text-lg text-center">
                                    No Donations, yet...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <Separator className="flex-1 bg-gray-200 dark:bg-gray-600 h-[1px]" />

                {/* pictures and titles */}
                <div className="flex flex-col lg:flex-row px-4 py-8 gap-8 items-start w-full">
                    <div className="flex flex-col lg:w-1/2 w-full max-h-full">
                        <div className="flex flex-row min-w-full min-h-[400px] overflow-hidden border-1 rounded-md border-gray-800 dark:border-gray-400 shrink-0 items-center">
                            {images.thumbnail ? (
                                <img
                                    src={images.thumbnail}
                                    alt="Campaign"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <span className="text-gray-500 text-md w-full text-center italic">
                                    No image available
                                </span>
                            )}
                        </div>
                        <div className="flex flex-row gap-4 my-5 justify-center items-center">
                            <Map />
                            <p className="text-center">
                                {campaign.locations
                                    ? campaign.locations.region +
                                      ", " +
                                      campaign.locations.country
                                    : campaign.address}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:w-1/2 w-full h-full overflow-hidden justify-center">
                        <div className="flex items-center gap-5">
                            <Avatar className="w-20 h-20 border-2 border-gray-700">
                                <AvatarImage
                                    src={images.logo}
                                    alt={campaign.title}
                                />
                                <AvatarFallback>
                                    {campaign != undefined
                                        ? campaign.title[0]
                                        : ""}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1 justify-center">
                                <Label className="text-3xl text-start font-semibold dark:text-white">
                                    {campaign.title}
                                </Label>
                                <Label className="text-md text-start font-medium dark:text-gray-300">
                                    {"Created by " + campaign.user.nickname}
                                </Label>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <h1 className="text-2xl text-start font-semibold my-4 text-[#7C4789] dark:text-gray-300">
                                {donations.length.toString() +
                                    " " +
                                    (donations.length > 1
                                        ? " Donators"
                                        : " Donator")}
                            </h1>
                            {campaign.status != "completed" ?
                                <h1 className="text-2xl text-end font-semibold my-4 text-[#7C4789] dark:text-gray-300">
                                {Math.ceil(
                                    (new Date(campaign.end_campaign) -
                                    new Date()) /
                                    (1000 * 60 * 60 * 24)
                                ) + " Days left"}
                            </h1> :
                            <h1 className="text-2xl text-end font-semibold my-4 text-[#7C4789] dark:text-gray-300">
                                {"Campaign " + campaign.status}
                            </h1>
                            }
                        </div>
                        <div className="relative flex flex-col justify-end gap-4 mt-2">
                            <Progress
                                className="h-6 rounded-sm bg-[#d3bfe0] [&>div]:bg-[#7C4789] dark:bg-gray-700"
                                value={
                                    (campaign.collected_amount /
                                        campaign.goal_amount) *
                                    100
                                }
                            />
                            <span
                                className="absolute inset-0 flex items-start justify-center text-md font-medium dark:text-white"
                                style={{ color: "white" }}
                            >
                                {percentage}%
                            </span>
                        </div>
                        <p className="text-lg font-normal flex justify-end mt-2 dark:text-gray-300">
                            {parseInt(campaign.collected_amount).toLocaleString(
                                "id-ID",
                                {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 2,
                                }
                            ) +
                                " / " +
                                parseInt(campaign.goal_amount).toLocaleString(
                                    "id-ID",
                                    {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 2,
                                    }
                                )}
                        </p>
                        <div className="flex flex-row items-center justify-between mt-5">
                            <Toggle
                                pressed={like}
                                onPressedChange={() => handleLikes(campaign.id)}
                                size="lg"
                                variant="outline"
                                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500 hover:bg-red-100 dark:hover:bg-red-600"
                            >
                                <Heart />
                                {!like
                                    ? "Like This Campaign"
                                    : "Campaign Liked"}
                            </Toggle>

                            <Link href={`/donate?campaign_id=${campaign.id}`}>
                                <Button className="min-h-10 min-w-56 font-semibold text-lg bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white">
                                    Donate
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div>
                    <Tabs
                        defaultValue={flash?.activeTab ?? 1}
                        className="w-full">
                        <div className="dark:border-t-1 sticky top-[72px] z-40 bg-none pt-3 dark:pt-2 h-auto">
                            <TabsList className="overflow-auto text-gray-500 flex gap-30 bg-[#fcfcfc] dark:bg-gray-800 shadow-md w-full mx-auto rounded-md dark:text-white h-[48px] ">
                                {data.map((dat, idx) => {
                                    return (
                                        <TabsTrigger
                                            value={idx + 1}
                                            className="w-[10rem] flex px-8 uppercase text-md font-bold rounded-none tracking-wide border-2 border-transparent data-[state=active]:text-white data-[state=active]:bg-[#7C4789] transition-colors duration-200 rounded-sm"
                                        >
                                            {dat}
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                        <div className="mt-10 flex justify-center items-center gap-2 bg-transparent origin-top scale-[0.95]">
                            {data.map((dat, idx) => {
                                return tabsContentRepeater(
                                    dat,
                                    campaign,
                                    idx,
                                    contents,
                                    donations
                                );
                            })}
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    };

    {
        if (!user || !user.role) {
            // Guest (not logged in)
            return <Layout_Guest>{mainData()}</Layout_Guest>;
        }

        if (user.role === "user") {
            return <Layout_User>{mainData()}</Layout_User>;
        }

        // ELSE: admin
        return (
            <Layout_Admin
                title={
                    campaign
                        ? `Campaign Details - ${campaign.title}`
                        : "Campaign Details"
                }
            >
                {mainData()}
            </Layout_Admin>
        );
    }
}
