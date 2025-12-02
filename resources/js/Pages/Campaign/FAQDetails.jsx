import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Label } from "@/Components/ui/label";
import { useEffect, useState } from "react";

export const FaqDetails = ({ contents }) => {
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

    useEffect(() => {
        const editingIndex = userQuestions.findIndex((q) => q.isEditing);
        if (editingIndex !== -1) {
            setOpenItem(`item-${editingIndex}`);
        }
    }, [userQuestions]);

    return (
        <div className="flex justify-center items-center flex-col gap-20 h-full">
            <Label className="text-2xl justify-center items-center font-bold text-[#7C4789] mt-10">
                Frequently Asked Questions
            </Label>
            <div className="w-full h-full items-center justify-center flex">
                {userQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[480px]">
                        <Label className="text-base font-extralight italic text-gray-300">
                            There are no FAQ available
                        </Label>
                    </div>
                ) : (
                    <div className="w-[60%] justify-center items-center">
                        {userQuestions.map((dat, idx) => (
                            <div
                                key={dat.id}
                                className="flex items-center gap-2"
                            >
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full "
                                    onValueChange={() => {
                                        userQuestions.findIndex(
                                            (q) =>
                                                `item-${q.id - 1}` === openItem
                                        );
                                    }}
                                >
                                    <AccordionItem
                                        key={dat.id}
                                        value={`item-${idx}`}
                                    >
                                        <AccordionTrigger className="flex justify-between items-center">
                                            <span className="text-xl font-semibold">
                                                {dat.question}
                                            </span>
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            <p className="mt-2 text-gray-700 text-base">
                                                {dat.answer}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                <p>
                    Have any questions? Send them{" "}
                    <a href="/profile" className="text-purple-500 underline">
                        Here!
                    </a>
                </p>
            </div>
        </div>
    );
};
