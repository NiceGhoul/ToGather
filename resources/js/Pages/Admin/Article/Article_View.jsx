import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Popup from "@/Components/Popup";
import Cropper from "react-easy-crop";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";

import {
    EyeOff,
    Eye,
    Trash,
    Check,
    X,
    ArrowBigLeft,
    Pencil,
    PencilOff,
    Save,
    Ban,
    Rows2,
    Columns2,
    CaseSensitive,
    Image as ImageIcon,
} from "lucide-react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ArticleView() {
    const { article } = usePage().props;
    const from = new URL(window.location.href).searchParams.get("from");

    const [editingMode, setEditingMode] = useState(false);

    const [blocks, setBlocks] = useState(() =>
        (article.contents || []).map((c) => ({
            id: c.id ?? null,
            type: c.type,
            content: c.type === "image" ? c.image_url : c.content,

            order_x: Number(c.order_x),
            order_y: Number(c.order_y),
            newFile: null,
            preview: c.image_url || null,
        })),
    );
    //States
    const [extraRows, setExtraRows] = useState(0);

    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [popupType, setPopupType] = useState("");

    const [unsavedPopupOpen, setUnsavedPopupOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const [editingId, setEditingId] = useState(null);

    const [quillValue, setQuillValue] = useState("");

    const [cropFile, setCropFile] = useState(null);
    const [cropTargetIdx, setCropTargetIdx] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkMode(isDark);

        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains("dark");
            setIsDarkMode(isDark);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const handleImageClick = (url) => setSelectedImage(url);
    const handleCloseModal = () => setSelectedImage(null);

    // Back Handler
    const handleBack = () => {
        if (from === "verification") router.get("/admin/articles/requests");
        else router.get("/admin/articles/list");
    };

    //Actions Handler
    const handleEnable = (id) => router.post(`/admin/articles/${id}/approve`);
    const handleDisable = (id) => router.post(`/admin/articles/${id}/disable`);

    const handleDelete = (id) => {
        router.post(
            `/admin/articles/${id}/delete`,
            {},
            {
                onSuccess: () => {
                    setSuccessPopupMessage("Article deleted.");
                    setPopupType("delete");
                    setSuccessPopupOpen(true);
                },
            },
        );
    };

    const handleApprove = (id) => router.post(`/admin/articles/${id}/approve`);

    const handleReject = (id, reason) => {
        router.post(
            `/admin/articles/${id}/reject`,
            { reason },
            {
                onSuccess: () => {
                    setRejectModalOpen(false);
                    setRejectReason("");
                    setSuccessPopupMessage("Article rejected.");
                    setPopupType("reject");
                    setSuccessPopupOpen(true);
                },
            },
        );
    };

    const startEdit = (idx) => {
        const block = blocks[idx];
        if (!block || (block.type !== "text" && block.type !== "paragraph"))
            return;

        setEditingId(block.id ?? `new-${idx}`);
        setQuillValue(block.content ?? "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setQuillValue("");
    };

    const applyTextToBlock = (idx) => {
        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = {
                ...copy[idx],
                content: quillValue,
            };
            return copy;
        });

        setEditingId(null);
        setQuillValue("");
    };

    // Blocks Actions
    const { maxX, maxY, gridCells } = useMemo(() => {
        const xs = blocks.map((b) => b.order_x || 1);
        const ys = blocks.map((b) => b.order_y || 1);

        const baseMaxX = Math.max(1, ...(xs.length ? xs : [1]));
        const baseMaxY = Math.max(1, ...(ys.length ? ys : [1]));

        const computedMaxX = Math.min(2, baseMaxX);
        const computedMaxY = baseMaxY + extraRows;

        const cells = [];
        for (let y = 1; y <= computedMaxY; y++) {
            for (let x = 1; x <= computedMaxX; x++) {
                let idx = blocks.findIndex(
                    (b) => b.order_x === x && b.order_y === y,
                );
                if (idx === -1) idx = null;
                cells.push({ x, y, idx });
            }
        }
        return { maxX: computedMaxX, maxY: computedMaxY, gridCells: cells };
    }, [blocks, extraRows]);

    const addBlockAt = (order_x, order_y, type) => {
        if (order_x > 2) return;

        if (blocks.some((b) => b.order_x === order_x && b.order_y === order_y))
            return;

        setBlocks((prev) => [
            ...prev,
            {
                id: null,
                type,
                content: type === "text" ? "" : null,
                order_x,
                order_y,
                newFile: null,
                preview: null,
            },
        ]);

        setEditingMode(true);
    };

    const removeBlock = (idx) => {
        setBlocks((prev) => {
            const target = prev[idx];
            if (!target) return prev;

            let remaining = prev.filter(
                (b) =>
                    !(
                        b.order_x === target.order_x &&
                        b.order_y === target.order_y
                    ),
            );

            const rowStillExists = remaining.some(
                (b) => b.order_y === target.order_y,
            );

            if (!rowStillExists) {
                remaining = remaining.map((b) => {
                    if (b.order_y > target.order_y)
                        return { ...b, order_y: b.order_y - 1 };
                    return b;
                });
            }

            return remaining;
        });
    };

    const addRow = () => {
        setExtraRows((r) => r + 1);
    };

    const onSelectImageForBlock = (file, idx) => {
        setCropFile(file);
        setCropTargetIdx(idx);
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const getCroppedBlob = (imageSrc, cropPixels) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = cropPixels.width;
                canvas.height = cropPixels.height;

                ctx.drawImage(
                    image,
                    cropPixels.x,
                    cropPixels.y,
                    cropPixels.width,
                    cropPixels.height,
                    0,
                    0,
                    cropPixels.width,
                    cropPixels.height,
                );

                canvas.toBlob((blob) => {
                    if (!blob) reject("Crop failed.");
                    const file = new File([blob], "cropped.jpg", {
                        type: "image/jpeg",
                    });
                    resolve(file);
                });
            };
        });

    const handleCropDone = async () => {
        if (!cropFile || !croppedAreaPixels) return;

        const src = URL.createObjectURL(cropFile);
        const cropped = await getCroppedBlob(src, croppedAreaPixels);

        setBlocks((prev) => {
            const copy = [...prev];
            const idx = cropTargetIdx;

            if (idx != null) {
                copy[idx] = {
                    ...copy[idx],
                    newFile: cropped,
                    preview: URL.createObjectURL(cropped),
                };
            }
            return copy;
        });

        setCropFile(null);
        setCropTargetIdx(null);
    };

    const saveAllChanges = () => {
        const fd = new FormData();

        fd.append("title", article.title);
        fd.append("category", article.category);

        blocks.forEach((b, i) => {
            fd.append(`contents[${i}][type]`, b.type);
            fd.append(`contents[${i}][order_x]`, b.order_x);
            fd.append(`contents[${i}][order_y]`, b.order_y);

            if (b.type === "text" || b.type === "paragraph") {
                fd.append(`contents[${i}][content]`, b.content ?? "");
            } else if (b.newFile) {
                fd.append(`contents[${i}][content]`, b.newFile);
            } else {
                fd.append(`contents[${i}][content]`, b.content ?? "");
            }
        });

        router.post(`/admin/articles/${article.id}/update`, fd, {
            forceFormData: true,
            onSuccess: () => {
                setSuccessPopupMessage("Article updated successfully!");
                setPopupType("update");
                setSuccessPopupOpen(true);
                setEditingMode(false);
            },
        });
    };

    const cancelAll = () => {
        setBlocks(
            (article.contents || []).map((c) => ({
                id: c.id ?? null,
                type: c.type,
                content: c.type === "image" ? c.image_url : c.content,

                order_x: Number(c.order_x),
                order_y: Number(c.order_y),
                newFile: null,
                preview: c.image_url || null,
            })),
        );
        setEditingId(null);
        setEditingMode(false);
        setQuillValue("");
    };

    const renderCellControls = (cell, idxInBlocks) => {
        if (!editingMode) return null;

        if (idxInBlocks == null) {
            return (
                <div className="mt-2 flex gap-2">
                    <Button
                        className="text-sm px-3 py-1 h-auto dark:bg-purple-700 dark:text-white  dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700"
                        onClick={() => addBlockAt(cell.x, cell.y, "text")}
                    >
                        <CaseSensitive />
                    </Button>

                    <Button className="relative px-3 py-1 text-sm h-auto dark:bg-purple-700 dark:text-white  dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700">
                        <ImageIcon />
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setBlocks((prev) => {
                                    const newIdx = prev.length;
                                    setCropFile(file);
                                    setCropTargetIdx(newIdx);
                                    return [
                                        ...prev,
                                        {
                                            id: null,
                                            type: "image",
                                            content: null,
                                            order_x: cell.x,
                                            order_y: cell.y,
                                            newFile: null,
                                            preview: null,
                                        },
                                    ];
                                });
                            }}
                        />
                    </Button>
                </div>
            );
        }

        const block = blocks[idxInBlocks];

        if (block.type === "text" || block.type === "paragraph") {
            if (editingId === (block.id ?? `new-${idxInBlocks}`)) {
                return null;
            }

            return (
                <div className="mt-2 flex gap-2">
                    <Button
                        className="dark:bg-purple-700 dark:text-white text-sm px-3 py-1 h-auto dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700"
                        onClick={() => startEdit(idxInBlocks)}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                        className="dark:bg-red-600 dark:text-white dark:hover:bg-red-500 bg-red-200 hover:bg-red-300 text-red-700 text-sm px-3 py-1 h-auto "
                        onClick={() => removeBlock(idxInBlocks)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="mt-2 flex gap-2">
                <Button className="dark:bg-purple-700 dark:text-white text-sm px-3 py-1 h-auto dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700 relative">
                    <ImageIcon />
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            onSelectImageForBlock(file, idxInBlocks);
                        }}
                    />
                </Button>

                <Button
                    className="dark:bg-red-600 dark:text-white dark:hover:bg-red-500 bg-red-200 hover:bg-red-300 text-red-700 text-sm px-3 py-1 h-auto"
                    onClick={() => removeBlock(idxInBlocks)}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    return (
        <Layout_Admin title={`View Article: ${article.title}`}>
            <div className="p-6 space-y-6">
                {/* Popups */}
                <Popup
                    triggerText=""
                    title={successPopupMessage}
                    description=""
                    confirmText="Okay"
                    confirmColor="bg-purple-800 text-white"
                    open={successPopupOpen}
                    onConfirm={() => {
                        setSuccessPopupOpen(false);
                        if (popupType === "update") router.reload();
                        if (popupType === "delete")
                            router.get("/admin/articles/list");
                    }}
                    onClose={() => setSuccessPopupOpen(false)}
                />

                {/* Header */}
                <div className="relative">
                    <div className="flex flex-col gap-3 pt-8">
                        <h1 className="text-2xl font-bold">{article.title}</h1>

                        <div className="flex gap-2 justify-end items-center">
                            <span className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium">
                                {String(article.status || "unknown")
                                    .charAt(0)
                                    .toUpperCase() +
                                    String(article.status || "unknown").slice(
                                        1,
                                    )}
                            </span>
                            {/* Buttons */}
                            {!editingMode && (
                                <>
                                    {article.status === "pending" ? (
                                        <>
                                            <Button
                                                className="dark:bg-green-700 dark:text-white dark:hover:bg-green-600 bg-green-200 hover:bg-green-300 text-green-700"
                                                onClick={() =>
                                                    handleApprove(article.id)
                                                }
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>

                                            <Button
                                                className="dark:bg-red-600 dark:text-white dark:hover:bg-red-500 bg-red-200 hover:bg-red-300 text-red-700"
                                                onClick={() =>
                                                    setRejectModalOpen(true)
                                                }
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        (article.status === "approved" ||
                                            article.status === "disabled") && (
                                            <>
                                                {article.status ===
                                                "approved" ? (
                                                    <Button
                                                        className="bg-yellow-200 hover:bg-yellow-300 text-yellow-700 dark:bg-yellow-500 dark:text-white dark:hover:bg-yellow-600    "
                                                        onClick={() =>
                                                            handleDisable(
                                                                article.id,
                                                            )
                                                        }
                                                    >
                                                        <EyeOff className="w-4 h-4 mr-2" />
                                                        Disable
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="dark:bg-green-700 dark:text-white dark:hover:bg-green-600 bg-green-200 hover:bg-green-300 text-green-700"
                                                        onClick={() =>
                                                            handleEnable(
                                                                article.id,
                                                            )
                                                        }
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Enable
                                                    </Button>
                                                )}
                                            </>
                                        )
                                    )}
                                    <Button
                                        className="dark:bg-red-600 dark:text-white dark:hover:bg-red-500 bg-red-200 hover:bg-red-300 text-red-700"
                                        onClick={() => handleDelete(article.id)}
                                    >
                                        <Trash className="w-4 h-4" /> Delete
                                    </Button>
                                </>
                            )}

                            <Button
                                onClick={() =>
                                    editingMode
                                        ? (setPendingAction("exit"),
                                          setUnsavedPopupOpen(true))
                                        : setEditingMode(true)
                                }
                                className="dark:bg-purple-700 dark:text-white  dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700"
                            >
                                {!editingMode ? (
                                    <div className="flex items-center gap-2">
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <PencilOff className="w-4 h-4" />
                                        Exit Edit
                                    </div>
                                )}
                            </Button>

                            {editingMode && (
                                <>
                                    <Button
                                        className="dark:bg-green-700 dark:text-white dark:hover:bg-green-600 bg-green-200 hover:bg-green-300 text-green-700"
                                        onClick={saveAllChanges}
                                    >
                                        <Save className="w-4 h-4" /> Save
                                    </Button>

                                    <Button
                                        className="dark:bg-red-600 dark:text-white dark:hover:bg-red-500 bg-red-200 hover:bg-red-300 text-red-700"
                                        onClick={cancelAll}
                                    >
                                        <Ban className="w-4 h-4" /> Cancel
                                    </Button>

                                    <Button
                                        className="dark:bg-purple-700 dark:text-white  dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700"
                                        onClick={addRow}
                                    >
                                        <Rows2 className="w-4 h-4" /> Add Row
                                    </Button>
                                </>
                            )}

                            <Button
                                className="dark:bg-purple-700 dark:text-white  dark:hover:bg-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-700"
                                onClick={() => {
                                    if (editingMode) {
                                        setPendingAction("back");
                                        setUnsavedPopupOpen(true);
                                    } else handleBack();
                                }}
                            >
                                <ArrowBigLeft className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail */}
                {article.thumbnail_url && (
                    <div>
                        <h2 className="font-semibold text-lg mb-2">
                            Thumbnail
                        </h2>
                        <img
                            src={article.thumbnail_url}
                            className="max-w-sm rounded shadow cursor-pointer"
                            onClick={() =>
                                handleImageClick(article.thumbnail_url)
                            }
                        />
                    </div>
                )}

                {/* Content */}
                <div className="">
                    <h2 className="font-semibold text-lg mb-4">Content</h2>

                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns: `repeat(${Math.max(
                                1,
                                maxX,
                            )}, minmax(0,1fr))`,
                        }}
                    >
                        {gridCells.map(({ x, y, idx }) => {
                            const blockIdx = idx;
                            const block =
                                typeof blockIdx === "number"
                                    ? blocks[blockIdx]
                                    : null;

                            return (
                                <div
                                    key={`${y}-${x}`}
                                    className="p-4 border rounded bg-white"
                                >
                                    <div className="flex justify-between mb-2">
                                        <div className="text-xs text-gray-500">
                                            Block ({y}) –{" "}
                                            {block
                                                ? block.type === "text" ||
                                                  block.type === "paragraph"
                                                    ? "Text"
                                                    : "Image"
                                                : "Empty"}
                                        </div>

                                        {renderCellControls({ x, y }, blockIdx)}
                                    </div>
                                    {block ? (
                                        block.type === "text" ||
                                        block.type === "paragraph" ? (
                                            editingId ===
                                            (block.id ?? `new-${blockIdx}`) ? (
                                                <div>
                                                    <div
                                                        className={
                                                            isDarkMode
                                                                ? "dark"
                                                                : ""
                                                        }
                                                    >
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={quillValue}
                                                            onChange={
                                                                setQuillValue
                                                            }
                                                            className="bg-white rounded border"
                                                        />
                                                    </div>

                                                    <div className="mt-3 flex gap-2">
                                                        <Button
                                                            onClick={() =>
                                                                applyTextToBlock(
                                                                    blockIdx,
                                                                )
                                                            }
                                                            className="dark:bg-green-700 dark:text-white dark:hover:bg-green-600 bg-green-200 hover:bg-green-300 text-green-700"
                                                        >
                                                            Apply
                                                        </Button>
                                                        <Button
                                                            onClick={cancelEdit}
                                                            className="dark:bg-red-600 dark:text-white dark:hover:bg-red-500 bg-red-200 hover:bg-red-300 text-red-700"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="prose prose-purple max-w-none text-sm dark:text-black"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            block.content ||
                                                            "<em>Empty</em>",
                                                    }}
                                                />
                                            )
                                        ) : (
                                            <img
                                                src={block.preview}
                                                className="w-full rounded shadow cursor-pointer"
                                                onClick={() =>
                                                    handleImageClick(
                                                        block.preview,
                                                    )
                                                }
                                            />
                                        )
                                    ) : (
                                        <div className="text-xs text-gray-400">
                                            Empty cell
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Crop Modal */}
                {cropFile && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow">
                            <h3 className="font-semibold mb-3 text-center">
                                Crop Image
                            </h3>

                            <div className="w-[620px] h-[380px] relative">
                                <Cropper
                                    image={URL.createObjectURL(cropFile)}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={16 / 9}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>

                            <div className="flex justify-between mt-4">
                                <Button
                                    className="bg-gray-300"
                                    onClick={() => {
                                        setCropFile(null);
                                        setCropTargetIdx(null);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button onClick={handleCropDone}>
                                    Crop & Apply
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Image Preview */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
                        onClick={handleCloseModal}
                    >
                        <img
                            src={selectedImage}
                            className="max-h-[90vh] rounded shadow-lg"
                        />
                    </div>
                )}
            </div>

            {/* Unsaved Changes Popup */}
            <Popup
                triggerText=""
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave?"
                confirmText="Proceed"
                confirmColor="bg-red-600 text-white hover:bg-red-500"
                open={unsavedPopupOpen}
                onConfirm={() => {
                    setUnsavedPopupOpen(false);
                    if (pendingAction === "back") {
                        cancelAll();
                        handleBack();
                    } else {
                        cancelAll();
                    }
                }}
                onClose={() => setUnsavedPopupOpen(false)}
            />

            {/* Reject Modal */}
            {rejectModalOpen && (
                <Popup
                    triggerText=""
                    title="Reject Article"
                    description=""
                    confirmText="Submit Rejection"
                    confirmColor="bg-red-600 hover:bg-red-500 text-white"
                    open={rejectModalOpen}
                    onConfirm={() => {
                        if (!rejectReason.trim()) {
                            setSuccessPopupMessage(
                                "Please provide a rejection reason.",
                            );
                            setPopupType("reject");
                            setSuccessPopupOpen(true);
                            return;
                        }
                        handleReject(article.id, rejectReason);
                    }}
                    onClose={() => {
                        setRejectModalOpen(false);
                        setRejectReason("");
                    }}
                >
                    <textarea
                        className="w-full border rounded p-2 mt-2 text-sm"
                        rows={4}
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </Popup>
            )}
        </Layout_Admin>
    );
}
