import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { router, usePage } from "@inertiajs/react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Car, Heart } from "lucide-react";
import { useEffect } from "react";

const scrollDonations = (data, idx) => {
    return (
        <Card key={idx} className="w-[300px] h-[100px] mx-auto flex flex-row items-center justify-between px-4" >

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
                    {data.anonymous === 1 ? data.user.nickname : "anonymous"}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-normal">
                {"$" + data.amount + ",00"}
            </CardContent>
            </div>
        </Card>
    );
}

const contentDivider = (data) => {
    if (data === "About") {
        return (
            <div>
                {/* this will be editable i think, if creator is the one opening the page, the edit section will be activated */}
                <p >{data}</p>
            </div>
        );
    } else if (data === "FAQ") {
        return (
            <div>
                <p>{data}</p>
            </div>
        );
    }else if (data === "Updates") {
        return (
            <div>
                <p>{data}</p>
            </div>
        );
    }else if (data === "Donations") {
        return (
            <div>
                <p>{data}</p>
            </div>
        );
    }

}

const tabsRepeater = (data, index) => {
    return (
        <>
            <TabsTrigger
                value={index + 1}
                className="flex min-w-64 uppercase text-md font-bold rounded-none tracking-wide border-2 border-transparent data-[state=active]:text-white data-[state=active]:bg-[#7C4789] transition-colors duration-200">
                {data}
            </TabsTrigger>
        </>
    );
}

const tabsContentRepeater = (data, index) => {
    return (
        <div className="gap-2 h-84 bg-transparent border-b border-gray-300 rounded-none justify-center flex">
            <TabsContent value={index + 1} className="flex w-full text-lg h-84 text-center items-center">
                {/* <p className="flex w-full text-lg h-84 text-center items-center">{data}</p> */}
                {contentDivider(data)}
            </TabsContent>
        </div>
    );
};

export default function Create() {
    const data = ["About","FAQ", "Updates", "Donations"]

    const { campaign, donations } = usePage().props;
    const percentage = Math.round((campaign.collected_amount / campaign.goal_amount) * 100);

    return (
        <Layout_User>
            {/* scrolling donations */}
            <div className="flex-col flex gap-2 m-8">
                <h1 className="text-xl text-center font-semibold">
                    Recent Donations
                </h1>
                <Separator className="flex-1 bg-gray-400 h-[1px]" />
                <div className="flex-row flex gap-2 flex justify-center items-center ">
                    {donations.length > 0 ? (
                        donations.map((donation) => scrollDonations(donation))
                    ) : (
                        <p className="text-lg text-center">
                            No Donations, yet...
                        </p>
                    )}
                </div>
                <Separator className="flex-1 bg-gray-400 h-[1px]" />
            </div>
            {/* pictures and titles */}
            <div className="flex container px-4 py-8 flex-row gap-8  justify-center items-center mx-auto">
                <div className="flex flex-row min-w-3/6 h-[400px] overflow-hidden border-1 border-gray-800 shrink-0">
                    <img
                        src="http://127.0.0.1:8000/images/nature.jpg"
                        alt="Campaign"
                        className="w-full h-full object-cover mb-4 rounded"
                    />
                </div>

                <div className="flex min-w-1/5 h-full overflow-hidden justify-center flex-col">
                    <h1 className="text-2xl text-end font-semibold flex mb=5">
                        {campaign.title}
                    </h1>
                    <div className="relative flex flex-col justify-end gap-4 mt-2">
                        <Progress
                            className="h-6 rounded-sm bg-[#BCA3CA] [&>div]:bg-[#7C4789]"
                            value={(campaign.collected_amount / campaign.goal_amount) * 100}
                        />
                        <span
                            className="absolute inset-0 flex items-start justify-center text-md font-medium"
                            style={{color: percentage > 50 ? "white" : "black"}}
                        >
                            {percentage}%
                        </span>
                    </div>
                    <p className="text-lg font-normal flex justify-end mt-5">
                        {"$" +campaign.collected_amount +",00" + " / " +"$" +campaign.goal_amount +",00"}
                    </p>
                    <div className="flex flex-row items-center justify-between mt-5">
                        <Button className="min-h-10 font-semibold text-lg"><Heart className= "w-20 h-20"/> <p>Like this campaign</p></Button>
                        <Button className="min-h-10 min-w-56 font-semibold text-lg">Donate</Button>
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
                            return tabsContentRepeater(dat, idx);
                        })}
                    </div>
                </Tabs>
            </div>
        </Layout_User>
    );
}
