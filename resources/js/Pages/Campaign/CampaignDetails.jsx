// import { Accordion, AccordionContent } from "@/Components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Toggle } from "@/Components/ui/toggle";
import Layout_User from "@/Layouts/Layout_User";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Link, router, usePage } from "@inertiajs/react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Heart, Map } from "lucide-react";
import { useEffect, useState } from "react";
import { AboutDetails } from "./AboutDetails";
import { UpdatesDetails } from "./UpdatesDetails";
import { FaqDetails } from "./FAQDetails";
import { DonationsDetails } from "./DonationsDetails";
import axios from "axios";

const scrollDonations = (data, idx) => {
    console.log(data)
    return (
        <Card
            key={idx}
            className="w-[300px] h-[100px] mx-auto flex flex-row items-center justify-between px-4 dark:bg-gray-800 dark:border-gray-700"
        >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-800 shrink-0">
                <img
                    src="http://127.0.0.1:8000/images/boat.jpg"
                    alt="Campaign"
                    className="w-full h-full object-cover mb-4 rounded"
                />
            </div>

            <div className="flex flex-col items-center text-right gap-1 flex-1">
                <CardHeader className="flex text-center justify-center">
                    <CardTitle className="text-xl font-bold dark:text-white">
                        {data.user ? data.user.nickname : "anonymous"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-lg font-normal dark:text-gray-300">
                    {"Rp. " + data.amount + ",00"}
                </CardContent>
            </div>
        </Card>
    );
};

const contentDivider = (data, campaign, contents, donation) => {
    if (data === "About") {
        return (
            // this will be editable i think, if creator is the one opening the page, the edit section will be activated
            <div>
                <AboutDetails campaign={campaign} contents={contents.filter((dat) => dat.type === "paragraph" || dat.type === "media")} />
            </div>
        );
    } else if (data === "FAQ") {
        return (
            // has a dropdown box
            <div>
                <FaqDetails contents={contents.filter((dat) => dat.type === "faqs")} />
            </div>
        );
    } else if (data === "Updates") {
        return (
            // navigation bar on the side, with the updates on the inside  (make new table in xampp)
            <div>
                <UpdatesDetails contents={contents.filter((dat) => dat.type === "updates")} />
            </div>
        );
    } else if (data === "Donations") {
        return (
            // get all of the donation this project has received
            <div>
                <DonationsDetails donations={donation} />
            </div>
        );
    }
};

const tabsRepeater = (data, index) => {
    return (
        <>
            <TabsTrigger
                value={index + 1}
                className="flex min-w-64 uppercase text-md font-bold rounded-none tracking-wide border-2 border-transparent data-[state=active]:text-white data-[state=active]:bg-[#7C4789] transition-colors duration-200"
            >
                {data}
            </TabsTrigger>
        </>
    );
};

const tabsContentRepeater = (data, campaign, index, contents, donations) => {
    return (
        <TabsContent
            value={index + 1}
            className="w-[90%] h-[100%] text-lg text-center py-4"
        >
            {contentDivider(data, campaign, contents, donations)}
        </TabsContent>
    );
};

export default function Create() {
    const data = ["About", "FAQ", "Updates", "Donations"];

    const { campaign, donations, liked, user, contents } = usePage().props;
    const [images, setImages] = useState({thumbnail: null, logo: null})
    const [like, setLike] = useState(liked);

    const percentage = Math.round(
        (campaign.collected_amount / campaign.goal_amount) * 100
    );

     useEffect(() => {
        if (campaign.images && (images.thumbnail === null || images.logo === null)) {
            campaign.images.map((dat) => {
                dat.url.includes("thumbnail")
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
           setLike(prev);
       }
   };

    const mainData = () => {
        return (
            <div className="overflow-auto">
                {/* scrolling donations */}
                {/* if creator can customize this, will be very good either this or largest donator*/}
                <h1 className="text-2xl text-center font-semibold mb-5 mt-10">
                    {/* Recent Donations */}
                </h1>
                <Separator className="flex-1 bg-gray-200 h-[1px]" />
                <div className="flex-col flex gap-2 m-4">
                    <div className="flex-row flex gap-2 flex justify-center items-center ">
                        {donations.length > 0 ? (
                            donations.map((donation) =>
                                scrollDonations(donation)
                            )
                        ) : (
                            <p key={0} className="text-lg text-center">
                                No Donations, yet...
                            </p>
                        )}
                    </div>
                </div>
                <Separator className="flex-1 bg-gray-100 h-[1px]" />
                {/* pictures and titles */}
                <div className="flex container px-4 py-8 flex-row gap-16 justify-center items-center mx-auto">
                    <div className="flex flex-col w-[600px] h-[400px]">
                        <div
                            className={`flex flex-row min-w-3/6 overflow-hidden border-1 rounded-md border-gray-800 shrink-0 ${images.thumbnail ? "" : "min-h-[400px]"}`}
                        >
                            {images.thumbnail != null ? (
                                <img
                                    src={images.thumbnail}
                                    at="thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-500 text-md w-full h-full items-center justify-center flex text-center italic">
                                    No image available
                                </span>
                            )}
                        </div>
                        <div className="flex flex-row gap-0 my-5 justify-center items-center">
                            <Map />
                            <p className="w-full text-center dark:text-gray-300">
                                {campaign.address}
                            </p>
                        </div>
                    </div>

                    <div className="flex min-w-3/6 h-full overflow-hidden justify-center flex-col">
                        <div className="flex overflow-hidden item-center justify-start gap-5 flex-row">
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

                            <h1 className="text-2xl text-end font-semibold my-4 text-[#7C4789] dark:text-gray-300">
                                {campaign.duration + " Days left"}
                            </h1>
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
                                style={{ color: "black" }}
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
                                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                            >
                                <Heart />
                                {!like
                                    ? "like this campaign"
                                    : "campaign liked"}
                            </Toggle>

                            <Link href={`/donate?campaign_id=${campaign.id}`}>
                                <Button className="min-h-10 min-w-56 font-semibold text-lg">
                                    Donate
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div>
                    <Tabs defaultValue={1} className="w-full mt-20">
                        {/* Tabs Header */}
                        <TabsList className="flex gap-40 bg-transparent border-b-2 border-gray-700 w-fit mx-auto rounded-none">
                            {data.map((dat, idx) => {
                                return tabsRepeater(dat, idx);
                            })}
                        </TabsList>
                        <div className="flex justify-center items-center gap-2 bg-transparent">
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
    return user.role === "user" ? (
        <Layout_User>{mainData()}</Layout_User>
    ) : (
        <Layout_Admin title={<Button className="" onClick={() => {router.get('/admin/campaigns/list', {}, {replace: true})}}> Back </Button>}>{mainData()}</Layout_Admin>
    );
}
}
