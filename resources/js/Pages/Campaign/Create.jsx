import { Input } from "@/Components/ui/input";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import * as React from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

const parameterData = {
    title: "",
    description: "",
    goal_amount: 0,
    collected_amount: 0,
    start_date: null,
    end_date: null,
    status: "pending",
    user_id: null,
};

function create () {
const [campaignData, setCampaignData] = useState(parameterData);
const [openStart, setOpenStart] = useState(false)
const [openEnd, setOpenEnd] = useState(false)

const DatePicker = ({open, date, setOpen, setDate}) => {
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen} className="w-auto">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={date}
            className="w-48 justify-between font-normal">
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

const handleSave = () => {
  console.log("curr submit data", campaignData)
  Inertia.post("/campaigns/newCampaign", campaignData);
}

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto" >
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Create New Campaign</CardTitle>
                        <CardDescription className="text-center text-sm">
                            Please fill out the form below to create a new campaign.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                        <h1>Campaign Title:</h1>
                        <Input value={campaignData.title} onChange={(e) => setCampaignData({...campaignData, title: e.target.value})} />
                        </div>

                        <div>
                        <h1>Description:</h1>
                        <Input value={campaignData.description} onChange={(e) => setCampaignData({...campaignData, description: e.target.value})} />
                        </div>

                        <div>
                        <h1>Goal Amount:</h1>
                        <Input value={campaignData.goal_amount} onChange={(e) => setCampaignData({...campaignData, goal_amount: e.target.value})} />
                        </div>

                        <div className="flex mt-6 flex-row gap-4 align-center items-center">
                        <h1>Start Date:</h1>
                        <DatePicker open={openStart} date={campaignData.start_date} setOpen={setOpenStart} setDate={date => {setCampaignData({...campaignData, start_date: date}); setOpenStart(false)}}/>

                        <h1>End Date:</h1>
                        <DatePicker open={openEnd} date={campaignData.end_date} setOpen={setOpenEnd} setDate={date => {setCampaignData({...campaignData, end_date: date}); setOpenEnd(false)}}/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto" onClick={handleSave}>Submit</Button>
                        <Button className="ml-5" onClick={Inertia.visit('/campaigns/list')}>
                            Back
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </Layout_User>
    );
}


export default create;
