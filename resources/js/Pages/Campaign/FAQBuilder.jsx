import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Edit, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Toaster } from "@/Components/ui/sonner";
import Popup from "@/Components/Popup";

export const FaqBuilder = ({ campaign, contents }) => {
    const [userQuestions, setUserQuestions] = useState(
        contents.map((dat) => {
            const [question, answer] = dat.content.split("~;");
            return {
                ...dat,
                question: question || "",
                answer: answer || "",
                isEditing: false,
            };
        })
    );
    const [openItem, setOpenItem] = useState(null);
    const [prevUserQuestions, setPrevUserQuestions]= useState(contents)

    useEffect(() => {
        const editingIndex = userQuestions.findIndex((q) => q.isEditing);
        if (editingIndex !== -1) {
            setOpenItem(`item-${editingIndex}`);
        }
    }, [userQuestions]);

    const handleDelete = (itemToDelete, idx) => {
        setUserQuestions((prev) => prev.filter((_, i) => i !== idx));

        if (contents?.some((c) => c.id === itemToDelete.id)) {
            router.post(`/campaigns/deleteContent/${id}`);
        }
    };

    const handleChange = (index, field, value) => {
        setUserQuestions((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleAddQuestions = () => {
        setUserQuestions((prev) => [
            ...prev,
            {
                id: null,
                campaign_id: campaign.id,
                question: "",
                answer: "",
                isEditing: false,
            },
        ]);
    };

    const toggleEdit = (index) => {
        setUserQuestions((prev) =>
            prev.map((block, i) =>
                i === index ? { ...block, isEditing: !block.isEditing } : block
            )
        );
    };

    const handleSave = () => {
        if (userQuestions.map((item) => item.question.trim() === "").includes(true)) {
            toast.error("Unable to save changes", {
                duration: 2500,
                style: {
                    "--normal-bg":
                        "light-dark(var(--color-amber-600), var(--color-amber-600))",
                    "--normal-text": "var(--color-white)",
                    "--normal-border":
                        "light-dark(var(--color-amber-600), var(--color-amber-600))",
                },
                description: (
                    <div className="text-white text-md">
                        empty Questions is not allowed! please check your Questions before saving.
                    </div>
                ),
            });
            return;
        }

        // turn off editing mode for all items and close accordion
        const normalized = userQuestions.map((item) => ({
            ...item,
            isEditing: false,
        }));
        setUserQuestions(normalized);
        setOpenItem(null);

        const data = normalized.map((_, idx) => ({
            id: normalized[idx].id,
            campaign_id: campaign.id,
            type: "faqs",
            content: normalized[idx].question + "~;" + normalized[idx].answer,
            order_y: idx + 1,
        }));

        router.post("/campaigns/insertFAQ", data);
    };

    const handleRemove = (id, index) => {
        // remove dari state langsung
        setUserQuestions((prev) => prev.filter((_, i) => i !== index));

        if (id != undefined) {
            router.post(`/campaigns/deleteContent/${id}`);
        }
    };

    return (
        <div className="flex justify-center items-center flex-col gap-45 h-full">
            <Label className="text-3xl justify-center items-center font-bold text-[#7C4789] dark:text-[#9A5CAA]">
                Frequently Asked Questions
            </Label>
            <div className="w-full h-full items-center justify-center flex">
                {userQuestions.length === 0 ? (
                    <div className="flex flex-col gap-8">
                        <Label className="text-lg font-extralight italic text-gray-300 dark:text-white">
                            There are no FAQ available
                        </Label>
                    </div>
                ) : (
                    <div className="w-[60%] justify-center items-center">
                        {userQuestions.map((dat, idx) => (
                            <div
                                key={idx + 1}
                                className="flex items-center gap-2"
                            >
                                <Accordion
                                    type="single"
                                    collapsible={dat.isEditing ? false : true}
                                    className="w-full"
                                    onValueChange={(val) => {
                                        const currentIndex =
                                            userQuestions.findIndex(
                                                (q) =>
                                                    `item-${q.id - 1}` ===
                                                    openItem
                                            );
                                        const isEditing =
                                            userQuestions[currentIndex]
                                                ?.isEditing;
                                        if (!isEditing)
                                            setOpenItem(val || null);
                                    }}
                                >
                                    <AccordionItem
                                        key={dat.id}
                                        value={`item-${idx}`}
                                    >
                                        <AccordionTrigger className="flex justify-between items-center">
                                            {/* if is editing */}
                                            {dat.isEditing ? (
                                                <Input
                                                    onKeyDownCapture={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onKeyUpCapture={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onKeyPressCapture={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.code === "Space")
                                                            e.nativeEvent.stopImmediatePropagation();
                                                    }}
                                                    value={dat.question}
                                                    placeholder={
                                                        "Write your Question on this text box"
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            idx,
                                                            "question",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-[80%]"
                                                />
                                            ) : (
                                                <span className="text-xl font-semibold">
                                                    {dat.question != ""
                                                        ? dat.question
                                                        : "Edit Your Question"}
                                                </span>
                                            )}
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            {dat.isEditing ? (
                                                <Textarea
                                                    value={dat.answer}
                                                    onKeyDown={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onKeyDownCapture={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onKeyUpCapture={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            idx,
                                                            "answer",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full mt-2 dark:text-gray-200"
                                                    placeholder={
                                                        "Write your answer here"
                                                    }
                                                    rows={3}
                                                />
                                            ) : (
                                                <p className="mt-2 text-gray-700 dark:text-gray-200 text-base">
                                                    {dat.answer != ""
                                                        ? dat.answer
                                                        : "Edit your Answer"}
                                                </p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <div className="flex gap-2">
                                    {dat.isEditing ? (
                                        <Button
                                            className="p-0 w-12 h-12 cursor-pointer rounded-md bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                        >
                                            <Save />
                                        </Button>
                                    ) : (
                                        <Button
                                            className="p-0 w-12 h-12 cursor-pointer rounded-md bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                        >
                                            <Edit />
                                        </Button>
                                    )}
                                    <Popup
                                        triggerText={
                                            <Trash className="w-4 h-4" />
                                        }
                                        title="Delete FAQ?"
                                        description="This action cannot be undone, FAQ will be deleted permanently."
                                        confirmText="Yes, Delete"
                                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                        triggerClass="p-0 w-12 h-12 cursor-pointer rounded-md bg-red-300 hover:bg-red-400 text-red-700 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white transition-colors"
                                        onConfirm={() =>
                                            handleRemove(dat.id, idx)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-5">
                <Button
                    variant={"outline"}
                    onClick={handleAddQuestions}
                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                >
                    + Add Questions and answers
                </Button>
                {contents.length != userQuestions.length && (
                    <Button
                        onClick={handleSave}
                        className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                    >
                        Save Changes
                    </Button>
                )}
            </div>
            <Toaster
                className="text-xl"
                toastOptions={{ duration: 1500 }}
                position="top-center"
            />
        </div>
    );
};
