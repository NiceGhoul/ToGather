import Layout_User from "@/Layouts/Layout_User";
import { usePage, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Spinner } from "@/Components/ui/spinner";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState } from "react";

export default function Create() {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        id_photo: null,
        selfie_with_id: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitLoading(true)
        console.log("Form data:", data);

        if (!data.id_photo || !data.selfie_with_id) {
            console.log("Missing files");
            return;
        }

        post("/verification", {
            forceFormData: true,
            onSuccess: () => {
                console.log("Form submitted successfully");
                setIsSubmitLoading(false)
            },
            onError: (errors) => {
                console.log("Form errors:", errors);
                setIsSubmitLoading(false)
            },
        });
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 mt-40">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Account Verification</CardTitle>
                        <CardDescription>
                            Upload your documents to verify your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {flash?.message && (
                            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
                                {flash.message}
                            </div>
                        )}
                        {flash?.success && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {flash.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="id_photo">ID Photo</Label>
                                <Input
                                    id="id_photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData("id_photo", e.target.files[0])
                                    }
                                    required
                                />
                                {errors.id_photo && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.id_photo}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="selfie_with_id">
                                    Selfie with ID
                                </Label>
                                <Input
                                    id="selfie_with_id"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            "selfie_with_id",
                                            e.target.files[0]
                                        )
                                    }
                                    required
                                />
                                {errors.selfie_with_id && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.selfie_with_id}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitLoading}
                            >
                                {isSubmitLoading
                                    ? (
                                        <>
                                            <Spinner className="w-4 h-4" /> Submitting...
                                        </>
                                    )
                                    : "Submit Verification Request"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}
