import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import {
    Carousel,
    CarouselNext,
    CarouselItem,
    CarouselPrevious,
    CarouselContent,
} from "@/Components/ui/carousel";
import { Label } from "@/Components/ui/label";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export const UpdatesDetails = ({ contents }) => {

    console.log(contents)

    const [selectedUpdate, setSelectedUpdate] = useState(contents[0]);
    return (
        <>
            <div className="flex flex-col justify-center items-center gap-8 h-full w-full p-6">
                <div className="flex flex-row gap-8 justify-between w-full h-full">
                    <div className="flex-1 flex flex-col gap-4 min-h-[100%]">
                        {selectedUpdate ? (
                            <>
                                <Label className="text-2xl font-bold text-[#7C4789]">
                                    {selectedUpdate.content
                                        ? selectedUpdate.content.split("~;")[0]
                                        : "New Update"}
                                </Label>

                                {/* Date */}

                                <p className="text-left text-base text-gray-400 my-2">
                                    {!selectedUpdate.created_at
                                        ? new Date()
                                              .toLocaleDateString("en-GB")
                                              .replaceAll("/", "-")
                                        : new Date(selectedUpdate.created_at)
                                              .toLocaleDateString("en-GB")
                                              .replaceAll("/", "-")}
                                </p>

                                {/* media carousel */}
                                {selectedUpdate.media?.length > 0 && (
                                    <Carousel className="w-full max-w-[80%] mx-auto border-2 rounded-lg mb-10">
                                        <CarouselContent>
                                            {selectedUpdate.media.map(
                                                (m, idx) => (
                                                    <CarouselItem
                                                        key={idx}
                                                        className="flex justify-center"
                                                    >
                                                        {
                                                        m.filetype.toString() === "image" ? (
                                                            <img
                                                                src={m.url}
                                                                alt={`Media ${idx + 1}`}
                                                                className="rounded-lg min-w-[100%] max-h-[450px] object-contain"
                                                            />
                                                        ) : (
                                                            <video controls className="rounded-lg w-full min-h-[400px] object-content">
                                                                <source
                                                                    src={m.url}
                                                                    type="video/mp4"
                                                                />
                                                            </video>
                                                        )}
                                                    </CarouselItem>
                                                )
                                            )}
                                        </CarouselContent>
                                        <CarouselPrevious className="text-[#7C4789]" />
                                        <CarouselNext className="text-[#7C4789]" />
                                    </Carousel>
                                )}
                                <p className="text-left text-md text-gray-700 whitespace-pre-line">
                                    {selectedUpdate.content.split("~;")[1]}
                                </p>
                            </>
                        ) : (
                            <Label className="text-lg italic text-gray-400">
                                No updates have been made.
                            </Label>
                        )}
                    </div>

                    {/* kanan */}
                    <div className="w-[280px] rounded-2xl p-4 flex flex-col gap-3 h-fit shadow-md justify-center">
                        <Label className="w-full justify-center dark:text-white font-semibold text-xl py-3 border-b-1 border-black dark: border-gray-400">Campaign Updates</Label>
                        {contents.length > 0 ?
                        contents.map((upd) => (
                            <Card
                                key={upd.id}
                                className={`cursor-pointer border-1 border-gray-400 p-3 rounded-xl transition-all ${
                                    selectedUpdate?.id === upd.id ? "bg-[#7C4789] " : "hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                                onClick={() => setSelectedUpdate(upd)}
                            >
                                <CardContent className="flex items-center flex-col p-0">
                                    <Label
                                        className={`font-bold text-base ${
                                            selectedUpdate?.id === upd.id
                                                ? "text-white dark:text-white"
                                                : "text-[#7C4789] dark:text-white"
                                        }`}
                                    >
                                        {upd.content
                                            ? upd.content.split("~;")[0]
                                            : "New Update"}
                                    </Label>
                                    <p
                                        className={`text-sm mt-1 ${
                                            selectedUpdate?.id === upd.id
                                                ? "text-gray-100"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {!upd.created_at
                                            ? new Date()
                                                  .toLocaleDateString("en-GB")
                                                  .replaceAll("/", "-")
                                            : new Date(upd.created_at)
                                                  .toLocaleDateString("en-GB")
                                                  .replaceAll("/", "-")}
                                    </p>
                                </CardContent>
                            </Card>
                        )) : <div className="h-full my-25 justify-center text-center items-center"><Label className="text-md font-extralight italic text-gray-400 text-center">There are currently no updates available!</Label></div>}
                    </div>
                </div>
            </div>
        </>
    );
};
