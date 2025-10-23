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
import { useState, useCallback, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";
import Popup from "@/Components/Popup";

const getCroppedImg = (imageSrc, cropPixels) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const { width, height, x, y } = cropPixels;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "cropped.jpg", {
                    type: "image/jpeg",
                });
                resolve(file);
            }, "image/jpeg");
        };
        image.onerror = (err) => reject(err);
    });

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

    // thumbnail cropper
    const [thumbCropFile, setThumbCropFile] = useState(null);
    const [thumbCrop, setThumbCrop] = useState({ x: 0, y: 0 });
    const [thumbZoom, setThumbZoom] = useState(1);
    const [thumbCroppedAreaPixels, setThumbCroppedAreaPixels] = useState(null);
    const [thumbPreview, setThumbPreview] = useState(null);
    const onThumbCropComplete = useCallback((_, croppedPixels) => {
        setThumbCroppedAreaPixels(croppedPixels);
    }, []);

    // image block cropper
    const [aspect, setAspect] = useState(16 / 9);
    const [cropFile, setCropFile] = useState(null);
    const [cropTargetIdx, setCropTargetIdx] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // thumbnail change
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) setThumbCropFile(file);
    };

    const handleThumbCropDone = async () => {
        if (!thumbCropFile || !thumbCroppedAreaPixels) return;
        const croppedFile = await getCroppedImg(
            URL.createObjectURL(thumbCropFile),
            thumbCroppedAreaPixels
        );
        setData("thumbnail", croppedFile);
        setThumbPreview(URL.createObjectURL(croppedFile));
        setThumbCropFile(null);
    };

    // grid handlers
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

    // submit
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
        const payload = { ...data, contents: blocks };
        router.post("/articles", payload, {
            forceFormData: true,
            onSuccess: () => {
                setShowConfirm(false);
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
                alert("Failed Creating Article. Try Again");
            },
        });
    };

    const handleCropDone = async () => {
        if (!cropFile || !croppedAreaPixels) return;
        const croppedFile = await getCroppedImg(
            URL.createObjectURL(cropFile),
            croppedAreaPixels
        );
        const updated = [...blocks];
        updated[cropTargetIdx].content = croppedFile;
        setBlocks(updated);
        setCropFile(null);
        setCropTargetIdx(null);
    };

    return (
        <Layout_User>
            <div className="container mx-auto px-4 py-8">
                {/* LEFT: CREATE FORM */}
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
                                    Thumbnail (16:9)
                                </Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    ref={thumbInputRef}
                                    onChange={handleThumbnailChange}
                                />
                                {thumbPreview && (
                                    <div className="w-full max-w-md aspect-video mt-3 rounded-lg overflow-hidden border mx-auto">
                                        <img
                                            src={thumbPreview}
                                            alt="Thumbnail Preview"
                                            className="w-full h-full object-cover"
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
                                                                        ) => {
                                                                            const file =
                                                                                e
                                                                                    .target
                                                                                    .files[0];
                                                                            if (
                                                                                file
                                                                            ) {
                                                                                setCropFile(
                                                                                    file
                                                                                );
                                                                                setCropTargetIdx(
                                                                                    idx
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    {block.content && (
                                                                        <img
                                                                            src={URL.createObjectURL(
                                                                                block.content
                                                                            )}
                                                                            alt="preview"
                                                                            className="w-full h-60 object-cover rounded-md mt-2"
                                                                        />
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
                                                                    ➕ Text
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        addBlockAt(
                                                                            cell.order_x,
                                                                            cell.order_y,
                                                                            "image"
                                                                        )
                                                                    }
                                                                >
                                                                    🖼️ Image
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

                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Submit Article"}
                            </Button>
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
                        <div className="mb-4">
                            {thumbPreview ? (
                                <div className="w-full max-w-2xl aspect-video mt-3 rounded-lg overflow-hidden border mx-auto">
                                    <img
                                        src={thumbPreview}
                                        alt="preview thumb"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full aspect-video rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
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

                        {/* Content Grid Preview */}
                        <div
                            className="grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${Math.max(
                                    1,
                                    ...blocks.map((b) => b.order_x)
                                )}, minmax(0,1fr))`,
                            }}
                        >
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
                                for (let r = 1; r <= maxRow; r++) {
                                    for (let c = 1; c <= maxCol; c++) {
                                        cells.push({
                                            order_x: c,
                                            order_y: r,
                                        });
                                    }
                                }

                                return cells.map((cell, i) => {
                                    const idx = blocks.findIndex(
                                        (b) =>
                                            b.order_x === cell.order_x &&
                                            b.order_y === cell.order_y
                                    );
                                    const block =
                                        idx !== -1 ? blocks[idx] : null;
                                    return (
                                        <div
                                            key={i}
                                            className=" rounded flex flex-col"
                                        >
                                            {block ? (
                                                block.type === "text" ? (
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                                                        {block.content ||
                                                            "Empty Text"}
                                                    </p>
                                                ) : (
                                                    <div className="w-full max-w-md mx-auto mt-2 rounded-lg overflow-hidden shadow-sm">
                                                        <img
                                                            src={
                                                                block.content instanceof
                                                                File
                                                                    ? URL.createObjectURL(
                                                                          block.content
                                                                      )
                                                                    : block.content
                                                            }
                                                            alt="grid image"
                                                            className="w-full aspect-video object-cover rounded-md transition-transform duration-200 hover:scale-[1.02]"
                                                        />
                                                    </div>
                                                )
                                            ) : (
                                                <p className="text-sm text-gray-400">
                                                    Empty
                                                </p>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </CardContent>
                </Card>

                {/* POPUPS + CROPPERS */}
                {showConfirm && (
                    <Popup
                        triggerText={null}
                        title="Submit Article?"
                        description="Your article will be saved and reviewed by Admins."
                        confirmText="Yes, Submit"
                        cancelText="Cancel"
                        confirmColor="bg-green-600 hover:bg-green-700 text-white"
                        onConfirm={confirmSubmit}
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
                        description="Please fill in the title  before submitting."
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

                {/* CROP MODALS */}
                {cropFile && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-[480px]">
                            <div className="flex flex-col items-center gap-4">
                                <Label className="font-medium">
                                    Crop Image
                                </Label>
                                <div className="w-[420px] h-[300px] relative bg-gray-900 rounded-md overflow-hidden">
                                    <Cropper
                                        image={URL.createObjectURL(cropFile)}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={aspect}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>
                                <div className="flex justify-between w-full mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setCropFile(null);
                                            setCropTargetIdx(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCropDone}>
                                        Crop
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {thumbCropFile && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-[520px]">
                            <div className="flex flex-col items-center gap-4">
                                <Label className="font-medium">
                                    Crop Thumbnail (16:9)
                                </Label>
                                <div className="w-[460px] h-[300px] relative bg-gray-900 rounded-md overflow-hidden">
                                    <Cropper
                                        image={URL.createObjectURL(
                                            thumbCropFile
                                        )}
                                        crop={thumbCrop}
                                        zoom={thumbZoom}
                                        aspect={16 / 9}
                                        onCropChange={setThumbCrop}
                                        onZoomChange={setThumbZoom}
                                        onCropComplete={onThumbCropComplete}
                                    />
                                </div>
                                <div className="flex justify-between w-full mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setThumbCropFile(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleThumbCropDone}>
                                        Crop
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout_User>
    );
}
