import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty";
import { Separator } from "@/Components/ui/separator";
import { Spinner } from "@/Components/ui/spinner";
import { IconFolderCode } from "@tabler/icons-react";
import { BanknoteArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const DonationsDetails = ({ donations }) => {
    const [openId, setOpenId] = useState(null);

    console.log(donations);

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

    const handleShowMore = () => {
        return null;
    };

    return donations.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 overflow-x-auto">
            {donations.map((d) => (
                <Accordion
                    key={d.id}
                    type="single"
                    collapsible
                    className="flex-shrink-0 w-100" // fixed width per item
                    value={openId}
                    onValueChange={handleToggle}
                >
                    <AccordionItem value={d.id.toString()}>
                        <AccordionTrigger
                            className={`bg-[#814a9c] text-white px-5 py-4 transition-all duration-200 hover:opacity-90 flex items-center gap-3 ${
                                openId === d.id.toString()
                                    ? "rounded-t-xl"
                                    : "rounded-xl"
                            }`}
                        >
                            <Avatar className="w-15 h-15 border-1 border-gray-700 text-sm">
                                <AvatarImage
                                    src={images.logoPreview}
                                    alt={d.user ? d.user.nickname : "logo"}
                                />
                                <AvatarFallback className="text-black">
                                    {d.user ? d.user.nickname[0] : "ano"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-xs">
                                    {d.user ? d.user.nickname : "anonymous"}{" "}
                                    Donated
                                </span>
                                <span className="font-bold text-lg">
                                    +Rp. {d.amount.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="bg-[#814a9c] text-white rounded-b-xl p-4">
                            {d.message ? d.message : "no message"}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>
    ) : (
        <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <BanknoteArrowUp />
                    </EmptyMedia>
                    <EmptyTitle>Feature not available</EmptyTitle>
                    <EmptyDescription>
                        This feature is currently under maintainance
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>{/* <Button>Add data</Button> */}</EmptyContent>
            </Empty>
        </div>
    );
};
