import { Button } from "@/Components/ui/button"
import { Card } from "@/Components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty"
import { Label } from "@/Components/ui/label"
import Layout_User from "@/Layouts/Layout_User"
import { Link, usePage } from "@inertiajs/react"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { IconFolderCode } from "@tabler/icons-react"

const LikedCampaign = () => {

    const { likedCampaign } = usePage().props

    const cardRepeater = (data) => {
            return data.map((campaign, idx) => {
                const progress =
                    campaign.goal_amount > 0
                        ? Math.min(
                              (campaign.collected_amount /
                                  campaign.goal_amount) *
                                  100,
                              100
                          ).toFixed(1)
                        : 0;

                return (
                    <div
                        key={idx}
                        className="border rounded-lg p-4 shadow-md flex flex-col justify-between"
                    >
                        {!campaign.thumbnail_url && (
                            <img
                                src="http://127.0.0.1:8000/images/boat.jpg"
                                alt={campaign.title}
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                        )}

                        <h2 className="h-[48px] flex justify-center items-center text-lg font-semibold mb-2 text-center min-h-[2rem] max-h-[3rem] overflow-hidden leading-snug">
                            {campaign.title.length > 50
                                ? campaign.title.substring(0, 50) + "..."
                                : campaign.title}
                        </h2>

                        <p className="text-sm text-gray-600 text-center mb-2">
                            {new Date(campaign.created_at).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500 text-center mb-2">
                            {campaign.category ?? "Uncategorized"}
                        </p>

                        <p className="h-[80px] text-sm text-gray-700 mb-3 text-justify">
                            {campaign.description
                                ?.replace(/(<([^>]+)>)/gi, "")
                                .slice(0, 150) || "No description available."}
                            ...
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                            <div
                                className="bg-purple-700 h-3 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2 text-center">
                            Raised {" "}{parseInt(campaign.collected_amount).toLocaleString("id-ID", {style: "currency",currency: "IDR",minimumFractionDigits: 2,})}{" "}/ {parseInt(campaign.goal_amount).toLocaleString("id-ID", {style: "currency",currency: "IDR",minimumFractionDigits: 2,})}{" "}
                            ({progress}%)
                        </p>

                        <div className="flex justify-center gap-2 mb-4">
                            <span
                                className={`inline-block text-xs font-semibold px-2 py-1 rounded-full
                            ${
                                campaign.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : campaign.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : campaign.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : campaign.status === "banned"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-purple-100 text-purple-700"
                            }`}
                            >
                                {campaign.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="flex justify-center mt-auto">
                            <Link
                                href={`/campaigns/details/${campaign.id}`}
                                className="text-purple-700 hover:underline font-medium"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                );
            });
    };

    const emptyList = () => {
        return (
            <div className="h-full w-full flex">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <IconFolderCode className="w-10 h-10 text-purple-600" />
                        </EmptyMedia>
                        <EmptyTitle>No Campaigns liked Yet</EmptyTitle>
                        <EmptyDescription>
                            all of your liked campaign will be shown here!
                        </EmptyDescription>
                    </EmptyHeader>

                    <EmptyContent>
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline" asChild>
                                <Link href="/campaigns/list">
                                    Browse Campaigns
                                </Link>
                            </Button>
                        </div>
                    </EmptyContent>
                </Empty>
            </div>
        );
    }

    return (
        <Layout_User>
            <div className="flex flex-col gap-5">
                {likedCampaign.length > 0 ? (
                    <Label className="text-2xl mx-5 my-5">Liked Campaign</Label>
                ) : (
                    <></>
                )}
                {likedCampaign.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {cardRepeater(likedCampaign)}
                    </div>
                ) : (
                    emptyList()
                )}
            </div>
        </Layout_User>
    );
}


export default LikedCampaign
