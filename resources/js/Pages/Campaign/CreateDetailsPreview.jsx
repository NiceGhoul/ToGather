import Popup from "@/Components/Popup";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {Card,CardAction,CardContent,CardDescription,CardHeader,CardTitle} from "@/Components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/Components/ui/carousel";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/Components/ui/empty";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Textarea } from "@/Components/ui/textarea";
import { Toggle } from "@/Components/ui/toggle";
import Layout_User from "@/Layouts/Layout_User";
import { router, usePage } from "@inertiajs/react";
import { IconFolderCode } from "@tabler/icons-react";
import { Edit, Heart, Save, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

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

export const DescriptionBuilder = ({campaign, insertHandler}) => {
    console.log(campaign)
    const [description, setDescription] = useState([{campaign_id: campaign.id, type: "paragraph", content: "Our Story~;" + campaign.description ?? "", isEditing:false}])

    const addParagraphBlock = () => {
        setDescription((prev) => [...prev, {campaign_id: campaign.id,  type: "paragraph", content: "", isEditing: true }]);
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

export const FaqBuilder = ({campaign , insertHandler}) => {
const [userQuestions, setUserQuestions] = useState([])
const [openItem, setOpenItem] = useState(null);

useEffect(() => {
  const editingIndex = userQuestions.findIndex((q) => q.isEditing);
  if (editingIndex !== -1) {
    setOpenItem(`item-${editingIndex}`);
  }
}, [userQuestions]);

const handleDelete = (idx) => {
    setUserQuestions((dat) => dat.filter((_, i) => i != idx))
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
                campaign_id: campaign.id,
                question: "Write Questions here",
                answer: "Write your answer on this text box",
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

    const handleSave = (idx) => {
        router.post('', {campaign_id: campaign.id, type: "FAQ", content: userQuestions[idx].question + "~;" + userQuestions[idx].answer})
    }

    return (
        <div className="flex justify-center items-center flex-col gap-45 h-full">
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
                        {userQuestions.map((dat, idx) => (
                            <div
                                key={dat.id}
                                className="flex items-center gap-2"
                            >
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full "
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
                                                <span className="text-xl font-semibold">
                                                    {dat.question}
                                                </span>
                                            )}
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
                                                <p className="mt-2 text-gray-700 text-base">
                                                    {dat.answer}
                                                </p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <div className="flex gap-2">
                                    {dat.isEditing ? (
                                        <Save
                                            size={30}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                            className="cursor-pointer rounded-md p-1 hover:bg-gray-200 text-blue-600 transition-colors"
                                        />
                                    ) : (
                                        <Edit
                                            size={30}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEdit(idx);
                                            }}
                                            className="cursor-pointer rounded-md p-1 hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                                        />
                                    )}

                                    <Trash
                                        size={30}
                                        onClick={() => handleDelete(idx)}
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

            <Button
                onClick={handleSave}
                >
                Save Changes
            </Button>
                </div>
        </div>
    );
}

export const UpdateBuilder = ({ campaign , insertHandler }) => {
    const [editMode, setEditMode] = useState(false)
    const [updates, setUpdates] = useState([
        {
            id: 1,
            tabs:'updates',
            date: "17-08-2025",
            content:
                "Final Project Update~;The Questions shown in this page, as well as the answers will be set by the user themselves on the Campaign Edit Page. Up to 5 Questions can be put at the FAQ Section.\n\nAenean ullamcorper venenatis mauris, id semper urna consectetur quis. Nulla luctus justo non magna semper elementum. Maecenas rutrum nunc ac ultrices imperdiet.",
            media: [],
        },
        {
            id: 2,
            tabs:'updates',
            date: "01-07-2025",
            content: "Monthly Update #4~;Some progress notes and images for July...",
            media: [],
        },
    ]);

    const [selectedUpdate, setSelectedUpdate] = useState(updates[0]);



    const handleAddUpdate = () => {
        const date = new Date()
        setUpdates((prev) => ([...prev, {id: updates.length + 1,campaign_id:campaign.id, tabs:'updates', date:date.toLocaleDateString().replaceAll("/", "-"), content:"new update~;"}]))
    }
const [formData, setFormData] = useState({
        tabs: selectedUpdate?.tabs || "",
        content: selectedUpdate?.content || "",
        media: selectedUpdate?.media || [],
    });
     const handleSaveUpdate = () => {
         const updatedList = updates.map((upd) =>
             upd.id === selectedUpdate.id
                 ? {
                       ...upd,
                       content: `${formData.title}~;${formData.content}`,
                       media: formData.media,
                   }
                 : upd
         );
         setUpdates(updatedList);
         setSelectedUpdate({
             ...selectedUpdate,
             content: `${formData.title}~;${formData.content}`,
             media: formData.media,
         });
         setEditMode(false);
         console.log(updatedList)
     };

     const handleMediaChange = (e) => {
         const files = Array.from(e.target.files);
         const previews = files.map((file) => ({
             type: file.type.startsWith("image/") ? "image" : "video",
             url: URL.createObjectURL(file),
             file,
         }));
         setFormData({ ...formData, media: previews });
     };


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
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="text-2xl font-bold text-[#7C4789]"
                                    />
                                ) : (
                                    <Label className="text-2xl font-bold text-[#7C4789]">
                                        {selectedUpdate.content.split("~;")[0]}
                                    </Label>
                                )}

                                <p className="text-left text-base text-gray-400 my-2">
                                    {selectedUpdate.date}
                                </p>

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
                                                            {m.type ===
                                                            "image" ? (
                                                                <img
                                                                    src={m.url}
                                                                    alt={`Media ${
                                                                        idx + 1
                                                                    }`}
                                                                    className="rounded-lg min-w-[100%] max-h-[600px] object-contain"
                                                                />
                                                            ) : m.type ===
                                                              "video" ? (
                                                                <video
                                                                    controls
                                                                    className="rounded-lg w-full min-h-[400px] object-contain"
                                                                >
                                                                    <source
                                                                        src={
                                                                            m.url
                                                                        }
                                                                        type="video/mp4"
                                                                    />
                                                                </video>
                                                            ) : null}
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
                                            {formData.media.map((m, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative"
                                                >
                                                    {m.type === "image" ? (
                                                        <img
                                                            src={m.url}
                                                            alt=""
                                                            className="rounded-lg object-cover h-24 w-full"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={m.url}
                                                            className="rounded-lg h-24 w-full object-cover"
                                                            muted
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <Label className="text-sm text-gray-500">
                                            Upload images/videos:
                                        </Label>
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            onChange={handleMediaChange}
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                {editMode ? (
                                    <Textarea
                                        rows={8}
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
                                                className="bg-[#7C4789] text-white"
                                                onClick={handleSaveUpdate}
                                            >
                                                Save
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="border-[#7C4789] text-[#7C4789]"
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
                    <div className="w-[280px] bg-purple-100 rounded-2xl p-4 flex flex-col gap-3 h-fit">
                        {updates.map((upd) => (
                            <Card
                                key={upd.id}
                                className={`cursor-pointer p-3 rounded-xl transition-all ${
                                    selectedUpdate?.id === upd.id
                                        ? "bg-[#7C4789] text-white"
                                        : "hover:bg-[#7C4789]/10"
                                }`}
                                onClick={() => setSelectedUpdate(upd)}
                            >
                                <CardContent className="flex items-center flex-col p-0">
                                    <Label
                                        className={`font-bold text-base ${
                                            selectedUpdate?.id === upd.id
                                                ? "text-white"
                                                : "text-[#7C4789]"
                                        }`}
                                    >
                                        {upd.content.split("~;")[0]}
                                    </Label>
                                    <p
                                        className={`text-sm mt-1 ${
                                            selectedUpdate?.id === upd.id
                                                ? "text-gray-100"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {upd.date}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        <Button
                            variant={"outline"}
                            className="text-light"
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


const CreateDetailsPreview = () => {

    const data = ["About", "FAQ", "Updates", "Donations"];
    const { campaign, user } = usePage().props
    const [images, setImages] = useState({thumbnail: null, logo: null})
    const [openPopUp, setOpenPopUp] = useState(false)
    const [popUpData, setPopupData] = useState({ title:"", description: "", confText: "", confColor:""})

    const handleBack = () => {
          router.get(`/campaigns/create/createPreview/${campaign.id}`);
    };

    const handleInsertContent = (campaignContent) => {
        router.post(`/campaigns/insertContent`, campaignContent)
    }

    const contentDivider = (data) => {
        if (data === "About") {
            return (
                <div className="flex flex-col gap-8 px-8 py-4 text-left min-h-[500px]">
                    <DescriptionBuilder campaign={campaign} insertHandler={handleInsertContent} />
                </div>
            );
        } else if (data === "FAQ") {
            return (
                // has a dropdown box
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <FaqBuilder campaign={campaign} insertHandler={handleInsertContent} />

                </div>
            );
        } else if (data === "Updates") {
            return (
                // navigation bar on the side, with the updates on the inside  (make new table in xampp)
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <UpdateBuilder campaign={campaign} insertHandler={handleInsertContent} />
                </div>
            );
        } else if (data === "Donations") {
            return (
                // get all of the donation this project has received
                <div className="flex flex-col gap-8 px-8 py-4 text-center min-h-[500px]">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconFolderCode  />
                            </EmptyMedia>
                            <EmptyTitle>This is the donation page</EmptyTitle>
                            <EmptyDescription>Every donation this campaign obtained will be displayed here. You can see the total donation as well as the message left by donators!</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            {/* <Button>Add data</Button> */}
                        </EmptyContent>
                    </Empty>
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
            <Popup
                    open={openPopUp}
                    onClose={() => setOpenPopUp(false)}
                    triggerText={null}
                    title={popUpData.title}
                    description={popUpData.description}
                    confirmText={popUpData.confText}
                    cancelText="Cancel"
                    showCancel={popUpData.title === "Upload Error" ? false : true}
                    confirmColor={popUpData.confColor}
                    onConfirm={popUpData.title === "Upload Error" ? () => setOpenPopUp(false) : handleInsertContent}
                />
        </Layout_User>
    );
};

export default CreateDetailsPreview;
