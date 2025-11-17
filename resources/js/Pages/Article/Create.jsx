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
import { useForm, usePage, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import Popup from "@/Components/Popup";
import { CaseSensitive, Image } from "lucide-react";

// 🔥 QUILL VERSION
import MiniEditor from "@/Components/MiniEditor";

export default function Create() {
    const thumbInputRef = useRef(null);
    const { categories } = usePage().props;

    const { data, setData, processing } = useForm({
        title: "",
        category: "",
        thumbnail: null,
        contents: [],
    });

    // =====================================================
    //                 BLOCK STATE (1 column)
    // =====================================================
    const [blocks, setBlocks] = useState([
        { type: "text", content: "", order_x: 1, order_y: 1 },
    ]);

    // =====================================================
    //                    POPUP STATES
    // =====================================================
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showTitleError, setShowTitleError] = useState(false);
    const [showCategoryError, setShowCategoryError] = useState(false);

    // =====================================================
    //                     THUMBNAIL
    // =====================================================
    const [thumbPreview, setThumbPreview] = useState(null);
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("thumbnail", file);
            setThumbPreview(URL.createObjectURL(file));
        }
    };

    // =====================================================
    //                     BLOCK LOGIC
    // =====================================================
    const updateBlockContent = (index, newContent) => {
        const updated = [...blocks];
        updated[index].content = newContent;
        setBlocks(updated);
    };

    // ALWAYS add block below
    const addBlockAt = (order_x, order_y, type) => {
        const nextY = blocks.length + 1;
        setBlocks([
            ...blocks,
            { type, content: "", order_x: 1, order_y: nextY },
        ]);
    };

    const handleImageChange = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
            updateBlockContent(idx, file);
        }
    };

    const removeBlock = (index) => {
        if (index === 0) return; // first block always exist
        const updated = [...blocks];
        updated.splice(index, 1);
        setBlocks(updated);
    };

    // =====================================================
    //                      SUBMIT
    // =====================================================
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.title.trim() && !data.category) {
            setShowError(true);
            return;
        }
        if (!data.title.trim()) {
            setShowTitleError(true);
            return;
        }
        if (!data.category) {
            setShowCategoryError(true);
            return;
        }

        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        if (processing) return;

        setShowConfirm(false);

        const payload = { ...data, contents: blocks };

        router.post("/articles", payload, {
            forceFormData: true,
            onSuccess: () => {
                setShowSuccess(true);

                // reset
                setData({
                    title: "",
                    category: "",
                    thumbnail: null,
                    contents: [],
                });

                setBlocks([
                    { type: "text", content: "", order_x: 1, order_y: 1 },
                ]);

                setThumbPreview(null);
                if (thumbInputRef.current) thumbInputRef.current.value = null;
            },
        });
    };

    // =====================================================
    //                     UI STARTS HERE
    // =====================================================
    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* FORM */}
                <Card className="w-full my-5">
                    <CardHeader>
                        <CardTitle>Create New Article</CardTitle>
                        <CardDescription>
                            Add content blocks vertically (1 column).
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* TITLE */}
                            <div>
                                <Label className="mb-1 dark:text-white">Title</Label>
                                <Input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <Label className="mb-1 dark:text-white">Category</Label>
                                <select
                                    className="border rounded px-3 py-2 w-full"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                >
                                    <option value="">Choose Category</option>
                                    {categories.map((cat, i) => (
                                        <option key={i} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* THUMBNAIL */}
                            <div>
                                <Label className="mb-1 dark:text-white">Thumbnail</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    ref={thumbInputRef}
                                    onChange={handleThumbnailChange}
                                />

                                {thumbPreview && (
                                    <div className="w-full max-w-md mt-3 rounded-lg overflow-hidden border mx-auto bg-white flex justify-center">
                                        <img
                                            src={thumbPreview}
                                            className="max-h-[300px] object-contain rounded-md"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ================================================= */}
                            {/*                 BLOCK LIST (1 COLUMN)            */}
                            {/* ================================================= */}
                            <div className="space-y-5">
                                {blocks.map((block, idx) => (
                                    <div
                                        key={idx}
                                        className="border rounded-lg p-3 bg-gray-50 relative shadow-sm"
                                    >
                                        <p className="text-xs text-gray-500 mb-2">
                                            Block {idx + 1} – {block.type}
                                        </p>

                                        {block.type === "text" ? (
                                            <MiniEditor
                                                value={block.content}
                                                onChange={(html) =>
                                                    updateBlockContent(
                                                        idx,
                                                        html
                                                    )
                                                }
                                            />
                                        ) : (
                                            <>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        handleImageChange(
                                                            idx,
                                                            e
                                                        )
                                                    }
                                                />
                                                {block.content && (
                                                    <div className="mt-3 bg-white border rounded-md p-2 flex justify-center">
                                                        <img
                                                            src={URL.createObjectURL(
                                                                block.content
                                                            )}
                                                            className="max-h-[250px] object-contain rounded-md"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {idx !== 0 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeBlock(idx)}
                                            >
                                                ✕
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                {/* ADD NEW BLOCK */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() =>
                                            addBlockAt(1, 999, "text")
                                        }
                                    >
                                        <CaseSensitive className="mr-1" />
                                        Add Text Block
                                    </Button>

                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() =>
                                            addBlockAt(1, 999, "image")
                                        }
                                    >
                                        <Image className="mr-1" />
                                        Add Image Block
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Saving..."
                                        : "Submit Article"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* ================================================= */}
                {/*                     LIVE PREVIEW                */}
                {/* ================================================= */}
                <Card className="w-full sticky top-20 h-fit">
                    <CardHeader>
                        <CardTitle>Live Preview</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {/* Thumbnail */}
                        <div className="mb-4 flex justify-center">
                            {thumbPreview ? (
                                <img
                                    src={thumbPreview}
                                    className="w-full max-w-4xl h-64 object-cover rounded"
                                />
                            ) : (
                                <div className="w-full max-w-4xl h-64 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                    Thumbnail Preview
                                </div>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold mb-1">
                            {data.title || "Article Title"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 dark:text-white">
                            by Unknown · {new Date().toLocaleDateString()}
                        </p>

                        {/* PREVIEW BLOCKS */}
                        <div className="space-y-6 ">
                            {blocks.map((block, i) => (
                                <div key={i}>
                                    {block.type === "text" ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    block.content ||
                                                    "<i>Empty Text</i>",
                                            }}
                                            className="text-sm text-gray-800 dark:text-white"
                                        />
                                    ) : (
                                        block.content && (
                                            <img
                                                src={URL.createObjectURL(
                                                    block.content
                                                )}
                                                className="max-h-[300px] object-contain rounded"
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* POPUPS */}
                {showConfirm && (
                    <Popup
                        title="Submit Article?"
                        confirmText="Yes, Submit"
                        cancelText="Cancel"
                        onConfirm={confirmSubmit}
                        onClose={() => setShowConfirm(false)}
                    />
                )}

                {showSuccess && (
                    <Popup
                        title="Article Submitted!"
                        confirmText="Okay"
                        showCancel={false}
                        onConfirm={() => {
                            setShowSuccess(false);
                            router.get("/articles/list");
                        }}
                    />
                )}

                {showError && (
                    <Popup
                        title="Error"
                        description="Please fill title & category"
                        confirmText="OK"
                        showCancel={false}
                        onConfirm={() => setShowError(false)}
                    />
                )}

                {showTitleError && (
                    <Popup
                        title="Missing Title"
                        confirmText="OK"
                        showCancel={false}
                        onConfirm={() => setShowTitleError(false)}
                    />
                )}

                {showCategoryError && (
                    <Popup
                        title="Missing Category"
                        confirmText="OK"
                        showCancel={false}
                        onConfirm={() => setShowCategoryError(false)}
                    />
                )}
            </div>
        </Layout_User>
    );
}
