import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty";
import { BanknoteArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const DonationsDetails = ({ donations }) => {
    const [openId, setOpenId] = useState(null);
    const [images, setImages] = useState({ thumbnail: null, logo: null });

    const ITEMS_PER_PAGE = 12;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE);

    const paginatedDonations = donations.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

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
        // <div className="flex flex-wrap items-center justify-center gap-4 overflow-hidden my-10 h-[530px] min-w-[100%]">
        <div className="grid grid-cols-3 gap-4 my-10 min-w-full">
            {paginatedDonations.map((d) => (
                <div
                    key={d.id}
                    className="w-100 bg-[#814a9c] text-white rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => {
                        handleToggle(d.id);
                    }}
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
                                {d.anonymous === 0 ? d.user.nickname : "anonymous"} Donated
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
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2 w-full col-span-3">
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        return (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
                                    page === p
                                        ? "bg-purple-800 text-white border-purple-800"
                                        : "bg-white dark:bg-gray-800 text-purple-800 dark:text-white border-purple-800 dark:border-gray-600 hover:bg-purple-100"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            )}
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
