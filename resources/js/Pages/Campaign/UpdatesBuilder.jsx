import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Carousel,CarouselNext, CarouselItem, CarouselPrevious, CarouselContent } from "@/Components/ui/carousel";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Trash } from "lucide-react";
import { useState } from "react";

export const UpdateBuilder = ({ campaign , contents , insertHandler }) => {
    const [editMode, setEditMode] = useState(false);
    // useState that saves what will be shown on the right side
    const [updates, setUpdates] = useState(contents);
    const [selectedUpdate, setSelectedUpdate] = useState(updates[0]);

    const handleAddUpdate = () => {
        const date = new Date();
        setUpdates((prev) => {
            const newUpdate = {
                id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                campaign_id: campaign.id,
                tabs: "updates",
                date: date.toLocaleDateString("en-GB").replaceAll("/", "-"),
                content: "",
                media: [],
            };

            const updated = [...prev, newUpdate];

            setSelectedUpdate(newUpdate); // newest one

            return updated;
        });
    };
    // console.log(selectedUpdate)
    const [formData, setFormData] = useState({
        tabs: selectedUpdate?.tabs || "",
        content: selectedUpdate?.content || "",
        media: selectedUpdate?.media || [],
    });

    const handleSaveUpdate = () => {
        if (!formData.title || formData.title.trim() === "") {
            alert("Title cannot be empty!");
            return;
        }

        if (!formData.content || formData.content.trim() === "") {
            alert("description cannot be empty!");
            return;
        }

        const cleanedMedia = (formData.media || []).filter((dat) => dat && (dat.file || dat.url));

        // console.log(cleanedMedia)

        const updatedList = updates.map((upd) => upd.id === selectedUpdate.id ? {...upd, content: `${formData.title}~;${formData.content ?? ""}`,media: cleanedMedia} : upd );

        const updatedUpdate = { ...selectedUpdate, content: `${formData.title}~;${formData.content ?? ""}`, media: cleanedMedia.map((dat) => dat.file), };

        const updatesPreview = { ...selectedUpdate, content: `${formData.title}~;${formData.content ?? ""}`, media: formData.media, };

        console.log(contents)
        setUpdates(updatedList)
        setSelectedUpdate(updatesPreview)
        setEditMode(false)

        if (insertHandler) {
            // console.log(updatedUpdate)
             insertHandler(updatedUpdate)
        }
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            filetype: file.type.startsWith("image/") ? "image" : "video",
            url: URL.createObjectURL(file),
            file,
        }));
        setFormData({ ...formData, media: previews });
    };

    const handleUpdatesDelete = () => {
        setUpdates(prev => {
        const index = prev.findIndex(u => u.id === selectedUpdate.id);
        const filtered = prev.filter(u => u.id !== selectedUpdate.id);

        let nextSelected = null;

        if (filtered.length > 0) {
            if (index - 1 >= 0) {
                nextSelected = filtered[index - 1];
            }
            else {
                nextSelected = filtered[0];
            }
        }

        setSelectedUpdate(nextSelected);
        return filtered;
    });
    };

    console.log(selectedUpdate)

    return (
        <>
            <Label className="text-3xl justify-center items-center font-bold text-[#7C4789]">
                Project Updates
            </Label>
            <div className="flex flex-col justify-center items-center gap-8 h-full w-full p-6">
                <div className="flex flex-row gap-8 justify-between w-full h-full">
                    {/* kiri */}
                    <div className="flex-1 flex flex-col gap-4 min-h-[100%]">
                        {selectedUpdate ? (
                            <>
                                {/* Title */}
                                {editMode ? (
                                    <Input
                                        value={formData.title}
                                        placeholder="Input update title here"
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="text-sm h-[50px]"
                                    />
                                ) : (
                                    <Label className="text-2xl font-bold text-[#7C4789]">
                                        {selectedUpdate.content
                                            ? selectedUpdate.content.split(
                                                  "~;"
                                              )[0]
                                            : "New Update"}
                                    </Label>
                                )}
                                {/* Date */}
                                {!editMode && (
                                    <p className="text-left text-base text-gray-400 my-2">
                                        {!selectedUpdate.created_at
                                            ? new Date().toLocaleDateString("en-GB").replaceAll("/", "-")
                                            : new Date(selectedUpdate.created_at).toLocaleDateString("en-GB").replaceAll("/", "-")
                                        }
                                    </p>
                                )}
                                {/* media carousel */}
                                {selectedUpdate.media?.length > 0 &&
                                    !editMode && (
                                        <Carousel className="w-full max-w-[80%] mx-auto">
                                            <CarouselContent>
                                                {selectedUpdate.media.map(
                                                    (m, idx) => (
                                                        <CarouselItem
                                                            key={idx}
                                                            className="flex justify-center"
                                                        >
                                                            {
                                                            m.filetype === "image" ? (
                                                                <img src={m.url} alt={`Media ${idx + 1}`} className="rounded-lg min-w-[100%] max-h-[450px] object-contain"/>
                                                            ) : (
                                                                <video controls className="rounded-lg w-full min-h-[400px] object-content">
                                                                    <source
                                                                        src={m.url}
                                                                        type="video/mp4"
                                                                    />
                                                                </video>
                                                            )
                                                            }
                                                        </CarouselItem>
                                                    )
                                                )}
                                            </CarouselContent>
                                            <CarouselPrevious className="text-[#7C4789]" />
                                            <CarouselNext className="text-[#7C4789]" />
                                        </Carousel>
                                    )}

                                {editMode && (
                                    <div className="flex flex-col gap-2">
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {formData.media ? (
                                                formData.media.map((m, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative"
                                                    >
                                                        {m.filetype === "image" ? (
                                                            <img
                                                                src={m.url}
                                                                alt=""
                                                                className="rounded-lg object-cover h-36 w-full"
                                                            />
                                                        ) : (
                                                            <video
                                                                src={m.url}
                                                                className="rounded-lg h-36 w-full object-cover"
                                                                muted
                                                            />
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <Label className="text-sm text-gray-500">
                                            Upload images/videos
                                        </Label>
                                        <div className="flex flex-row gap-5">
                                            <Input
                                                type="file"
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={handleMediaChange}
                                            />
                                            <Button
                                                className=""
                                                onClick={() =>
                                                    setFormData((dat) => ({
                                                        ...dat,
                                                        media: [],
                                                    }))
                                                }
                                            >
                                                clear media
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                {editMode ? (
                                    <Textarea
                                        rows={8}
                                        placeholder="Input update description here"
                                        className="text-md text-gray-700"
                                        value={formData.content}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                content: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    <p className="text-left text-md text-gray-700 whitespace-pre-line">
                                        {selectedUpdate.content.split("~;")[1]}
                                    </p>
                                )}

                                {/* Action buttons */}
                                <div className="flex justify-end gap-3 mt-4">
                                    {editMode ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="border-[#7C4789] text-[#7C4789]"
                                                onClick={() =>
                                                    setEditMode(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-[#7C4789] hover:bg-[#7C4789]/90 text-white"
                                                onClick={handleSaveUpdate}
                                            >
                                                Save
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-row justify-between w-full">
                                            <Trash
                                                size={30}
                                                onClick={() =>
                                                    handleUpdatesDelete()
                                                }
                                                className="cursor-pointer rounded-md p-1 hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
                                            />

                                            <Button
                                                variant="outline"
                                                className="w-30 text-base border-[#7C4789] text-[#7C4789] hover:bg-[#7C4789] hover:text-[#ffffff]"
                                                onClick={() => {
                                                    setFormData({
                                                        title: selectedUpdate.content.split(
                                                            "~;"
                                                        )[0],
                                                        content:
                                                            selectedUpdate.content.split(
                                                                "~;"
                                                            )[1],
                                                        media: selectedUpdate.media,
                                                    });
                                                    setEditMode(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Label className="text-lg italic text-gray-400">
                                No updates have been made.
                            </Label>
                        )}
                    </div>

                    {/* kanan */}
                    <div className="w-[280px] bg-purple-100 rounded-2xl p-4 flex flex-col gap-3 h-fit dark:bg-purple-900/50">
                        {updates.map((upd) => (
                            <Card
                                key={upd.id}
                                className={`cursor-pointer p-3 rounded-xl transition-all ${
                                    selectedUpdate?.id === upd.id
                                        ? "bg-[#7C4789] text-white dark:bg-purple-900"
                                        : "hover:bg-[#7C4789]/10 dark:bg-purple-900/50"
                                }`}
                                onClick={() => {
                                    setEditMode(false);
                                    setSelectedUpdate(upd);
                                }}
                            >
                                <CardContent className="flex items-center flex-col p-0">
                                    <Label
                                        className={`font-bold text-base ${
                                            selectedUpdate?.id === upd.id
                                                ? "text-white"
                                                : "text-[#7C4789]"
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
                                                : "text-gray-500"
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
                        ))}
                        <Button
                            variant={"outline"}
                            className="text-light dark:bg-purple-900/80"
                            onClick={handleAddUpdate}
                        >
                            + Add Project Update
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
