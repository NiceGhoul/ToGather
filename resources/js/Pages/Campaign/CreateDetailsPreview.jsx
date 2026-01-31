import Popup from "@/Components/Popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/Components/ui/empty";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import Layout_User from "@/Layouts/Layout_User";
import { router, usePage } from "@inertiajs/react";
import { IconFolderCode } from "@tabler/icons-react";
import { Map } from "lucide-react";
import { useEffect, useState } from "react";
import { FaqBuilder } from "./FAQBuilder";
import { AboutBuilder } from "./AboutBuilder";
import { UpdateBuilder } from "./UpdatesBuilder";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/Components/ui/breadcrumb";

export const UpperPreview = ({ campaign, user, images, donations }) => {
    console.log(donations)
     const percentage = Math.round(
         (campaign.collected_amount / campaign.goal_amount) * 100
     );

     const handleFinalize = () => {
         router.post(`/campaigns/finalize/${campaign.id}`);
     };

    return (
        <div className="flex container px-4 py-8 flex-row gap-16 justify-center items-center mx-auto mb-20">
            <div className="flex flex-col min-w-[50%] max-h-full">
                <div className="flex flex-row min-w-full max-h-[400px] overflow-hidden border-1 rounded-md border-gray-800 dark:border-gray-400 shrink-0 items-center">
                    {images.thumbnail ? (
                        <img
                            src={images.thumbnail}
                            alt="Campaign"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <span className="flex items-center justify-center text-gray-500 text-md w-full h-[400px] text-center italic">
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

            <div className="flex min-w-3/6 h-full overflow-hidden justify-center flex-col">
                <div className="flex overflow-hidden item-center justify-start gap-5 flex-row">
                    <Avatar className="w-20 h-20 border-2 border-gray-700 dark:bg-white">
                        <AvatarImage src={images.logo} alt={campaign.title} />
                        <AvatarFallback>
                            {campaign != undefined ? campaign.title[0] : ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 justify-center">
                        <Label className="text-2xl text-start font-semibold dark:text-white">
                            {campaign.title}
                        </Label>
                        <Label className="text-md text-start font-medium dark:text-white">
                            {"Created by " + user.nickname}
                        </Label>
                    </div>
                </div>
                {
                    <div className="flex flex-row justify-between">
                        <h1 className="text-2xl text-start font-semibold my-4 text-[#7C4789] dark:text-gray-300">
                            {donations.length.toString() +
                                " " +
                                (donations.length > 1
                                    ? " Donations"
                                    : " Donation")}
                        </h1>

                        <h1 className="text-2xl text-end font-semibold my-4 text-[#7C4789] dark:text-purple-700">
                            {campaign.end_campaign
                                ? Math.ceil(
                                      (new Date(campaign.end_campaign) -
                                          new Date()) /
                                          (1000 * 60 * 60 * 24),
                                  ) + " Days left"
                                : "- Days left"}
                        </h1>
                    </div>
                }
                <div className="relative flex flex-col justify-end gap-4 mt-2">
                    <Progress
                        className="h-6 rounded-sm [&>div]:bg-purple-800 dark:[&>div]:bg-purple-800"
                        value={
                            (campaign.collected_amount / campaign.goal_amount) *
                            100
                        }
                    />
                    <span className="absolute inset-0 flex items-start justify-center text-md font-medium text-gray-200 dark:text-white">
                        {percentage}%
                    </span>
                </div>
                <p className="text-lg font-normal flex justify-end mt-2">
                    {parseInt(campaign.collected_amount).toLocaleString(
                        "id-ID",
                        {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        },
                    ) +
                        " / " +
                        parseInt(campaign.goal_amount).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}
                </p>

                {campaign.status === "draft" && (
                    <div className="flex justify-end items-end my-5">
                        <Popup
                            triggerText="Finalize →"
                            title="Finalize Campaign?"
                            description="This campaign status will be set to 'pending' and will be reviewed by the admin. Are you sure you want to proceed?"
                            confirmText="Yes, Approve"
                            confirmColor="bg-green-600 hover:bg-green-700 text-white"
                            triggerClass="bg-green-400 text-black dark:text-white hover:bg-green-200 dark:bg-green-700 dark:hover:bg-green-600 text-xl"
                            onConfirm={() => handleFinalize()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const CreateDetailsPreview = () => {
    const data = ["About", "FAQ", "Updates", "Donations"];
    const { campaign, user, contents, flash, donations } = usePage().props;
    const [images, setImages] = useState({ thumbnail: null, logo: null });
    const [openPopUp, setOpenPopUp] = useState(false);
    const [popUpData, setPopupData] = useState({
        title: "",
        description: "",
        confText: "",
        confColor: "",
    });

    const backToPreview = () => {
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from");

        if (from === "myCampaigns") {
            router.get(`/campaigns/create/createPreview/${campaign.id}?from=${from}`);
        } else {
            router.get(`/campaigns/create/createPreview/${campaign.id}`);
        }
    };

    const backToForm = () => {
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from");

        if (from === "myCampaigns") {
            router.get(`/campaigns/create/${campaign.id}` + "?from=myCampaigns");
        } else {
            router.get(`/campaigns/create/${campaign.id}`);
        }
    };

    const uploadErrorHandler = (errors) => {
        let fieldName = "";
        let errorMessage = "";

        if (errors.thumbnail) {
            fieldName = "thumbnail";
            errorMessage = errors.thumbnail;
        } else if (errors.logo) {
            fieldName = "logo";
            errorMessage = errors.logo;
        } else {
            errorMessage = "Unknown error occurred during upload.";
        }

        setPopupData({
            title: "Upload Error",
            description: `Error found when uploading ${
                fieldName ? fieldName : "file"
            }: ${errorMessage}`,
            confText: "Okay",
            confColor: "bg-red-600 hover:bg-red-700 text-white",
        });

        setOpenPopUp(true);
    };

    const contentDivider = (data) => {
        if (data === "About") {
            return (
                <div>
                    <div className="flex flex-col gap-8 px-8 py-4 text-left min-h-[500px]">
                        <AboutBuilder
                            campaign={campaign}
                            contents={contents.filter(
                                (dat) =>
                                    dat.type === "paragraph" ||
                                    dat.type === "media"
                            )}
                            errorHandler={uploadErrorHandler}
                        />
                    </div>
                </div>
            );
        } else if (data === "FAQ") {
            return (
                // has a dropdown box
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <FaqBuilder
                        campaign={campaign}
                        contents={contents.filter((dat) => dat.type === "faqs")}
                    />
                </div>
            );
        } else if (data === "Updates") {
            return (
                // navigation bar on the side, with the updates on the inside  (make new table in xampp)
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <UpdateBuilder
                        campaign={campaign}
                        contents={contents.filter(
                            (dat) => dat.type === "updates"
                        )}
                    />
                </div>
            );
        } else if (data === "Donations") {
            return (
                // get all of the donation this project has received
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconFolderCode />
                            </EmptyMedia>
                            <EmptyTitle>This is the donation page</EmptyTitle>
                            <EmptyDescription>
                                Every donation this campaign obtained will be
                                displayed here. You can see the total donation
                                as well as the message left by donators!
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                        </EmptyContent>
                    </Empty>
                </div>
            );
        }
    };

    const tabsContentRepeater = (data, campaign, index) => {
        return (
            <TabsContent
                key={index}
                value={index + 1}
                className="w-[90%] text-lg text-center py-4"
            >
                {contentDivider(data, campaign)}
            </TabsContent>
        );
    };

    // thumbnail and logo handler
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

    return (
        <Layout_User>
            <Card className="rounded-none border-0 border-gray-700">
                <CardHeader className="flex flex-row">
                    <div className="w-full justify-center items-center">
                        <CardTitle className="text-center text-3xl">
                            Edit Campaign Details
                        </CardTitle>
                        <CardDescription className="text-center text-sm justify-center flex items-center">
                            {campaign.status === "draft"
                                ? "Edit everything about your campaign here! preview what your campaign details would looked like prior to publishing!"
                                : " Edit everything about your campaign here! Customize and personalize your campaign according to your preferences!"}
                        </CardDescription>
                    </div>

                    {/* <Popup
                        triggerText={
                            <Button className="bg-transparent text-green-700 dark:text-green-400 hover:bg-green-100 text-xl">
                                Finalize →
                            </Button>
                        }
                        title="Finalize Campaign?"
                        description="This campaign status will be set to 'pending' and will be reviewed by the admin. Are you sure you want to proceed?"
                        confirmText="Yes, Approve"
                        confirmColor="bg-green-600 hover:bg-green-700 text-white"
                        triggerClass="bg-transparent text-green-700 dark:text-green-400 hover:bg-green-100 text-xl"
                        onConfirm={() => handleFinalize()}
                    /> */}
                </CardHeader>

                <CardContent className="border-none">
                    <Breadcrumb className="flex w-full items-start justify-start m-0 ml-4 p-0">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={backToForm} className="text-muted-foreground">
                                    Campaign Data
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={backToPreview} className="text-muted-foreground">
                                    Campaign Media
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem aria-current="page">
                                <BreadcrumbLink className="font-medium text-primary"  >
                                    Campaign Preview
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <UpperPreview
                        campaign={campaign}
                        user={user}
                        images={images}
                        donations={donations}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-center items-center">
                <Tabs defaultValue={flash?.activeTab ?? 1} className="w-full">
                    <div className="dark:border-t-1 sticky top-[72px] z-40 bg-none pt-3 dark:pt-2 h-auto">
                        <TabsList className="text-gray-500 flex gap-30 bg-[#fcfcfc] dark:bg-gray-800 shadow-md mx-auto rounded-md dark:text-white h-[50px] max-w-7xl">
                            {data.map((dat, idx) => {
                                return (
                                    <TabsTrigger
                                        value={idx + 1}
                                        className="w-[10rem] flex px-8 uppercase text-md font-bold rounded-none tracking-wide border-2 border-transparent data-[state=active]:text-white data-[state=active]:bg-[#7C4789] transition-colors duration-200 rounded-sm h-[40px]"
                                    >
                                        {dat}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>
                    <div className="mt-10 flex justify-center items-center gap-2 bg-transparent">
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
