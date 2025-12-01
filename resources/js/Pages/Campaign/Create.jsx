import { Input } from "@/Components/ui/input";
import Layout_User from "@/Layouts/Layout_User";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { useState, useEffect } from "react";
import * as React from "react";
import { CalendarDays, CalendarIcon, Map } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import CampaignLocation from "./CampaignLocation";
import Popup from "@/Components/Popup";
import { Label } from "@/Components/ui/label";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/Components/ui/input-group";
import { router, usePage } from "@inertiajs/react";

const emptyCampaign = {
    title: "",
    description: "",
    goal_amount: 0,
    collected_amount: 0,
    category: "",
    start_campaign: null,
    end_campaign: null,
    address: "",
    location: null,
    duration: "",
    status: "pending",
    user_id: null,
};

const categories = [
    "Foods & Beverage",
    "Beauty & Cosmetic",
    "Clothes & Fashion",
    "Services",
    "Lifesyle",
    "Logistics",
];

function create() {
    const { campaign, user_Id, location } = usePage().props;
    const [campaignData, setCampaignData] = useState(emptyCampaign);
    const [openLocation, setOpenLocation] = useState(false);
    const [description, setDescription] = useState([]);
    // const [openUnsaved, setOpenUnsaved] = useState(false)
    const [openPop, setOpenPop] = useState(false);

    const DatePicker = ({ open, date, setOpen, setDate }) => {
        return (
            <div className="flex flex-col w-full">
                <Popover open={open} onOpenChange={setOpen} className="w-auto">
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id={date}
                            className="w-full justify-between font-normal"
                        >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <CalendarIcon className="h-3 w-3 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="bottom"
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={setDate}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        );
    };

    useEffect(() => {
        console.log(campaign, location);
        if (campaign) {
            setCampaignData(campaign);
        }

        if (campaign && location) {
            setCampaignData((prev) => ({ ...prev, location: location }));
        }
    }, [campaign, location]);

    const errorDescription = () => {
        const errors = [];

        if (!campaignData.title.trim()) errors.push("Title cannot be empty.");
        if (!campaignData.description.trim())
            errors.push("Description cannot be empty.");
        if (!campaignData.category) errors.push("Please select a category.");
        if (!campaignData.address.trim())
            errors.push("Address cannot be empty.");
        if (!campaignData.goal_amount || campaignData.goal_amount <= 0)
            errors.push("Goal amount must be greater than 0.");
        // if (campaignData.goal_amount && campaignData.goal_amount > 50000000)
        //     errors.push("Goal amount must be less than Rp. 50.000.000,00.");
        if (!campaignData.duration) errors.push("Duration cannot be empty");
        if (campaignData.duration && campaignData.duration < 0)
            errors.push("Duration must be greater than or equals to 1 day");
        // if (campaignData.duration && campaignData.duration > 90) errors.push("Duration must be less than or equals to 90 days");

        return errors;
    };

    // useEffect(() => {
    //   const handleBeforeUnload = (event) => {
    //     setOpenUnsaved(true)
    //     event.preventDefault()
    //     event.returnValue = ""
    //   };

    //   window.addEventListener("beforeunload", handleBeforeUnload);

    //   return () => {
    //     window.removeEventListener("beforeunload", handleBeforeUnload);
    //   };
    // }, []);

    const handleCloseLocation = (locationData, addressData) => {
        console.log(locationData);
        setOpenLocation(false);
        setCampaignData((prev) => ({ ...prev, location: locationData }));
        setCampaignData((prev) => ({ ...prev, address: addressData }));
    };

    const handleClick = () => {
        const warning = errorDescription();

        if (errorDescription().length > 0) {
            setDescription(warning);
            setOpenPop(true);

            return;
        } else {
            setDescription([]);
            setOpenPop(true);
        }
    };

    const handleEditCancel = () => {
        router.get(`/campaigns/create/createPreview/${campaignData.id}`);
    };

    const handleSave = () => {
        const formattedData = {
            ...campaignData,
            start_campaign: campaignData.start_campaign
                ? new Date(campaignData.start_campaign)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")
                : null,
            end_campaign: campaignData.end_campaign
                ? new Date(campaignData.end_campaign)
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")
                : null,
        };
        // console.log(formattedData)
        router.post("/campaigns/newCampaign", formattedData);
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">
                            {campaign === undefined
                                ? " Create New Campaign"
                                : "Update Campaign Data"}
                        </CardTitle>
                        <CardDescription className="text-center text-sm">
                            {"Please fill out the form below to " +
                                (campaign != undefined ? "update" : "create") +
                                " a new campaign."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div>
                            <Label className="mb-1 dark:text-white">
                                Campaign Title
                            </Label>
                            <Input
                                placeholder="Enter your title"
                                value={campaignData.title}
                                onChange={(e) =>
                                    setCampaignData({
                                        ...campaignData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="dark:text-white">
                            <Label className="mb-1 dark:text-white">
                                Description
                            </Label>
                            <Textarea
                                placeholder={`Give your campaign a brief description:
(What your product is, what your plan is for this campaign, or you can describe what your campaign is about)`}
                                value={campaignData.description}
                                onChange={(e) =>
                                    setCampaignData({
                                        ...campaignData,
                                        description: e.target.value,
                                    })
                                }
                                className="min-h-36 dark:text-white"
                            />
                        </div>

                        <div>
                            <Label className="mb-1 dark:text-white">
                                Category
                            </Label>
                            <Select
                                value={campaignData.category}
                                onValueChange={(dat) =>
                                    setCampaignData({
                                        ...campaignData,
                                        category: dat,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((dat) => (
                                        <SelectItem key={dat} value={dat}>
                                            {dat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-1 dark:text-white">
                                Location
                            </Label>
                            <Button
                                className="w-full gap-4"
                                variant="outline"
                                onClick={() => {
                                    setOpenLocation(true);
                                }}
                            >
                                {" "}
                                {campaignData.location === null
                                    ? "Input Your Location"
                                    : "Edit Your Location"}{" "}
                                <Map />{" "}
                            </Button>
                        </div>

                        <div className="flex justify-between items-start gap-4 mt-4">
                            <div className="w-3/6">
                                <div className="flex flex-row items-center justify-between">
                                    <Label className="mb-1 dark:text-white">
                                        Goal Amount
                                    </Label>
                                </div>
                                <div className="w-full">
                                    <InputGroup className="h-[40px] w-full">
                                        <InputGroupInput
                                            placeholder="Input Your Target Funding"
                                            value={
                                                campaignData.goal_amount === 0
                                                    ? ""
                                                    : campaignData.goal_amount
                                            }
                                            onChange={(e) =>
                                                setCampaignData({
                                                    ...campaignData,
                                                    goal_amount: e.target.value,
                                                })
                                            }
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <Label>,00</Label>
                                        </InputGroupAddon>
                                        <InputGroupAddon>
                                            <Label className="dark:text-white">
                                                Rp.{" "}
                                            </Label>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Label className="mt-2 text-gray-400 font-light">
                                        {campaignData.goal_amount
                                            ? parseInt(
                                                  campaignData.goal_amount
                                              ).toLocaleString("id-ID", {
                                                  style: "currency",
                                                  currency: "IDR",
                                                  minimumFractionDigits: 2,
                                              })
                                            : "Rp. 0,00"}
                                    </Label>
                                </div>
                            </div>

                            <div className="w-3/6 flex flex-col items-start justify-center ">
                                <Label className="mb-1 dark:text-white">
                                    Campaign Duration
                                </Label>
                                <InputGroup className="h-[40px] w-full">
                                    <InputGroupInput
                                        placeholder="Input Your Campaign's Duration"
                                        value={campaignData.duration}
                                        onChange={(e) =>
                                            setCampaignData({
                                                ...campaignData,
                                                duration: e.target.value,
                                            })
                                        }
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <Label className="dark:text-white">
                                            Days
                                        </Label>
                                    </InputGroupAddon>
                                    <InputGroupAddon>
                                        <CalendarDays />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row gap-5 justify-end">
                        <div className="w-full justify-center flex">
                            <Button
                                className="w-28 h-8 text-sm ml-36 bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
                                onClick={handleClick}
                            >
                                {campaign != undefined ? "Update" : "Next"}
                            </Button>
                        </div>

                        <div className="w-1/6 justify-end flex">
                            {campaign != undefined ? (
                                <Button
                                    className="bg-transparent text-purple-700  hover:bg-purple-100 dark:hover:bg-blue-600 dark:text-white text-lg"
                                    onClick={handleEditCancel}
                                >
                                    Go to Media →
                                </Button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <CampaignLocation
                open={openLocation}
                setCampaignLocation={handleCloseLocation}
                onClose={() => setOpenLocation(false)}
                locationData={campaignData.location}
            />
            {openPop && (
                <Popup
                    open={openPop}
                    onClose={() => setOpenPop(false)}
                    triggerText={null}
                    title={
                        description.length > 0
                            ? "Warning"
                            : campaign != undefined
                            ? "Update data?"
                            : "Submit data?"
                    }
                    description={
                        description.length > 0
                            ? description
                            : "Your campaign will be saved as a draft."
                    }
                    confirmText={description.length > 0 ? "okay" : "Confirm"}
                    cancelText="Cancel"
                    showCancel={description.length > 0 ? false : true}
                    confirmColor={
                        description.length > 0
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                    }
                    onConfirm={
                        description.length > 0
                            ? () => setOpenPop(false)
                            : handleSave
                    }
                />
            )}
        </Layout_User>
    );
}

export default create;
