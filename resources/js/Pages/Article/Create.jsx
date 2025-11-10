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

export default function Create() {
    const thumbInputRef = useRef(null);
    const { categories } = usePage().props;
    const { data, setData, processing } = useForm({
        title: "",
        category: "",
        thumbnail: null,
        contents: [],
    });

    const [blocks, setBlocks] = useState([
        { type: "text", content: "", order_x: 1, order_y: 1 },
    ]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showTitleError, setShowTitleError] = useState(false);
    const [showCategoryError, setShowCategoryError] = useState(false);

    // 🟣 Thumbnail Preview
    const [thumbPreview, setThumbPreview] = useState(null);
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("thumbnail", file);
            setThumbPreview(URL.createObjectURL(file));
        }
    };

    // 🟣 Grid Handlers
    const removeBlock = (index) => {
        const updated = [...blocks];
        updated.splice(index, 1);
        setBlocks(updated);
    };

    const updateBlockContent = (index, newContent) => {
        const updated = [...blocks];
        updated[index].content = newContent;
        setBlocks(updated);
    };

    const addBlockAt = (order_x, order_y, type) => {
        if (blocks.some((b) => b.order_x === order_x && b.order_y === order_y))
            return;
        setBlocks([...blocks, { type, content: "", order_x, order_y }]);
    };

    // 🟣 Image Change Handler
    const handleImageChange = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
            const updated = [...blocks];
            updated[idx].content = file;
            setBlocks(updated);
        }
    };

    // 🟣 Submit
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
        // Prevent multiple submissions
        if (processing) return;

        setShowConfirm(false);
        const payload = { ...data, contents: blocks };
        router.post("/articles", payload, {
            forceFormData: true,
            onSuccess: () => {
                setShowSuccess(true);
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
            onError: (err) => {
                console.error(err);
                setShowConfirm(false);
                alert("Failed Creating Article. Try Again");
            },
        });
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* LEFT: FORM */}
                <Card className="w-full my-5">
                    <CardHeader>
                        <CardTitle>Create New Article</CardTitle>
                        <CardDescription>
                            Freely add and arrange content in the grid below for
                            your article.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* TITLE */}
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
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
                                <Label htmlFor="thumbnail">
                                    Thumbnail (auto-scaled)
                                </Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    ref={thumbInputRef}
                                    onChange={handleThumbnailChange}
                                />
                                {thumbPreview && (
                                    <div className="w-full max-w-md mt-3 rounded-lg overflow-hidden border mx-auto bg-white flex justify-center">
                                        <img
                                            src={thumbPreview}
                                            alt="Thumbnail Preview"
                                            className="max-h-[300px] object-contain rounded-md"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* CONTENT GRID */}
                            <div className="space-y-4">
                                <Label className="font-medium text-lg">
                                    Article's Content
                                </Label>
                                {(() => {
                                    const maxRow = Math.max(
                                        1,
                                        ...blocks.map((b) => b.order_y)
                                    );
                                    const maxCol = Math.max(
                                        2,
                                        ...blocks.map((b) => b.order_x)
                                    );
                                    const displayRows = maxRow + 1;
                                    const cells = [];
                                    for (let r = 1; r <= displayRows; r++) {
                                        for (let c = 1; c <= maxCol; c++) {
                                            cells.push({
                                                order_x: c,
                                                order_y: r,
                                            });
                                        }
                                    }
                                    return (
                                        <div
                                            className="grid gap-4"
                                            style={{
                                                gridTemplateColumns: `repeat(${maxCol}, minmax(0,1fr))`,
                                            }}
                                        >
                                            {cells.map((cell) => {
                                                const idx = blocks.findIndex(
                                                    (b) =>
                                                        b.order_x ===
                                                            cell.order_x &&
                                                        b.order_y ===
                                                            cell.order_y
                                                );
                                                const block =
                                                    idx !== -1
                                                        ? blocks[idx]
                                                        : null;
                                                return (
                                                    <div
                                                        key={`${cell.order_y}-${cell.order_x}`}
                                                        className="border rounded-lg p-3 bg-gray-50 relative shadow-sm min-h-[160px]"
                                                    >
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            Grid ({cell.order_x}
                                                            ,{cell.order_y}) –{" "}
                                                            {block
                                                                ? block.type ===
                                                                  "text"
                                                                    ? "Text"
                                                                    : "Image"
                                                                : "Empty"}
                                                        </p>

                                                        {block ? (
                                                            block.type ===
                                                            "text" ? (
                                                                <textarea
                                                                    className="w-full border rounded p-2 mt-1 h-40 resize-y"
                                                                    value={
                                                                        block.content
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateBlockContent(
                                                                            idx,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Write text..."
                                                                />
                                                            ) : (
                                                                <>
                                                                    <Input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleImageChange(
                                                                                idx,
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                    {block.content && (
                                                                        <div className="w-full mt-3 flex justify-center bg-white border rounded-md p-2">
                                                                            <img
                                                                                src={URL.createObjectURL(
                                                                                    block.content
                                                                                )}
                                                                                alt="preview"
                                                                                className="max-h-[250px] object-contain rounded-md"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )
                                                        ) : (
                                                            <div className="mt-2 flex gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        addBlockAt(
                                                                            cell.order_x,
                                                                            cell.order_y,
                                                                            "text"
                                                                        )
                                                                    }
                                                                >
                                                                    <CaseSensitive className="text-size-sm" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        addBlockAt(
                                                                            cell.order_x,
                                                                            cell.order_y,
                                                                            "image"
                                                                        )
                                                                    }
                                                                >
                                                                    <Image />
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {block &&
                                                            !(
                                                                block.order_x ===
                                                                    1 &&
                                                                block.order_y ===
                                                                    1
                                                            ) && (
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="absolute top-2 right-2"
                                                                    onClick={() =>
                                                                        removeBlock(
                                                                            idx
                                                                        )
                                                                    }
                                                                >
                                                                    ✕
                                                                </Button>
                                                            )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="buttonContainer flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Saving..."
                                        : "Submit Article"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* RIGHT: LIVE PREVIEW */}
                <Card className="w-full sticky top-20 h-fit">
                    <CardHeader>
                        <CardTitle>Live Preview</CardTitle>
                        <CardDescription>
                            How your article will appear
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Thumbnail */}
                        <div className="mb-4 flex justify-center">
                            {thumbPreview ? (
                                <div className="w-full max-w-4xl">
                                    <img
                                        src={thumbPreview}
                                        alt="Thumbnail Preview"
                                        className="w-full h-64 object-cover mb-4 rounded"
                                    />
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl h-64 rounded bg-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                                    Thumbnail Preview
                                </div>
                            )}
                        </div>

                        {/* Title + Info */}
                        <h3 className="text-2xl font-bold mb-1">
                            {data.title || "Article Title"}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            by Unknown · {new Date().toLocaleDateString()}
                        </p>

                        {/* Content Preview */}
                        {(() => {
                            const maxRow = Math.max(
                                1,
                                ...blocks.map((b) => b.order_y)
                            );
                            const maxCol = Math.max(
                                1,
                                ...blocks.map((b) => b.order_x)
                            );
                            const cells = [];

                            for (let y = 1; y <= maxRow; y++) {
                                for (let x = 1; x <= maxCol; x++) {
                                    const block = blocks.find(
                                        (b) =>
                                            b.order_x === x && b.order_y === y
                                    );
                                    cells.push({ x, y, block });
                                }
                            }

                            return (
                                <div
                                    className="grid gap-4"
                                    style={{
                                        gridTemplateColumns: `repeat(${maxCol}, minmax(0,1fr))`,
                                    }}
                                >
                                    {cells.map(({ x, y, block }, i) => (
                                        <div
                                            key={`${y}-${x}`}
                                            className="rounded flex flex-col"
                                        >
                                            {block ? (
                                                block.type === "text" ? (
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                                                        {block.content ||
                                                            "Empty Text"}
                                                    </p>
                                                ) : (
                                                    block.content && (
                                                        <div className="w-full max-w-md mx-auto mt-2 rounded-lg overflow-hidden shadow-sm bg-white">
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    block.content
                                                                )}
                                                                alt={`Block ${
                                                                    i + 1
                                                                }`}
                                                                className="max-h-[300px] object-contain rounded-md"
                                                            />
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <div className="min-h-[100px] text-gray-400 text-sm">
                                                    Empty
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>

                {/* POPUPS */}
                {showConfirm && (
                    <Popup
                        triggerText={null}
                        title="Submit Article?"
                        description="Your article will be saved and reviewed by Admins."
                        confirmText={processing ? "Submitting..." : "Yes, Submit"}
                        cancelText="Cancel"
                        confirmColor="bg-green-600 hover:bg-green-700 text-white"
                        confirmDisabled={processing}
                        onConfirm={confirmSubmit}
                        onClose={() => setShowConfirm(false)}
                    />
                )}
                {showSuccess && (
                    <Popup
                        triggerText={null}
                        title="Article Submitted!"
                        description="Your article is pending review by Admins."
                        confirmText="Okay"
                        showCancel={false}
                        confirmColor="bg-green-600 hover:bg-green-700 text-white"
                        onConfirm={() => {
                            setShowSuccess(false);
                            router.get("/articles/list");
                        }}
                    />
                )}
                {showError && (
                    <Popup
                        triggerText={null}
                        title="Incomplete Form"
                        description="Please fill in the title and select a category before submitting."
                        confirmText="Okay"
                        showCancel={false}
                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                        onConfirm={() => setShowError(false)}
                    />
                )}
                {showTitleError && (
                    <Popup
                        triggerText={null}
                        title="Incomplete Form"
                        description="Please fill in the title before submitting."
                        confirmText="Okay"
                        showCancel={false}
                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                        onConfirm={() => setShowTitleError(false)}
                    />
                )}
                {showCategoryError && (
                    <Popup
                        triggerText={null}
                        title="Incomplete Form"
                        description="Please select a category before submitting."
                        confirmText="Okay"
                        showCancel={false}
                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                        onConfirm={() => setShowCategoryError(false)}
                    />
                )}
            </div>
        </Layout_User>
    );
}
