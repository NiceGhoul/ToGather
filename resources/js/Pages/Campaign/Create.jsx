import { Input } from "@/Components/ui/input";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import * as React from "react"
import { CalendarDays, CalendarIcon, ChevronDownIcon, Map } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Inertia } from "@inertiajs/inertia";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import CampaignLocation from "./CampaignLocation";
import Popup from "@/Components/Popup";
import { Label } from "@/Components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/Components/ui/input-group";
import { router } from "@inertiajs/react";

const emptyCampaign = {
    title: "",
    description: "",
    goal_amount: 0,
    collected_amount: 0,
    category:"",
    start_campaign: null,
    end_campaign: null,
    address: "",
    location: null,
    duration:"",
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

function create () {
const [campaignData, setCampaignData] = useState(emptyCampaign)
const [openLocation, setOpenLocation] = useState(false)
const [description, setDescription] = useState([])
const [openPop, setOpenPop] = useState(false)

const DatePicker = ({open, date, setOpen, setDate}) => {
  return (
    <div className="flex flex-col w-full">
      <Popover open={open} onOpenChange={setOpen} className="w-auto">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={date}
            className="w-full justify-between font-normal">
            {date ? date.toLocaleDateString() : "Select date"}
            <CalendarIcon className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="bottom">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

const errorDescription = () => {
    const errors = [];

    if (!campaignData.title.trim()) errors.push("Title cannot be empty.");
    if (!campaignData.description.trim())
        errors.push("Description cannot be empty.");
    if (!campaignData.category) errors.push("Please select a category.");
    if (!campaignData.address.trim()) errors.push("Address cannot be empty.");
    if (!campaignData.goal_amount || campaignData.goal_amount <= 0)
        errors.push("Goal amount must be greater than 0.");
    if (campaignData.goal_amount && campaignData.goal_amount > 50000000)
        errors.push("Goal amount must be less than Rp. 50.000.000,00.");
    if (!campaignData.duration) errors.push("Duration cannot be empty");
    if (campaignData.duration && campaignData.duration < 30) errors.push("Duration must be greater than or equals to 30 days");
    if (campaignData.duration && campaignData.duration > 90) errors.push("Duration must be less than or equals to 90 days");

    return errors;
};

// useEffect(() => {
//   const handleBeforeUnload = (event) => {
//     event.preventDefault()
//     event.returnValue = ""
//   };

//   window.addEventListener("beforeunload", handleBeforeUnload);

//   return () => {
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//   };
// }, []);

const handleCloseLocation = (locationData, addressData) => {
    setOpenLocation(false)
    setCampaignData((prev) => ({...prev, location: locationData}))
    setCampaignData((prev) => ({...prev, address: addressData}))
}

const handleClick = () => {

    const warning = errorDescription()

    if(errorDescription().length > 0){
        setDescription(warning)
        setOpenPop(true)

        return
    }else{
        setDescription([]);
        setOpenPop(true)
    }
}

const handleSave = () => {
    const formattedData = {
            ...campaignData,
            start_campaign: campaignData.start_campaign
            ? new Date(campaignData.start_campaign).toISOString().slice(0, 19).replace("T", " ")
            : null,
            end_campaign: campaignData.end_campaign
            ? new Date(campaignData.end_campaign).toISOString().slice(0, 19).replace("T", " ")
            : null,
        };
        router.post("/campaigns/newCampaign", formattedData);
}

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">
                            Create New Campaign
                        </CardTitle>
                        <CardDescription className="text-center text-sm">
                            Please fill out the form below to create a new
                            campaign.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div>
                            <Label className="mb-1">Campaign Title</Label>
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

                        <div>
                            <Label className="mb-1">Description</Label>
                            <Textarea
                                placeholder={`Give your campaign a brief description:
(what your product is, what your plan is for this campaign, or you can describe what your campaign is about)`}
                                value={campaignData.description}
                                onChange={(e) =>
                                    setCampaignData({
                                        ...campaignData,
                                        description: e.target.value,
                                    })
                                }
                                className="min-h-36"
                            />
                        </div>

                        <div>
                            <Label className="mb-1">Category</Label>
                            <Select
                                onValueChange={(dat) =>
                                    setCampaignData({
                                        ...campaignData,
                                        category: dat,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
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
                            <Label>Location</Label>
                            <Button
                                className="w-full gap-4"
                                variant="outline"
                                onClick={() => {
                                    setOpenLocation(true);
                                }}
                            >
                                {" "}
                                {campaignData.location === null
                                    ? "input your location"
                                    : "edit your location"}{" "}
                                <Map />{" "}
                            </Button>
                        </div>

                        <div className="flex justify-between items-start gap-4 mt-4">
                            <div className="w-3/6">
                                <div className="flex flex-row items-center justify-between">
                                    <Label className="mb-1">Goal Amount</Label>
                                </div>
                                <div className="w-full">
                                    <Input
                                        type="number"
                                        className="w-full h-[40px]"
                                        placeholder={"max: Rp. 50.000.000, 00"}
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
                                </div>
                                <div className="flex items-center justify-center">
                                    <Label className="mt-2 text-gray-300 font-light">
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

                            <div className="w-3/6 flex flex-col items-start justify-center">
                                <Label className="mb-1">
                                    Campaign Duration
                                </Label>
                                <InputGroup>
                                    <InputGroupInput
                                        placeholder="range: 30 - 90 days"
                                        value={campaignData.duration}
                                        onChange={(e) =>
                                            setCampaignData({
                                                ...campaignData,
                                                duration: e.target.value,
                                            })
                                        }
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <Label>Days</Label>

                                    </InputGroupAddon>
                                    <InputGroupAddon>
                                        <CalendarDays />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto" onClick={handleClick}>
                            Next
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <CampaignLocation
                open={openLocation}
                setCampaignLocation={handleCloseLocation}
                onClose={() => setOpenLocation(false)}
            />
            {openPop && (
                <Popup
                    triggerText={null}
                    title={description.length > 0 ? "Warning" : "Submit data?"}
                    description={
                        description.length > 0
                            ? description
                            : "your campaign will be set as pending, please wait for admin approval before continuing."
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
