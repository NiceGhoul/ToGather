import Popup from "@/Components/Popup";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {Card,CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
import Layout_User from "@/Layouts/Layout_User";
import { router, usePage } from "@inertiajs/react";
import { Map } from "lucide-react";
import { useState } from "react";

export const PreviewLayout = ({ user, campaign, images }) => {
    return (
        <div className="flex container px-4 py-4 flex-row gap-16 justify-center items-center mx-auto scale-90 border-2 rounded-xl border-gray-300">
            <div className="flex flex-col w-[600px] h-[400px]">
                <div className="flex flex-row w-[600px] h-[400px] overflow-hidden border border-gray-800 rounded items-center">
                    {images.thumbnail != null ? (
                        <img
                            src={images.thumbnailPreview}
                            at="thumbnail"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500 text-md w-full text-center italic">
                            No image available
                        </span>
                    )}
                </div>
                <div className="flex flex-row gap-2 my-5 justify-center items-center">
                    <Map />
                    <p className="w-full text-center">
                        {campaign.address}
                    </p>
                </div>
            </div>
            <div className="flex w-1/2 h-full overflow-hidden justify-center flex-col">
                <div className="flex overflow-hidden item-center justify-start gap-5 flex-row">
                    <Avatar className="w-20 h-20 border-2 border-gray-700">
                        <AvatarImage src={images.logoPreview} alt={campaign.title} />
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
                <div className="relative flex flex-col justify-end gap-2 mt-2">
                    <Progress
                        className="h-4 rounded-sm bg-[#d3bfe0] [&>div]:bg-[#7C4789]"
                        value={
                            (campaign.collected_amount / campaign.goal_amount) *
                            100
                        }
                    />
                    <span className="absolute inset-0 flex items-start justify-center text-sm font-medium text-black">
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
            </div>
        </div>
    );
};


export const UploadSupportingMedia = ({handler}) => {
    return (
        <div className="w-3/6 flex container flex-col gap-4 justify-center items-start mx-auto scale-90 mt-5">
            <Label className="text-xl">Upload Supporting Media</Label>

            <div className="flex container h-24 px-8 py-8 flex-row gap-4 justify-center items-center mx-auto border-2 rounded-xl border-gray-300">
                <div>
                    <Label htmlFor="picture" className="mb-1">Thumbnail</Label>
                    <Input id="picture" type="file" accept=".jpg,.jpeg,.png"  onChange={(e) => handler(e, "thumbnail")} />
                </div>

                <Separator orientation="vertical" className="bg-gray-500 mt-2"/>

                <div>
                    <Label htmlFor="logo" className="mb-1">Logo</Label>
                    <Input id="logo" type="file" accept=".jpg,.jpeg,.png"  onChange={(e) => handler(e, "logo")} />
                </div>
            </div>
        </div>
    )
}


const CreatePreview = () => {
    const { campaign, user } = usePage().props;
    const [images, setImages] = useState({thumbnail: null, logo: null, thumbnailPreview: null, logoPreview: null})
    const [openPopUp, setOpenPopUp] = useState(false)
    const [popUpData, setPopupData] = useState({ title:"", description: "", confText: "", confColor:""})

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImages((prev) => ({...prev, [type]: file, [`${type}Preview`]: previewUrl}))
        }
    };


    const handleNext = () => {
        // give error message
        if (images.logo === null || images.thumbnail === null) {
            setPopupData(({
                title: "Warning",
                description: "Thumbnail and logo must not be empty",
                confText: "okay",
                confColor: "bg-red-600 hover:bg-red-700 text-white",
            }));
            setOpenPopUp(true);
        } else {
            setPopupData(({
                title: "Save Media?",
                description: "save chosen media? you can change it later on",
                confText: "confirm",
                confColor: "bg-green-600 hover:bg-green-700 text-white",
            }));
            setOpenPopUp(true);
        }
    };

    const uploadErrorHandler = (errors) => {
    let fieldName = "";
    let errorMessage = "";

    if (errors.thumbnail) {
        fieldName = "thumbnail";
        errorMessage = errors.thumbnail;
    } else if (errors.logo) {
        fieldName = "logo";
        errorMessage = errors.logo;
    } else {
        errorMessage = "Unknown error occurred during upload.";
    }

    setPopupData({
        title: "Upload Error",
        description: `Error found when uploading ${fieldName ? fieldName : "file"}: ${errorMessage}`,
        confText: "Okay",
        confColor: "bg-red-600 hover:bg-red-700 text-white",
    });

    setOpenPopUp(true);
};

    const handleSave = () => {
        const formData = new FormData();
        if (campaign && images) {
            formData.append('thumbnail', images.thumbnail)
            formData.append('logo', images.logo)
            formData.append('campaign_id', campaign.id)

            router.post("/campaigns/upload-image", formData, {
                forceFormData: true,
                onError: (errors) => uploadErrorHandler(errors),
            });
        }
    };

    const handleBack = () => {
        router.get(`/campaigns/create/${campaign.id}`)
    }

    return (
        <Layout_User>
            <div>
                <Card>
                    <CardHeader className="flex flex-row">
                        <div className="justify-center items-center">
                            <Button
                                className="bg-transparent text-purple-700 hover:bg-purple-100 text-xl "
                                onClick={() => handleBack()}>
                                ← Back
                            </Button>
                        </div>
                        <div className="w-full justify-center items-center">
                            <CardTitle className="text-center text-3xl">
                                Media Preview
                            </CardTitle>
                            <CardDescription className="text-center text-sm">
                                Upload your thumbnail and logo, the preview will
                                show what your campaign details would looked
                                like.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <PreviewLayout
                                user={user}
                                campaign={campaign}
                                images={images}
                            />
                            <UploadSupportingMedia
                                handler={handleImageChange}
                            />
                        </div>
                        <div className="items-center text-center justify-center flex gap-5">
                            <Button className="mt-5 w-20" onClick={handleNext}>
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {openPopUp && (
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
                    onConfirm={popUpData.title === "Upload Error" ? () => setOpenPopUp(false) : handleSave}
                />
            )}
        </Layout_User>
    );
};

export default CreatePreview;
