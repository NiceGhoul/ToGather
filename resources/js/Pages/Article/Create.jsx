import Layout_User from "@/Layouts/Layout_User";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JoditEditor from "jodit-react";
import { useForm, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function Create() {
    const { categories } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        content: "",
        category: "",
        thumbnail: null,
        attachment: null, // ⬅️ pakai nama ini konsisten dgn backend
    });

    const editor = useRef(null);
    const [tab, setTab] = useState("manual"); // "manual" | "upload"
    const [content, setContent] = useState("");

    const handleThumbnailChange = (e) => {
        setData("thumbnail", e.target.files[0]);
    };

    const handleAttachmentChange = (e) => {
        setData("attachment", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData("content", content || "");

        post("/articles", {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setContent("");
            },
        });
    };

    const config = {
        readonly: false,
        height: 400,
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create New Article</CardTitle>
                        <CardDescription>
                            Choose how you want to submit your article
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Tabs */}
                        <div className="flex border-b mb-4">
                            <button
                                type="button"
                                className={`px-4 py-2 font-medium ${
                                    tab === "manual"
                                        ? "border-b-2 border-purple-600 text-purple-700"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setTab("manual")}
                            >
                                ✏️ Write Manually
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 font-medium ${
                                    tab === "upload"
                                        ? "border-b-2 border-purple-600 text-purple-700"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setTab("upload")}
                            >
                                📄 Upload File
                            </button>
                        </div>

                        {/* Tab 1: Manual Write */}
                        {tab === "manual" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Select Category --
                                        </option>
                                        {categories?.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                <div>
                                    <Label htmlFor="thumbnail">Thumbnail</Label>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                    {errors.thumbnail && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.thumbnail}
                                        </p>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <Label htmlFor="content">Content</Label>
                                    <JoditEditor
                                        ref={editor}
                                        value={content}
                                        config={config}
                                        tabIndex={1}
                                        onBlur={(newContent) =>
                                            setContent(newContent)
                                        }
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.content}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Publishing..."
                                        : "Publish Article"}
                                </Button>
                            </form>
                        )}

                        {/* Tab 2: Upload File */}
                        {tab === "upload" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Select Category --
                                        </option>
                                        {categories?.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="thumbnail">Thumbnail</Label>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                    {errors.thumbnail && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.thumbnail}
                                        </p>
                                    )}
                                </div>

                                {/* Upload Attachment */}
                                <div>
                                    <Label htmlFor="attachment">
                                        Upload File
                                    </Label>
                                    <Input
                                        id="attachment"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleAttachmentChange}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Only PDF or Word (.docx) files allowed
                                    </p>
                                    {errors.attachment && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.attachment}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Uploading..."
                                        : "Upload File"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout_User>
    );
}
