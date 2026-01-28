import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/Components/ui/sonner";
import { router } from "@inertiajs/react";
import Popup from "@/Components/Popup";

export const AboutBuilder = ({campaign, contents, errorHandler}) => {
    // responsible in saving blocks for about page
    const [description, setDescription] = useState(contents.length > 0 ? contents : [{id: null, campaign_id: campaign.id, type: "paragraph", content: "Our Story~;" + campaign.description ,order_y: 1, isEditing:false}])
    // old Description is used to make sure does changes happens or not
    const oldDescription = contents.length > 0 ? contents : [{id: null, campaign_id: campaign.id, type: "paragraph", content: "Our Story~;" + campaign.description ,order_y: 1, isEditing:false}]

    useEffect(() => {
        if (contents.length > 0) {
            setDescription(contents);
        }
    }, [contents]);

    const addParagraphBlock = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "auto",
        });
        setDescription((prev) => {
            const lastOrder = prev.length > 0 ? prev[prev.length - 1].order_y : 0;
            return [...prev,
                {
                    campaign_id: campaign.id,
                    type: "paragraph",
                    content: "",
                    order_y: lastOrder + 1,
                    isEditing: true,
                },
            ];
        });
    };

    const addMediaBlock = () => {
        // on add, scroll to bottom of page
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "instant",
        });
        setDescription((prev) => {
            const lastOrder = prev.length > 0 ? prev[prev.length - 1].order_y : 0;
            return [...prev,{ campaign_id: campaign.id, type: "media", content: "", order_y: lastOrder + 1, isEditing: true }];
        });
    };

    const handleChange = (index, value) => {
        setDescription((prev) =>
            prev.map((block, i) =>
                i === index ? { ...block, content: value } : block
            )
        );
    };

    const toggleBlockEdit = (index) => {
        setDescription((prev) =>
            prev.map((block, i) =>
                i === index ? { ...block, isEditing: !block.isEditing } : block
            )
        );
    };

    const handleRemove = (id, index) => {
        if (id != undefined) {
            setDescription((prev) => prev.filter((_, i) => i !== index));
            router.post(`/campaigns/deleteContent/${id}`);
        } else {
            setDescription((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        if (description.some((dat) => dat.content === "")) {
            toast.error("there are empty descriptions!", {
                description: "please double check your description before submitting.",
            });
        } else {
            const prepared = description.map((block) => {
                return {
                    id: block.id ?? null,
                    campaign_id: block.campaign_id,
                    type: block.type,
                    content:
                        block.type === "paragraph"
                            ? block.content
                            : block.content?.file,
                    existing:
                        block.type === "media" &&
                        typeof block.content === "string"
                            ? block.content
                            : null,
                    order_y: block.order_y,
                };
            })
             router.post("/campaigns/insertAbout", prepared,{
                onError: (errors) => errorHandler(errors),
             })
             setDescription(contents)
         }
     };

    return (
        <Card className="w-full h-full p-6 border border-gray-300 dark:border-gray-700 shadow-sm justify-center flex flex-col dark:bg-gray-800">
            <CardHeader className="relative bottom-0 top-0 flex flex-col gap-4">
                <div className="flex flex-row w-full justify-between items-center">
                    <CardTitle className="text-xl font-semibold dark:text-white">
                        About Us
                    </CardTitle>
                </div>
                <div className="sticky flex justify-center gap-4 mt-2 top-[80px] z-35">
                    <Button
                        onClick={addParagraphBlock}
                        className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                    >
                        {"+ Add Paragraph"}
                    </Button>
                    <Button
                        onClick={addMediaBlock}
                        className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                    >
                        {"+ Add Media"}
                    </Button>
                </div>
            </CardHeader>
            {/*  */}
            {description && description.length > 0 ? (
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 justify-center">
                        {description?.map((block, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-3 flex flex-col gap-5 bg-gray-50 dark:bg-gray-800 relative"
                            >
                                {block.type === "paragraph" ? (
                                    block.isEditing ? (
                                        <div className="flex flex-col gap-4">
                                            <Input
                                                className="w-[85%]"
                                                defaultValue={
                                                    block.content.split("~;")[0] ?? ""
                                                }
                                                placeholder="Write your section title"
                                                onChange={(e) => {
                                                    const parts =  block.content.split("~;");
                                                    parts[0] = e.target.value;
                                                    handleChange(
                                                        index,
                                                        parts.join("~;"),
                                                    );
                                                }}
                                            ></Input>
                                            <Textarea
                                                placeholder="Write a paragraph..."
                                                defaultValue={
                                                    block.content.split(
                                                        "~;",
                                                    )[1] ?? ""
                                                }
                                                onChange={(e) => {
                                                    const parts =
                                                        block.content.split(
                                                            "~;",
                                                        );
                                                    parts[1] = e.target.value;
                                                    handleChange(
                                                        index,
                                                        parts.join("~;"),
                                                    );
                                                }}
                                                className="resize-none min-h-[120px] dark:text-gray-100"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        toggleBlockEdit(index);
                                                    }}
                                                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        toggleBlockEdit(index)
                                                    }
                                                    className="dark:bg-red-600 dark:hover:bg-red-500 dark:text-white bg-red-200 hover:bg-red-300 text-red-700"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <Label className="text-3xl font-bold text-[#7C4789] dark: text-[#9A5CAA]">
                                                {block.content.split("~;")[0]}
                                            </Label>
                                            <p className="break-words font-normal text-base mt-4 text-justify dark:text-gray-200">
                                                {block.content.split("~;")[1]}
                                            </p>
                                            <div className="w-full flex justify-end">
                                                <Button
                                                    className="w-[10%] bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleBlockEdit(index)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="items-center flex flex-col">
                                        {block.content ? (
                                            <img
                                                src={
                                                    block.content.preview ??
                                                    block.media[0].url
                                                }
                                                alt="Preview"
                                                className="w-[600px] min-h-[400px] object-fit rounded border-1 my-5"
                                            />
                                        ) : null}
                                        <Input
                                            className="w-[90%]"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    handleChange(index, {
                                                        file: file,
                                                        preview:
                                                            URL.createObjectURL(
                                                                file,
                                                            ),
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                                <Popup
                                    triggerText={
                                        <Button
                                            size="icon"
                                            className="dark:bg-red-600 dark:hover:bg-red-500 dark:text-white bg-red-200 hover:bg-red-300 text-red-700"
                                        >
                                            <Trash2
                                                className="w-30 h-3 p-0"
                                                strokeWidth={2.5}
                                            />
                                        </Button>
                                    }
                                    title={"Delete " + block.type + " ?"}
                                    description={
                                        "This " +
                                        block.type +
                                        " will be removed permanently, are you sure?"
                                    }
                                    confirmText="Yes, Confirm"
                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                    triggerClass="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-0"
                                    onConfirm={() =>
                                        handleRemove(block.id, index)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            ) : (
                <CardContent className="flex h-[100px] w-full justify-center items-center text-gray-300 dark:text-gray-500 italic">
                    <h3>
                        {"Add explanation for your business before continuing!"}
                    </h3>
                </CardContent>
            )}
            {description.length != oldDescription.length ||
            description.some((dat) => oldDescription.map((a) => a === dat)) ? (
                <CardFooter className="bottom-0 mt-10 justify-end flex items-end w-full">
                    <Button
                        onClick={handleSave}
                        className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                    >
                        {"Save Changes"}
                    </Button>
                </CardFooter>
            ) : (
                <></>
            )}
            <Toaster
                className="text-xl"
                toastOptions={{ duration: 1500 }}
                position="top-center"
            />
        </Card>
    );
};
