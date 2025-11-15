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


export const AboutDetails = ({contents}) => {
    const [description, setDescription] = useState(contents)
    console.log(contents)
    return (
        <div className="w-full p-6 justify-center flex flex-col items-center">
            {description.length > 0 ? (
                <div className="flex flex-col gap-10 w-[80%]">
                    <div className="flex flex-col gap-4 justify-center">
                        {description.map((block, index) => (
                            <div key={index}className="rounded-lg p-3 flex flex-col gap-5 relative">
                                {block.type === "paragraph" ? (
                                        <div className="flex flex-col gap-4">
                                            <Label className="text-3xl font-bold text-[#7C4789]">
                                                {block.content.split("~;")[0]}
                                            </Label>
                                            <p className="break-words font-normal text-lg mt-4 text-justify">
                                                {block.content.split("~;")[1]}
                                            </p>
                                        </div>)
                                 : (
                                    <>
                                        {block.content ? (
                                            <img
                                                src={block.content.preview ?? block.content}
                                                alt="Preview"
                                                className="w-full max-h-[400px] object-contain rounded border-2"
                                            />
                                        ) : null}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex h-[100px] w-full justify-center items-center text-gray-300 italic">
                    <h3>
                        Add explanation for your business before continuing!
                    </h3>
                </div>
            )}
        </div>
    );
};
