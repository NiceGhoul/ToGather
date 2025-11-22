import { Label } from "@/Components/ui/label";
import { useState } from "react";

export const AboutDetails = ({contents}) => {
    const [description, setDescription] = useState(contents)
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
                <div className="flex h-[480px] w-full justify-center items-center text-gray-300 italic">
                    <Label className={"text-base font-extralight italic text-gray-300"}>
                        There are no description for the selected campaign!
                    </Label>
                </div>
            )}
        </div>
    );
};
