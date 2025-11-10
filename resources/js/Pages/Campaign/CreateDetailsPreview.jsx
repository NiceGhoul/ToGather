import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {Card,CardAction,CardContent,CardDescription,CardHeader,CardTitle} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Textarea } from "@/Components/ui/textarea";
import { Toggle } from "@/Components/ui/toggle";
import Layout_User from "@/Layouts/Layout_User";
import { router, usePage } from "@inertiajs/react";
import { Edit, Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export const UpperPreview = ({campaign, user, images}) => {
    const [like, setLike] = useState(false)
    return (
        <div className="flex container px-4 py-8 flex-row gap-16 justify-center items-center mx-auto">
            <div className="flex flex-row min-w-3/6 h-[400px] overflow-hidden border-1 rounded-md border-gray-800 shrink-0">
                <img
                    src={images.thumbnail}
                    alt="Campaign"
                    className="w-full h-full object-cover mb-4 rounded"
                />
            </div>

            <div className="flex min-w-3/6 h-full overflow-hidden justify-center flex-col">
                <div className="flex overflow-hidden item-center justify-start gap-5 flex-row">
                    <Avatar className="w-20 h-20 border-2 border-gray-700">
                        <AvatarImage src={images.logo} alt={campaign.title} />
                        <AvatarFallback>{campaign.title[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 justify-center">
                        <Label className="text-3xl text-start font-semibold">
                            {campaign.title}
                        </Label>
                        <Label className="text-md text-start font-medium">
                            {"Created by " + user.nickname}
                        </Label>
                    </div>
                </div>
                 <div className="flex flex-row justify-between">
                    <h1 className="text-2xl text-start font-semibold my-4 text-[#7C4789]">
                        0 Donator
                    </h1>

                    <h1 className="text-2xl text-end font-semibold my-4 text-[#7C4789]">
                        {campaign.duration + " Days left"}
                    </h1>
                </div>
                <div className="relative flex flex-col justify-end gap-4 mt-2">
                    <Progress
                        className="h-6 rounded-sm bg-[#d3bfe0] [&>div]:bg-[#7C4789]"
                        value={
                            (campaign.collected_amount / campaign.goal_amount) *
                            100
                        }
                    />
                    <span
                        className="absolute inset-0 flex items-start justify-center text-md font-medium "
                        style={{ color: "black" }}>
                        0%
                    </span>
                </div>
                <p className="text-lg font-normal flex justify-end mt-2">
                    {"Rp. " +
                        campaign.collected_amount +
                        ",00 / Rp. " +
                        parseInt(campaign.goal_amount).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}
                </p>
                <div className="flex flex-row items-center justify-between mt-5">
                    <Toggle
                        pressed={like}
                        onPressedChange={() => setLike(!like)}
                        size="lg"
                        variant="outline"
                        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                    >
                        <Heart />
                        {!like ? "like this campaign" : "campaign liked"}
                    </Toggle>

                    <Button className="min-h-10 min-w-48 font-semibold text-lg">
                        Donate
                    </Button>
                </div>
            </div>
        </div>
    );
}

export const DescriptionBuilder = ({campaign}) => {
    console.log(campaign)
    const [description, setDescription] = useState([{campaign_id: campaign.id, type: "paragraph", content: "Our Story~;" + campaign.description ?? "", isEditing:false}])

    const addParagraphBlock = () => {
        setDescription((prev) => [...prev, {campaign_id: campaign.id,  type: "paragraph", content: "New Section~;", isEditing: true }]);
    };

    const addMediaBlock = () => {
        setDescription((prev) => [...prev, {campaign_id: campaign.id, type: "media", content: "", isEditing: true }]);
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

     const handleRemove = (index) => {
         setDescription((prev) => prev.filter((_, i) => i !== index));
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
                    <Button onClick={addParagraphBlock}>
                        {" "}
                        + Add Paragraph{" "}
                    </Button>
                    <Button onClick={addMediaBlock}> + Add Image </Button>
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
                                            <p>
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
                                                src={URL.createObjectURL(
                                                    block.content ?? null
                                                )}
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
                                                    handleChange(index, file);
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
                    <Button> Save Changes </Button>
                </CardAction>
            ) : (
                <></>
            )}
        </Card>
    );
};

export const FaqBuilder = ({campaign}) => {

const [userQuestions, setUserQuestions] = useState([])
const [openItem, setOpenItem] = useState(null);

useEffect(() => {
  const editingIndex = userQuestions.findIndex((q) => q.isEditing);
  if (editingIndex !== -1) {
    setOpenItem(`item-${editingIndex}`);
  }
}, [userQuestions]);

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
                campaign_id: campaign.id,
                question: "New Question",
                answer: "New Answer",
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

    return (
        <div className="flex justify-center items-center flex-col gap-4 h-full">
            <Label className="text-3xl justify-center items-center font-bold text-[#7C4789]">
                Frequently Asked Questions
            </Label>
            <div className="w-full h-full items-center justify-center flex">
                {userQuestions.length === 0 ? (
                    <div className="flex flex-col gap-8">
                        <Label className="text-lg font-extralight italic text-gray-300">
                            There are no FAQ available
                        </Label>
                    </div>
                ) : (
                    <div className="w-[60%] justify-center items-center">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            onValueChange={(val) => {
                                const currentIndex = userQuestions.findIndex(
                                    (q) => `item-${q.id - 1}` === openItem
                                );
                                const isEditing =
                                    userQuestions[currentIndex]?.isEditing;
                                if (!isEditing) setOpenItem(val || null);
                            }}
                        >
                            {userQuestions.map((dat, idx) => (
                                <AccordionItem
                                    key={dat.id}
                                    value={`item-${idx}`}
                                >
                                    <AccordionTrigger className="flex justify-between items-center">
                                        {/* if is editing */}
                                        {dat.isEditing ? (
                                            <Input
                                                value={dat.question}
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
                                            <span>{dat.question}</span>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                        >
                                            {dat.isEditing ? "Save" : "Edit"}
                                        </Button>
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        {dat.isEditing ? (
                                            <Textarea
                                                value={dat.answer}
                                                onChange={(e) =>
                                                    handleChange(
                                                        idx,
                                                        "answer",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mt-2"
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="mt-2 text-gray-700">
                                                {dat.answer}
                                            </p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </div>
            <Button
                variant={"outline"}
                className="text-light"
                onClick={handleAddQuestions}
            >
                + Add Questions and answers
            </Button>
        </div>
    );
}
const CreateDetailsPreview = () => {

    const data = ["About", "FAQ", "Updates", "Donations"];
    const { campaign, user } = usePage().props
    const [images, setImages] = useState({thumbnail: null, logo: null})

    const handleBack = () => {
          router.get(`/campaigns/create/createPreview/${campaign.id}`);
    };

    const contentDivider = (data) => {
        if (data === "About") {
            return (
                <div className="flex flex-col gap-8 px-8 py-4 text-left h-[500px]">
                    <DescriptionBuilder campaign={campaign} />
                </div>
            );
        } else if (data === "FAQ") {
            return (
                // has a dropdown box
                <div className="flex flex-col gap-8 px-8 py-4 text-center h-[500px]">
                    <FaqBuilder campaign={campaign} />

                </div>
            );
        } else if (data === "Updates") {
            return (
                // navigation bar on the side, with the updates on the inside  (make new table in xampp)
                <div className="flex flex-col gap-8 px-8 py-4 text-center h-[500px]">
                    <p>{data}</p>
                </div>
            );
        } else if (data === "Donations") {
            return (
                // get all of the donation this project has received
                <div className="flex flex-col gap-8 px-8 py-4 text-center h-[500px]">
                    <p>{data}</p>
                </div>
            );
        }
    };

    const tabsRepeater = (data, index) => {
        return (
            <>
                <TabsTrigger
                    value={index + 1}
                    className="flex min-w-64 uppercase text-md font-bold rounded-none tracking-wide border-2 border-transparent data-[state=active]:text-white data-[state=active]:bg-[#7C4789] transition-colors duration-200"
                >
                    {data}
                </TabsTrigger>
            </>
        );
    };

    const tabsContentRepeater = (data, campaign, index) => {
        return (
            <TabsContent
                value={index + 1}
                className="w-[90%] h-[100%] text-lg text-center py-4"
            >
                {contentDivider(data, campaign)}
            </TabsContent>
        );
    };

    useEffect(() => {
        if (campaign && (images.thumbnail === null || images.logo === null)) {
            campaign.images.map((dat) => {
                dat.url.includes("thumbnail")
                    ? setImages((prev) => ({ ...prev, thumbnail: dat.url }))
                    : setImages((prev) => ({ ...prev, logo: dat.url }));
            });
        }
    }, [campaign]);

    return (
        <Layout_User>
            <Card>
                <CardHeader className="flex flex-row">
                    <div className="justify-center items-center">
                        <Button
                            className="bg-transparent text-purple-700 hover:bg-purple-100 text-xl "
                            onClick={() => handleBack()}
                        >
                            ← Back
                        </Button>
                    </div>
                    <div className="w-full justify-center items-center">
                        <CardTitle className="text-center text-3xl">
                            Edit Campaign Details
                        </CardTitle>
                        <CardDescription className="w-full text-center text-md justify-center flex items-center">
                            Edit everything about your products here! preview what your campaign details would looked like after prior to publishing!
                        </CardDescription>
                    </div>
                    <div className="justify-center items-center">
                        <Button
                            className="bg-transparent text-green-700 hover:bg-green-100 text-xl "
                            onClick={() => handleBack()}
                        >
                            Finalize →
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <UpperPreview campaign={campaign } user={user} images={images} />
                </CardContent>
            </Card>

            <div>
                <Tabs defaultValue={1} className="w-full mt-20">
                    {/* Tabs Header */}
                    <TabsList className="flex gap-40 bg-transparent border-b-2 border-gray-700 w-fit mx-auto rounded-none">
                        {data.map((dat, idx) => {
                            return tabsRepeater(dat, idx);
                        })}
                    </TabsList>
                    <div className="flex justify-center items-center gap-2 bg-transparent border-b border-gray-300 rounded-none">
                        {data.map((dat, idx) => {
                            return tabsContentRepeater(dat, campaign, idx);
                        })}
                    </div>
                </Tabs>
            </div>
        </Layout_User>
    );
};

export default CreateDetailsPreview;
