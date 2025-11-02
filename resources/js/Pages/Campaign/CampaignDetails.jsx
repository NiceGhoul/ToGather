// import { Accordion, AccordionContent } from "@/Components/ui/accordion";
import { Button } from "@/Components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/Components/ui/carousel";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Toggle } from "@/Components/ui/toggle";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const scrollDonations = (data, idx) => {
    // maybe set the donation by the date
    return (
        <Card
            key={idx}
            className="w-[300px] h-[100px] mx-auto flex flex-row items-center justify-between px-4"
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
                    <CardTitle className="text-xl font-bold">
                        {data.anonymous === 1
                            ? data.user.nickname
                            : "anonymous"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-lg font-normal">
                    {"$" + data.amount + ",00"}
                </CardContent>
            </div>
        </Card>
    );
};

const contentDivider = (data, campaign) => {
    if (data === "About") {
        return (
            // this will be editable i think, if creator is the one opening the page, the edit section will be activated
            <div className="flex flex-col gap-8 px-8 py-4 text-left">
                <h1 className="text-3xl font-bold text-[#7C4789]">Our Story</h1>
                <p>{campaign.description}</p>
                <h2 className="text-3xl font-bold text-[#7C4789] mb-4">
                    Media
                </h2>
                {/* should be scrollable */}
                <div className="">
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <img
                                    src="http://127.0.0.1:8000/images/king.jpg"
                                    alt="tes1"
                                    className="w-full h-[300px] object-cover"
                                />
                            </CarouselItem>

                            <CarouselItem>
                                <img
                                    src="http://127.0.0.1:8000/images/sharks.jpg"
                                    alt="tes2"
                                    className="w-full h-[300px] object-cover"
                                />
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselNext/>
                        <CarouselPrevious />
                    </Carousel>
                </div>
            </div>
        );
    } else if (data === "FAQ") {
        return (
            // has a dropdown box
            <div>
                <p>{data}</p>
                {/* <Accordion>
                    <AccordionContent>Test</AccordionContent>
                </Accordion> */}
            </div>
        );
    } else if (data === "Updates") {
        return (
            // navigation bar on the side, with the updates on the inside  (make new table in xampp)
            <div>
                <p>{data}</p>
            </div>
        );
    } else if (data === "Donations") {
        return (
            // get all of the donation this project has received
            <div>
                <p>{data}</p>
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

const tabsContentRepeater = (data, campaign, index) => {
    return (
        <TabsContent
            value={index + 1}
            className="w-[90%] h-[100%] text-lg text-center py-4"
        >
            {contentDivider(data, campaign)}
        </TabsContent>
    );
};

export default function Create() {
    const data = ["About", "FAQ", "Updates", "Donations"];

    const { campaign, donations, liked } = usePage().props;
    const [like, setLike] = useState(liked);
    const percentage = Math.round(
        (campaign.collected_amount / campaign.goal_amount) * 100
    );

    const handleLikes = (id) => {
        setLike(!like);
        Inertia.post(
            "/campaigns/toggleLike",
            { campaign_id: id },
            { onError: () => setLike(like) }
        );
    };

    return (
        <Layout_User>
            {/* scrolling donations */}
            {/* if creator can customize this, will be very good either this or largest donator*/}
            <h1 className="text-2xl text-center font-semibold mb-5 mt-10">
                Recent Donations
            </h1>
            <Separator className="flex-1 bg-gray-400 h-[1px]" />
            <div className="flex-col flex gap-2 m-4">
                <div className="flex-row flex gap-2 flex justify-center items-center ">
                    {donations.length > 0 ? (
                        donations.map((donation) => scrollDonations(donation))
                    ) : (
                        <p key={0} className="text-lg text-center">
                            No Donations, yet...
                        </p>
                    )}
                </div>
            </div>
            <Separator className="flex-1 bg-gray-400 h-[1px]" />
            {/* pictures and titles */}
            <div className="flex container px-4 py-8 flex-row gap-8  justify-center items-center mx-auto">
                <div className="flex flex-row min-w-3/6 h-[400px] overflow-hidden border-1 border-gray-800 shrink-0">
                    <img
                        src="http://127.0.0.1:8000/images/nature.jpg"
                        alt="Campaign"
                        className="w-full h-full object-cover mb-4 rounded"
                    />
                </div>

                <div className="flex min-w-3/6 h-full overflow-hidden justify-center flex-col">
                    <h1 className="text-4xl text-start font-semibold flex mb=5">
                        {campaign.title}
                    </h1>
                    <h1 className="text-3xl text-end font-semibold flex my-10 text-[#7C4789]">{donations.length.toString() + " " + (donations.length > 1 ? " Donators" : " Donator")} </h1>
                    <div className="relative flex flex-col justify-end gap-4 mt-2">
                        <Progress
                            className="h-6 rounded-sm bg-[#d3bfe0] [&>div]:bg-[#7C4789]"
                            value={
                                (campaign.collected_amount /
                                    campaign.goal_amount) *
                                100
                            }
                        />
                        <span
                            className="absolute inset-0 flex items-start justify-center text-md font-medium "
                            style={{
                                color: percentage > 50 ? "white" : "black",
                            }}
                        >
                            {percentage}%
                        </span>
                    </div>
                    <p className="text-lg font-normal flex justify-end mt-5">
                        {"$" +
                            campaign.collected_amount +
                            ",00" +
                            " / " +
                            "$" +
                            campaign.goal_amount +
                            ",00"}
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
                            {!like ? "like this campaign" : "campaign liked"}
                        </Toggle>

                        <Button className="min-h-10 min-w-56 font-semibold text-lg">
                            Donate
                        </Button>
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
                    <div className="flex justify-center items-center gap-2 bg-transparent border-b border-gray-300 rounded-none">
                        {data.map((dat, idx) => {
                            return tabsContentRepeater(dat, campaign, idx);
                        })}
                    </div>
                </Tabs>
            </div>
        </Layout_User>
    );
}
