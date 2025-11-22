import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/Components/ui/sonner";
import { router } from "@inertiajs/react";


export const AboutBuilder = ({campaign, contents}) => {
    const [description, setDescription] = useState( contents.length > 0 ? contents : [{id: null, campaign_id: campaign.id, type: "paragraph", content: "Our Story~;" + campaign.description ,order_y: 1, isEditing:false}])

    
    const addParagraphBlock = () => {
        setDescription((prev) => {
            const lastOrder =
                prev.length > 0 ? prev[prev.length - 1].order_y : 0;

            return [
                ...prev,
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
        setDescription((prev) => {
            const lastOrder =
                prev.length > 0 ? prev[prev.length - 1].order_y : 0;

            return [
                ...prev,
                {
                    campaign_id: campaign.id,
                    type: "media",
                    content: "",
                    order_y: lastOrder + 1,
                    isEditing: true,
                },
            ];
        });
    };

    const handleChange = (index, value) => {
        // console.log(value)
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

     const handleRemove = (index) => {
         setDescription((prev) => prev.filter((_, i) => i !== index));
     };

     const handleSave = () => {
         if (description.some((dat) => dat.content === "")) {
             toast.error("there are empty descriptions!", {
                 description:
                     "please double check your description before submitting.",
             });
         } else {
            const prepared = description.map((block, index) => {
                return {
                    id: block.id ?? null,
                    campaign_id: block.campaign_id,
                    type: block.type,
                    content: block.type === "paragraph" ? block.content : block.content?.file,
                    // file: block.type === "media" ? block.content?.file ?? null : null,
                    existing:  block.type === "media" && typeof block.content === "string" ? block.content : null,
                    order_y: block.order_y,
                };
            })
            // console.log(prepared)
             router.post("/campaigns/insertAbout", prepared)
         }
     };

    return (
        <Card className="w-full p-6 border border-gray-300 shadow-sm justify-center flex flex-col">
            <CardHeader className="flex flex-col gap-4">
                <div className="flex flex-row w-full justify-between items-center">
                    <CardTitle className="text-xl font-semibold">
                        About Us
                    </CardTitle>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    <Button onClick={addParagraphBlock}> + Add Paragraph </Button>
                    <Button onClick={addMediaBlock}> + Add Media </Button>
                </div>
            </CardHeader>
            {description.length > 0 ? (
                <CardContent className="flex flex-col gap-4 ">
                    <div className="flex flex-col gap-4 justify-center">
                        {description.map((block, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-3 flex flex-col gap-5 bg-gray-50 relative"
                            >
                                {block.type === "paragraph" ? (
                                    block.isEditing ? (
                                        <div className="flex flex-col gap-4">
                                            <Input
                                                className="w-[85%]"
                                                defaultValue={
                                                    block.content.split(
                                                        "~;"
                                                    )[0] ?? ""
                                                }
                                                placeholder="Write your section title"
                                                onChange={(e) => {
                                                    const parts =
                                                        block.content.split(
                                                            "~;"
                                                        );
                                                    parts[0] = e.target.value;
                                                    handleChange(
                                                        index,
                                                        parts.join("~;")
                                                    );
                                                }}
                                            ></Input>
                                            <Textarea
                                                placeholder="Write a paragraph..."
                                                defaultValue={
                                                    block.content.split(
                                                        "~;"
                                                    )[1] ?? ""
                                                }
                                                onChange={(e) => {
                                                    const parts =
                                                        block.content.split(
                                                            "~;"
                                                        );
                                                    parts[1] = e.target.value;
                                                    handleChange(
                                                        index,
                                                        parts.join("~;")
                                                    );
                                                }}
                                                className="resize-none min-h-[120px]"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => {
                                                        toggleBlockEdit(index);
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        toggleBlockEdit(index)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <Label className="text-3xl font-bold text-[#7C4789]">
                                                {block.content.split("~;")[0]}
                                            </Label>
                                            <p className="break-words font-normal text-base mt-4 text-justify">
                                                {block.content.split("~;")[1]}
                                            </p>
                                            <div className="w-full flex justify-end">
                                                <Button
                                                    className="w-[10%]"
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
                                    <>
                                        {block.content ? (
                                            <img
                                                src={block.content.preview ?? block.content}
                                                alt="Preview"
                                                className="w-full max-h-[400px] object-contain rounded"
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
                                                    handleChange(index, {file: file, preview: URL.createObjectURL(file)});
                                                }
                                            }}
                                        />
                                    </>
                                )}

                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-0"
                                    onClick={() => handleRemove(index)}
                                >
                                    <Trash2
                                        className="w-30 h-30 text-white p-0"
                                        strokeWidth={2.5}
                                    />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            ) : (
                <CardContent className="flex h-[100px] w-full justify-center items-center text-gray-300 italic">
                    <h3>
                        Add explanation for your business before continuing!
                    </h3>
                </CardContent>
            )}
            {description.length > 0 ? (
                <CardAction className="mt-10 justify-end flex items-end w-full">
                    <Button onClick={handleSave}> Save Changes </Button>
                </CardAction>
            ) : (
                <></>
            )}
            <Toaster className="text-xl" toastOptions={{ duration:1500 }} position="top-center"/>
        </Card>
    );
};
