import { Input } from "@/Components/ui/input";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import * as React from "react"
import { CalendarIcon, ChevronDownIcon, Map } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Inertia } from "@inertiajs/inertia";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import CampaignLocation from "./CampaignLocation";

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
const [openEnd, setOpenEnd] = useState(false)
const [openLocation, setOpenLocation] = useState(false)
const [isFilled, setIsFilled] = useState(false)
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

  Inertia.post("/campaigns/newCampaign", formattedData);
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
                            <h1>Campaign Title</h1>
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
                            <h1>Description</h1>
                            <Textarea
                                placeholder="Give your campaign a brief description (what your product is, what your plan is for this campaign, or you can describe what your campaign is about)"
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
                            <h1>Category</h1>
                            <Select onValueChange={(dat) => setCampaignData({...campaignData,category: dat,})}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                    categories.map((dat) => (
                                        <SelectItem key={dat} value={dat}> {dat} </SelectItem>
                                    ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <h1>Location</h1>
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
                                    <h1>Goal Amount</h1>
                                </div>
                                <div className="w-full">
                                    <Input
                                        type="number"
                                        className="w-full"
                                        placeholder={"max: Rp. 10.000.000, 00"}
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
                                    <label className="mt-2 text-gray-300 font-light">
                                        {campaignData.goal_amount
                                            ? parseInt(
                                                  campaignData.goal_amount
                                              ).toLocaleString("id-ID", {
                                                  style: "currency",
                                                  currency: "IDR",
                                                  minimumFractionDigits: 2,
                                              })
                                            : "Rp. 0,00"}
                                    </label>
                                </div>
                            </div>

                            <div className="w-2/6 flex flex-col items-start justify-center">
                                <h1>End Date</h1>
                                <DatePicker
                                    open={openEnd}
                                    date={campaignData.end_campaign}
                                    setOpen={setOpenEnd}
                                    setDate={(date) => {
                                        setCampaignData({
                                            ...campaignData,
                                            end_campaign: date,
                                        });
                                        setOpenEnd(false);
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto" onClick={handleSave}>
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
        </Layout_User>
    );
}


export default create;
