
import { Inertia } from "@inertiajs/inertia";
import { Button } from "@/Components/ui/button";
import Layout_User from "@/Layouts/Layout_User";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { Separator } from "@/Components/ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";
import { ButtonGroup } from "@/Components/ui/button-group";
import { Input } from "@/Components/ui/input";
import { SearchIcon } from "lucide-react";


const CampaignList = () => {
    const [campaignList, setCampaignList] = useState([]);
    const [visibleCampaign, setVisibleCampaign] = useState(8);
    const [chosenCategory, setChosenCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const categories = [
        "All",
        "Foods & Beverage",
        "Beauty & Cosmetic",
        "Clothes & Fashion",
        "Services",
        "Lifesyle",
        "Logistics",
    ];

useEffect(() => {
    setVisibleCampaign(8);
},[chosenCategory]);

 useEffect(() => {
     if (searchTerm === "") {
         axios
             .get("/campaigns/getlist?category=" + encodeURIComponent(chosenCategory))
             .then((response) => setCampaignList(response.data))
             .catch((error) =>console.error("There was an error fetching the campaign list!", error));
     }
     else {
         const filteredCampaigns = campaignList.filter((campaign) => campaign.title.toLowerCase().includes(searchTerm.toLowerCase()));
         setCampaignList(filteredCampaigns);
     }
 }, [visibleCampaign, chosenCategory, searchTerm]);


 const randomizePicture = () => {
    const images = ["boat.jpg", "huge.jpg", "king.jpg", "speeeed.jpg","sharks.jpg","nature.jpg"]
    const randomNum = Math.floor(Math.random() * images.length);
    return `http://127.0.0.1:8000/images/${images[randomNum]}`;
 }



    const cardRepeater = (data) => {
        if (!data) {
            return <p>No campaigns available.</p>;
        } else {
            return data.slice(0, visibleCampaign).map((dat, idx) => {
                return (
                    <div key={idx} className="border rounded-lg p-4 shadow-md">
                        <div>
                            <img
                                src={randomizePicture()}
                                alt="Campaign"
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                        </div>
                        <h2 className="text-lg font-semibold mb-2 min-h-12 max-h-16 overflow-hidden text-center items-center justify-center flex">
                            {dat.title.length > 50 ? dat.title.substring(0, 50) + "..." : dat.title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6 mt-6 text-justify">
                            {dat.description.length > 200
                                ? dat.description.substring(0, 200) + "..."
                                : dat.description}
                        </p>
                        <Link href="/campaigns/1">
                            <Button variant="primary" className="w-full">
                                View Details
                            </Button>
                        </Link>
                    </div>
                );
            });
        }
    };

    const handleShowMore = () => {
        setVisibleCampaign((prev) => prev + 8);
    };

    return (
        <Layout_User>
            {/* upper part (banner and category picker) */}
            <div className="w-full flex flex-col">
                <div
                    className="relative h-72 w-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('http://127.0.0.1:8000/images/handshake.jpg')",
                    }}
                >
                    <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full">
                        <h1 className="text-4xl font-bold text-white text-center">
                            <p>Together we Rise ToGather we Grow</p>
                        </h1>
                    </div>
                </div>
                <div
                    className="flex flex-row space-x-4 h-[75px] bg-gray-300 bg-cover bg-center w-full items-center justify-center"
                    style={{ background: "#7A338C" }}
                >
                    {categories.map((category, idx) => (
                        <Button
                            key={idx}
                            onClick={() => setChosenCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* search bar  */}
            <div className="w-11/12 flex m-10 items-end justify-end">
                <ButtonGroup className="w-84">
                    <Input
                        placeholder="Search Campaign"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline" aria-label="Search">
                        <SearchIcon />
                    </Button>
                </ButtonGroup>
            </div>

            {/* lower part (campaigns) */}
            <div className="w-11/12 mx-auto flex flex-col justify-center mt-10 mb-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-20 text-center flex items-center justify-center h-full gap-4">
                        <Separator className="flex-1" />
                        {chosenCategory === "All"
                            ? "All Campaigns"
                            : chosenCategory}
                        <Separator className="flex-1" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {campaignList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {cardRepeater(campaignList)}
                        </div>
                    ) : (
                        <p className="flex flex-col justify-center items-center w-full mx-auto text-center text-gray-500 mt-20">
                            Loading...
                        </p>
                    )}
                    {visibleCampaign < campaignList.length && (
                        <div className="text-2xl font-bold mb-4 text-center flex items-center justify-center h-full gap-4 mt-10">
                            <Separator className="flex-1 bg-gray-400 h-[1px]" />
                            <p
                                onClick={handleShowMore}
                                className="text-sm text-gray-400 font-thin"
                            >
                                {" "}
                                show more{" "}
                            </p>
                            <Separator className="flex-1 bg-gray-400 h-[1px]" />
                        </div>
                    )}
                </CardContent>
            </div>
        </Layout_User>
    );
};

export default CampaignList;
