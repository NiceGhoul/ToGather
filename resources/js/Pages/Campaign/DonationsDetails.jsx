import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty";
import { BanknoteArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const DonationsDetails = ({ donations }) => {
    const [openId, setOpenId] = useState(null);
    const [images, setImages] = useState({ thumbnail: null, logo: null });

    useEffect(() => {
        if (
            donations.user &&
            donations.user.images &&
            (images.thumbnail === null || images.logo === null)
        ) {
            donations.user.images.map((dat) => {
                dat.url.includes("thumbnail")
                    ? setImages((prev) => ({ ...prev, thumbnail: dat.url }))
                    : setImages((prev) => ({ ...prev, logo: dat.url }));
            });
        }
    }, [donations]);

    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return donations.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 overflow-hidden my-10 h-[400px] min-w-[100%]">
            {donations.map((d) => (
                <div
                    key={d.id}
                    className="w-100 bg-[#814a9c] text-white rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    onClick={() =>{handleToggle(d.id)}}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Avatar className="w-15 h-15 border-1 border-gray-700 text-sm">
                            <AvatarImage src={images.logoPreview} />
                            <AvatarFallback className="text-black dark:text-gray-200">
                                {d.user ? d.user.nickname[0] : "a"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-md">
                                {d.user ? d.user.nickname : "anonymous"} Donated
                            </span>
                            <span className="font-bold text-lg">
                                {parseInt(d.amount).toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Expandable Content */}
                    {openId === d.id && (
                        <div className="mt-3 bg-[#723f89] rounded-xl p-3">
                            {d.message || "no message"}
                        </div>
                    )}
                </div>
            ))}
        </div>
    ) : (
        <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <BanknoteArrowUp />
                    </EmptyMedia>
                    <EmptyTitle>This is the donation page</EmptyTitle>
                    <EmptyDescription>
                        Every donation this campaign obtained will be displayed
                        here! You can see the donations amount, as well as the
                        message left by donators!
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>{/* <Button>Add data</Button> */}</EmptyContent>
            </Empty>
        </div>
    );
};
