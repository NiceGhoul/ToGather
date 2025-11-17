import Popup from "@/Components/Popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/Components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Toggle } from "@/Components/ui/toggle";
import Layout_User from "@/Layouts/Layout_User";
import { router, usePage } from "@inertiajs/react";
import { IconFolderCode } from "@tabler/icons-react";
import { Heart, Map } from "lucide-react";
import { useEffect, useState } from "react";
import { FaqBuilder } from "./FAQBuilder";
import { AboutBuilder } from "./AboutBuilder";
import { UpdateBuilder } from "./UpdatesBuilder";

export const UpperPreview = ({campaign, user, images}) => {
    const [like, setLike] = useState(false)
    return (
        <div className="flex container px-4 py-8 flex-row gap-16 justify-center items-center mx-auto mb-20">
            <div className="flex flex-col w-[600px] h-[400px]">
                <div className="flex flex-row min-w-3/6 h-[400px] overflow-hidden border-1 rounded-md border-gray-800 shrink-0">
                    <img
                        src={images.thumbnail}
                        alt="Campaign"
                        className="w-full h-full object-cover mb-4 rounded"
                    />
                </div>
                <div className="flex flex-row gap-2 my-5 justify-center items-center">
                    <Map />
                    <p className="w-full text-center">{campaign.address}</p>
                </div>
            </div>

            <div className="flex min-w-3/6 h-full overflow-hidden justify-center flex-col">
                <div className="flex overflow-hidden item-center justify-start gap-5 flex-row">
                    <Avatar className="w-20 h-20 border-2 border-gray-700">
                        <AvatarImage src={images.logo} alt={campaign.title} />
                        <AvatarFallback>
                            {campaign != undefined ? campaign.title[0] : ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 justify-center">
                        <Label className="text-3xl text-start font-semibold dark:text-white">
                            {campaign.title}
                        </Label>
                        <Label className="text-md text-start font-medium dark:text-white">
                            {"Created by " + user.nickname}
                        </Label>
                    </div>
                </div>
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl text-start font-semibold my-4 text-[#7C4789]">
                        0 Donator
                    </h1>

                    <h1 className="text-2xl text-end font-semibold my-4 text-[#7C4789]">
                        {campaign.duration + " Days left"}
                    </h1>
                </div>
                <div className="relative flex flex-col justify-end gap-4 mt-2">
                    <Progress
                        className="h-6 rounded-sm bg-[#d3bfe0] [&>div]:bg-[#7C4789]"
                        value={0}
                    />
                    <span
                        className="absolute inset-0 flex items-start justify-center text-md font-medium "
                        style={{ color: "black" }}
                    >
                        0%
                    </span>
                </div>
                <p className="text-lg font-normal flex justify-end mt-2">
                    {"Rp. " +
                        campaign.collected_amount +
                        ",00 / Rp. " +
                        parseInt(campaign.goal_amount).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}
                </p>
                <div className="flex flex-row items-center justify-between mt-5">
                    <Toggle
                        pressed={like}
                        onPressedChange={() => setLike(!like)}
                        size="lg"
                        variant="outline"
                        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                    >
                        <Heart />
                        {!like ? "like this campaign" : "campaign liked"}
                    </Toggle>

                    <Button className="min-h-10 min-w-48 font-semibold text-lg">
                        Donate
                    </Button>
                </div>
            </div>
        </div>
    );
}



const CreateDetailsPreview = () => {

    const data = ["About", "FAQ", "Updates", "Donations"];
    const { campaign, user, contents, flash } = usePage().props
    const [images, setImages] = useState({thumbnail: null, logo: null})
    const [openPopUp, setOpenPopUp] = useState(false)
    const [popUpData, setPopupData] = useState({ title:"", description: "", confText: "", confColor:""})

    const handleBack = () => {
        router.get(`/campaigns/create/createPreview/${campaign.id}`)
    };

    const handleFinalize = () => {
        router.post(`/campaigns/finalize/${campaign.id}`)
    }

    const handleInsertUpdates = (campaignContent) => {
        router.post(`/campaigns/insertUpdates`, campaignContent)
    }

    const contentDivider = (data) => {
        if (data === "About") {
            return (
                <div className="flex flex-col gap-8 px-8 py-4 text-left min-h-[500px]">
                    <AboutBuilder campaign={campaign} contents={contents.filter((dat) => dat.type === 'paragraph' || dat.type === 'media')}/>
                </div>
            );
        } else if (data === "FAQ") {
            return (
                // has a dropdown box
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <FaqBuilder campaign={campaign} contents={contents.filter((dat) => dat.type === 'faqs')}/>

                </div>
            );
        } else if (data === "Updates") {
            return (
                // navigation bar on the side, with the updates on the inside  (make new table in xampp)
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <UpdateBuilder campaign={campaign} contents={contents.filter((dat) => dat.type === 'updates')} insertHandler={handleInsertUpdates} />
                </div>
            );
        } else if (data === "Donations") {
            return (
                // get all of the donation this project has received
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconFolderCode  />
                            </EmptyMedia>
                            <EmptyTitle>This is the donation page</EmptyTitle>
                            <EmptyDescription>Every donation this campaign obtained will be displayed here. You can see the total donation as well as the message left by donators!</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            {/* <Button>Add data</Button> */}
                        </EmptyContent>
                    </Empty>
                </div>
            );
        }
    };

    const tabsRepeater = (data, index) => {
        // console.log(data, index)
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

    useEffect(() => {
        if (campaign.images && (images.thumbnail === null || images.logo === null)) {
            campaign.images.map((dat) => {
                dat.url.includes("thumbnail")
                    ? setImages((prev) => ({ ...prev, thumbnail: dat.url }))
                    : setImages((prev) => ({ ...prev, logo: dat.url }));
            });
        }
    }, [campaign]);

    return (
        <Layout_User>
            <Card className="rounded-none border-0 border-b">
                <CardHeader className="flex flex-row">
                    <div className="justify-center items-center">
                        <Button
                            className="bg-transparent text-purple-700 hover:bg-purple-100 text-xl "
                            onClick={() => handleBack()}
                        >
                            ← Back
                        </Button>
                    </div>
                    <div className="w-full justify-center items-center">
                        <CardTitle className="text-center text-3xl">
                            Edit Campaign Details
                        </CardTitle>
                        <CardDescription className="w-full text-center text-md justify-center flex items-center">
                            Edit everything about your products here! preview what your campaign details would looked like after prior to publishing!
                        </CardDescription>
                    </div>
                    <div className="justify-center items-center">
                        <Button
                            className="bg-transparent text-green-700 hover:bg-green-100 text-xl "
                            onClick={() => handleFinalize()}
                        >
                            Finalize →
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="border-none">
                    <UpperPreview campaign={campaign } user={user} images={images} />
                </CardContent>
            </Card>

            <div>
                <Tabs defaultValue={flash?.activeTab ?? 1} className="w-full mt-20">
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
            <Popup
                    open={openPopUp}
                    onClose={() => setOpenPopUp(false)}
                    triggerText={null}
                    title={popUpData.title}
                    description={popUpData.description}
                    confirmText={popUpData.confText}
                    cancelText="Cancel"
                    showCancel={popUpData.title === "Upload Error" ? false : true}
                    confirmColor={popUpData.confColor}
                    // onConfirm={popUpData.title === "Upload Error" ? () => setOpenPopUp(false) : setOpenPopUp(true)}
                />
        </Layout_User>
    );
};

export default CreateDetailsPreview;
