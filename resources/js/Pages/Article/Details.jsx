import Layout_User from "@/Layouts/Layout_User";
import { usePage, router } from "@inertiajs/react";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Heart, ArrowLeft } from "lucide-react";
import Cropper from "react-easy-crop";
import Popup from "@/Components/Popup";

export default function Details() {
    const { article, auth } = usePage().props;
    const currentUser = auth?.user;

    // ---------- LIKE ----------
    const [liked, setLiked] = useState(article.is_liked_by_user ?? false);
    const [likeCount, setLikeCount] = useState(article.likes_count ?? 0);

    const handleLike = async () => {
        try {
            const res = await fetch(`/articles/${article.id}/like`, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            setLiked(data.isLiked);
            setLikeCount(data.likeCount);
        } catch (e) {
            console.error(e);
        }
    };

    // ---------- STATES ----------
    const [editingMode, setEditingMode] = useState(false);
    const [blocks, setBlocks] = useState(() =>
        (article.contents || []).map((c) => ({
            id: c.id ?? null,
            type: c.type,
            content: c.content,
            order_x: Number(c.order_x),
            order_y: Number(c.order_y),
            newFile: null,
            preview: c.image_url || null,
        }))
    );
    const [extraCols, setExtraCols] = useState(0);
    const [extraRows, setExtraRows] = useState(0);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("");
    const [unsavedPopupOpen, setUnsavedPopupOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [cropFile, setCropFile] = useState(null);
    const [cropTargetIdx, setCropTargetIdx] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    // ---------- TEXT EDIT ----------
    const [editingId, setEditingId] = useState(null);
    const editableRef = useRef(null);
    const placeCaretAtEnd = (el) => {
        if (!el) return;
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const startEdit = (idx) => {
        const block = blocks[idx];
        if (!block || block.type !== "text") return;
        setEditingId(block.id ?? `new-${idx}`);
        requestAnimationFrame(() => {
            if (editableRef.current) {
                editableRef.current.innerHTML = block.content ?? "";
                placeCaretAtEnd(editableRef.current);
            }
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        if (editableRef.current) editableRef.current.innerHTML = "";
    };

    const applyTextToBlock = (idx) => {
        if (!editableRef.current) return;
        const newHtml = editableRef.current.innerHTML;
        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], content: newHtml };
            return copy;
        });
        setEditingId(null);
    };

    // ---------- GRID ----------
    const { maxX, maxY, gridCells } = useMemo(() => {
        const xs = blocks.map((b) => b.order_x || 1);
        const ys = blocks.map((b) => b.order_y || 1);
        const rawMaxX = Math.max(1, ...(xs.length ? xs : [1]));
        const rawMaxY = Math.max(1, ...(ys.length ? ys : [1]));
        const computedMaxX = rawMaxX + extraCols;
        const computedMaxY = rawMaxY + extraRows;
        const maxX = Math.min(2, computedMaxX);
        const maxY = Math.max(1, computedMaxY);
        const cells = [];
        for (let y = 1; y <= maxY; y++) {
            for (let x = 1; x <= maxX; x++) {
                let idx = blocks.findIndex(
                    (b) => Number(b.order_x) === x && Number(b.order_y) === y
                );
                if (idx === -1) idx = null;
                cells.push({ x, y, idx });
            }
        }
        return { maxX, maxY, gridCells: cells };
    }, [blocks, extraCols, extraRows]);

    const addRow = () => setExtraRows((s) => s + 1);
    const addColumn = () => {
        if (maxX < 2) setExtraCols((s) => s + 1);
    };

    // ---------- IMAGE CROPPER ----------
    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const getCroppedBlob = (imageSrc, cropPixels) =>
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
                    if (!blob) return reject(new Error("Canvas empty"));
                    const file = new File([blob], `crop-${Date.now()}.jpg`, {
                        type: "image/jpeg",
                    });
                    resolve(file);
                }, "image/jpeg");
            };
            image.onerror = (err) => reject(err);
        });

    const handleCropDone = async () => {
        if (!cropFile || !croppedAreaPixels) return;
        const src = URL.createObjectURL(cropFile);
        const croppedFile = await getCroppedBlob(src, croppedAreaPixels);
        setBlocks((prev) => {
            const copy = [...prev];
            const idx = cropTargetIdx;
            if (idx == null || idx < 0 || idx >= copy.length) {
                copy.push({
                    id: null,
                    type: "image",
                    content: null,
                    order_x:
                        Math.max(1, ...copy.map((b) => b.order_x || 1)) + 1,
                    order_y: 1,
                    newFile: croppedFile,
                    preview: URL.createObjectURL(croppedFile),
                });
            } else {
                copy[idx] = {
                    ...copy[idx],
                    type: "image",
                    newFile: croppedFile,
                    preview: URL.createObjectURL(croppedFile),
                };
            }
            return copy;
        });
        setCropFile(null);
        setCropTargetIdx(null);
    };

    const onSelectImageForBlock = (file, idx) => {
        setCropFile(file);
        setCropTargetIdx(idx);
    };

    // ---------- ADD / REMOVE ----------
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
    };

    const removeBlock = (idx) => {
        setBlocks((prev) => {
            const target = prev[idx];
            if (!target) return prev;

            // Hapus blok target dari array
            let updated = prev.filter(
                (b) =>
                    !(
                        b.order_x === target.order_x &&
                        b.order_y === target.order_y
                    )
            );

            // Cek apakah baris itu masih punya blok lain
            const rowStillExists = updated.some(
                (b) => b.order_y === target.order_y
            );

            // Kalau baris jadi kosong → geser semua blok di bawahnya naik 1 baris
            if (!rowStillExists) {
                updated = updated.map((b) => {
                    if (b.order_y > target.order_y) {
                        return { ...b, order_y: b.order_y - 1 };
                    }
                    return b;
                });
            }

            return updated;
        });
    };

    // ---------- SAVE / CANCEL ----------
    const saveAllChanges = () => {
        const fd = new FormData();
        fd.append("title", article.title);
        fd.append("category", article.category);
        blocks.forEach((b, i) => {
            fd.append(`contents[${i}][type]`, b.type);
            fd.append(`contents[${i}][order_x]`, b.order_x);
            fd.append(`contents[${i}][order_y]`, b.order_y);
            if (b.type === "text") {
                fd.append(`contents[${i}][content]`, b.content ?? "");
            } else if (b.newFile) {
                fd.append(`contents[${i}][content]`, b.newFile, b.newFile.name);
            } else {
                fd.append(`contents[${i}][content]`, b.content ?? "");
            }
        });

        router.post(`/articles/${article.id}/update`, fd, {
            forceFormData: true,
            onSuccess: () => {
                setSuccessPopupMessage("Changes saved! Pending re-approval.");
                setPopupType("update");
                setSuccessPopupOpen(true);
            },
            onError: () => {
                setSuccessPopupMessage("Failed to save changes.");
                setPopupType("error");
                setSuccessPopupOpen(true);
            },
        });
    };

    const cancelAll = () => {
        setBlocks(
            (article.contents || []).map((c) => ({
                id: c.id ?? null,
                type: c.type,
                content: c.content,
                order_x: Number(c.order_x),
                order_y: Number(c.order_y),
                newFile: null,
                preview: c.image_url || null,
            }))
        );
        setEditingMode(false);
        setEditingId(null);
    };
    const sortedContents = useMemo(() => {
        if (!article?.contents) return [];
        return [...article.contents].sort((a, b) => {
            if (a.order_y === b.order_y) return a.order_x - b.order_x;
            return a.order_y - b.order_y;
        });
    }, [article]);

    // ---------- RENDER CONTROLS ----------
    const renderCellControls = (cell, idxInBlocks) => {
        if (!editingMode) return null;
        return (
            <div className="mt-2 flex flex-wrap gap-2 items-center">
                {idxInBlocks == null ? (
                    <>
                        <Button
                            type="button"
                            className="text-white text-sm px-3 py-1 h-auto"
                            onClick={() => addBlockAt(cell.x, cell.y, "text")}
                        >
                            + Text
                        </Button>

                        <Button className="relative px-3 py-1 text-sm overflow-hidden h-auto">
                            + Image
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setBlocks((prev) => {
                                        const newBlock = {
                                            id: null,
                                            type: "image",
                                            content: null,
                                            order_x: cell.x,
                                            order_y: cell.y,
                                            newFile: null,
                                            preview: null,
                                        };
                                        const newIdx = prev.length;
                                        setCropFile(file);
                                        setCropTargetIdx(newIdx);
                                        return [...prev, newBlock];
                                    });
                                }}
                            />
                        </Button>
                    </>
                ) : (
                    <>
                        {blocks[idxInBlocks].type === "text" ? (
                            <>
                                <Button
                                    className="text-white text-sm px-3 py-1 h-auto"
                                    onClick={() => startEdit(idxInBlocks)}
                                >
                                    Edit Text
                                </Button>
                                <Button
                                    onClick={() => removeBlock(idxInBlocks)}
                                    className="bg-red-600 text-white text-sm px-3 py-1 h-auto"
                                >
                                    Remove
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="relative inline-block">
                                    <Button
                                        type="button"
                                        className="bg-purple-800 hover:bg-purple-700 text-white text-sm px-3 py-1 h-auto"
                                    >
                                        Replace Image
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                onSelectImageForBlock(
                                                    file,
                                                    idxInBlocks
                                                );
                                        }}
                                    />
                                </div>

                                <Button
                                    onClick={() => removeBlock(idxInBlocks)}
                                    className="bg-red-600 text-white text-sm px-3 py-1 h-auto"
                                >
                                    Remove
                                </Button>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };

    // ---------- UI ----------
    return (
        <Layout_User>
            <div className="w-full flex flex-col items-center py-10">
                {/* HEADER */}
                <div className="w-full max-w-4xl flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="flex items-center gap-2"
                            onClick={() => {
                                if (editingMode) {
                                    setPendingAction("back");
                                    setUnsavedPopupOpen(true);
                                } else {
                                    window.history.back();
                                }
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>

                    {currentUser?.id === article.user_id && (
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    if (editingMode) {
                                        setPendingAction("exit");
                                        setUnsavedPopupOpen(true);
                                    } else {
                                        setEditingMode(true);
                                    }
                                }}
                            >
                                {editingMode
                                    ? "Exit Edit Mode"
                                    : "Enter Edit Mode"}
                            </Button>
                            {editingMode && (
                                <>
                                    <Button
                                        onClick={saveAllChanges}
                                        className="bg-green-600"
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        onClick={cancelAll}
                                        className="bg-gray-400"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={addRow}>Add Row</Button>
                                    <Button
                                        onClick={addColumn}
                                        disabled={maxX >= 2}
                                    >
                                        Add Column
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                {article.thumbnail_url && (
                    <div className="w-full max-w-4xl h-[300px] rounded-xl overflow-hidden bg-gray-100 shadow-sm mb-8">
                        <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-full h-full object-cover object-center cursor-pointer"
                            onClick={() => {
                                setModalImage(article.thumbnail_url);
                                setShowModal(true);
                            }}
                        />
                    </div>
                )}

                {/* Title + author */}
                <div className="w-full max-w-4xl text-left mb-4">
                    <h1 className="text-3xl font-bold">{article.title}</h1>
                </div>

                <div className="w-full max-w-4xl flex items-center gap-3 text-gray-500 mb-6">
                    <p>
                        by {article.user?.nickname ?? "Unknown"} ·{" "}
                        {new Date(article.created_at).toLocaleDateString()}
                    </p>
                    {!editingMode && (
                        <div className="ml-auto flex items-center gap-2">
                            <Toggle
                                pressed={liked}
                                onPressedChange={handleLike}
                                size="lg"
                                variant="outline"
                                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                            >
                                <Heart className="w-5 h-5" />
                            </Toggle>
                            <span className="text-sm text-gray-700">
                                {likeCount} {likeCount === 1 ? "like" : "likes"}
                            </span>
                        </div>
                    )}
                </div>
                {/*Content*/}
                <div className="w-full max-w-4xl">
                    {sortedContents.length > 0 ? (
                        (() => {
                            const maxX = Math.max(
                                ...sortedContents.map((b) => b.order_x)
                            );
                            const maxY = Math.max(
                                ...sortedContents.map((b) => b.order_y)
                            );
                            const cells = [];

                            for (let y = 1; y <= maxY; y++) {
                                for (let x = 1; x <= maxX; x++) {
                                    const block = sortedContents.find(
                                        (b) =>
                                            b.order_x === x && b.order_y === y
                                    );
                                    cells.push({ x, y, block });
                                }
                            }

                            return (
                                <div
                                    className="grid w-full gap-6 mb-8"
                                    style={{
                                        gridTemplateColumns: `repeat(${maxX}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {cells.map(({ x, y, block }, index) => (
                                        <div
                                            key={`${y}-${x}`}
                                            className="w-full rounded-md p-2 overflow-hidden break-words"
                                            style={{
                                                gridColumnStart: x,
                                                gridRowStart: y,
                                            }}
                                        >
                                            {block ? (
                                                block.type === "text" ? (
                                                    <div
                                                        className="prose max-w-none text-justify"
                                                        dangerouslySetInnerHTML={{
                                                            __html: block.content,
                                                        }}
                                                    ></div>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="w-full max-w-[420px]">
                                                            <img
                                                                src={
                                                                    block.image_url
                                                                }
                                                                alt={`Block ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-64 object-contain rounded-md shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
                                                                onClick={() => {
                                                                    setModalImage(
                                                                        block.image_url
                                                                    );
                                                                    setShowModal(
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="min-h-[100px]"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()
                    ) : (
                        <p className="text-gray-500 italic mb-6 text-center">
                            This article has no content blocks.
                        </p>
                    )}
                </div>

                {/* GRID CONTENT */}
                <div
                    className="grid w-full gap-6 mb-8 max-w-4xl"
                    style={{
                        gridTemplateColumns: `repeat(${Math.max(
                            1,
                            maxX
                        )}, minmax(0, 1fr))`,
                    }}
                >
                    {gridCells.map(({ x, y, idx }, i) => {
                        const blockIdx = idx;
                        const block =
                            typeof blockIdx === "number" && blockIdx >= 0
                                ? blocks[blockIdx]
                                : null;

                        return (
                            <div
                                key={`${y}-${x}`}
                                className="w-full rounded-md p-4 border bg-white min-h-[120px] break-words"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-xs text-gray-400">
                                        Grid ({x},{y}){" "}
                                        {block
                                            ? block.type === "text"
                                                ? " - Text"
                                                : " - Image"
                                            : ""}
                                    </div>
                                    {renderCellControls({ x, y }, blockIdx)}
                                </div>

                                {block ? (
                                    block.type === "text" ? (
                                        editingId ===
                                        (block.id ?? `new-${blockIdx}`) ? (
                                            <div>
                                                <div
                                                    ref={editableRef}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    className="prose max-w-none text-sm border rounded p-3 min-h-[120px]"
                                                />
                                                <div className="mt-2 flex gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            applyTextToBlock(
                                                                blockIdx
                                                            )
                                                        }
                                                    >
                                                        Apply
                                                    </Button>
                                                    <Button
                                                        onClick={cancelEdit}
                                                        className="bg-gray-400"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="prose max-w-none text-sm"
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
                                            alt={`Block ${x},${y}`}
                                            className="w-full h-64 object-cover rounded-md"
                                        />
                                    )
                                ) : (
                                    <div className="text-sm text-gray-400">
                                        Empty
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
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[680px]">
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="font-medium">Crop Image</h3>
                            <div className="w-[620px] h-[380px] relative bg-gray-900 rounded-md overflow-hidden">
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
                                    Crop & Apply
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* POPUPS */}
            <Popup
                triggerText=""
                title={successPopupMessage}
                description=""
                confirmText="OK"
                open={successPopupOpen}
                onConfirm={() => {
                    setSuccessPopupOpen(false);
                    if (popupType === "update") {
                        setEditingMode(false);
                        router.reload();
                    }
                }}
                onClose={() => {
                    setSuccessPopupOpen(false);
                    if (popupType === "update") {
                        setEditingMode(false);
                        router.reload();
                    }
                }}
            />

            <Popup
                triggerText=""
                title="Unsaved Changes"
                description="You have unsaved changes. Leave edit mode and discard them?"
                confirmText="OK"
                open={unsavedPopupOpen}
                onConfirm={() => {
                    setUnsavedPopupOpen(false);
                    if (pendingAction === "back") {
                        cancelAll();
                        window.history.back();
                    } else if (pendingAction === "exit") {
                        cancelAll();
                    }
                    setPendingAction(null);
                }}
                onClose={() => {
                    setUnsavedPopupOpen(false);
                    setPendingAction(null);
                }}
            />

            {/* Image Modal Viewer */}
            {showModal && modalImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <img
                        src={modalImage}
                        alt="Full View"
                        className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-6 right-6 text-white text-3xl font-bold"
                        onClick={() => setShowModal(false)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </Layout_User>
    );
}
