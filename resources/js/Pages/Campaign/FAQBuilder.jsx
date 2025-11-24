import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Edit, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Alert, AlertTitle } from "@mui/material";
import { toast } from "sonner";
import { Toaster } from "@/Components/ui/sonner";


export const FaqBuilder = ({campaign, contents}) => {
const [userQuestions, setUserQuestions] = useState(
    contents.map(dat => {
            const [question, answer] = dat.content.split("~;");
            return {
                ...dat,
                question: question || "",
                answer: answer || "",
                isEditing: false,
            };
        })
);
const [openItem, setOpenItem] = useState(null)

useEffect(() => {
  const editingIndex = userQuestions.findIndex((q) => q.isEditing);
  if (editingIndex !== -1) {
    setOpenItem(`item-${editingIndex}`);
  }
}, [userQuestions])

const handleDelete = (itemToDelete, idx) => {
    setUserQuestions((prev) => prev.filter((_, i) => i !== idx))

    if (contents?.some((c) => c.id === itemToDelete.id)) {
        router.post('/campaigns/deleteContent', { id: itemToDelete.id })
    }
}

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
                isEditing:false,
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
        if(userQuestions.length === 0){
            toast.error("there are empty descriptions!", {
                 description:
                     "please double check your description before submitting.",
             });
            return
        }
        const data = userQuestions.map((_, idx) => ({id:userQuestions[idx].id ,campaign_id: campaign.id, type:'faqs', content:userQuestions[idx].question + "~;" + userQuestions[idx].answer, order_y: idx + 1}))
        router.post('/campaigns/insertFAQ', data)
    }



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
                                                        // extra defense: prevent space from toggling
                                                        if (e.code === "Space")
                                                            e.nativeEvent.stopImmediatePropagation();
                                                    }}
                                                    value={dat.question}
                                                    // placeholder={"Write your answer on this text box"}
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
                                                    {dat.question}
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
                                                    rows={3}
                                                />
                                            ) : (
                                                <p className="mt-2 text-gray-700 dark:text-gray-200 text-base">
                                                    {dat.answer}
                                                </p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <div className="flex gap-2">
                                    {dat.isEditing ? (
                                        <Save
                                            size={35}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                            className="cursor-pointer rounded-md p-1 hover:bg-blue-200 text-blue-600 transition-colors"
                                        />
                                    ) : (
                                        <Edit
                                            size={35}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                            className="cursor-pointer rounded-md p-1 hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                                        />
                                    )}

                                    <Trash
                                        size={35}
                                        onClick={() => handleDelete(dat, idx)}
                                        className="cursor-pointer rounded-md p-1 hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
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
                    className="text-light"
                    onClick={handleAddQuestions}
                >
                    + Add Questions and answers
                </Button>
                {userQuestions.length > 0 && (
                    <Button onClick={handleSave}>Save Changes</Button>
                )}
            </div>
            <Toaster
                className="text-xl"
                toastOptions={{ duration: 1500 }}
                position="top-center"
            />
        </div>
    );
}
