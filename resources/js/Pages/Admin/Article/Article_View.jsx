import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import Popup from "@/Components/Popup";
import Cropper from "react-easy-crop";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";

export default function ArticleView() {
    const { article, url } = usePage().props;
    const from = new URL(window.location.href).searchParams.get("from");

    // UI / control state
    const [editingMode, setEditingMode] = useState(false); // global edit toggle
    const [blocks, setBlocks] = useState(() =>
        (article.contents || []).map((c) => ({
            id: c.id ?? null,
            type: c.type,
            content: c.content, // string path or html
            order_x: Number(c.order_x),
            order_y: Number(c.order_y),
            newFile: null, // File when replaced/added image
            preview: c.image_url || null,
        }))
    );

    // extra grid control (add empty columns/rows)
    const [extraCols, setExtraCols] = useState(0);
    const [extraRows, setExtraRows] = useState(0);

    // other states (existing)
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [popupType, setPopupType] = useState("");
    const [unsavedPopupOpen, setUnsavedPopupOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // "back" | "exit"

    // inline text editing (single-block edit)
    const [editingId, setEditingId] = useState(null);
    const editableRef = useRef(null);

    // cropper states for image upload/replace
    const [cropFile, setCropFile] = useState(null);
    const [cropTargetIdx, setCropTargetIdx] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // reject modal state
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const handleImageClick = (imageUrl) => setSelectedImage(imageUrl);
    const handleCloseModal = () => setSelectedImage(null);

    const handleBack = () => {
        if (from === "verification") {
            router.get("/admin/articles/requests");
        } else {
            router.get("/admin/articles/list");
        }
    };

    const handleEnable = (id) => router.post(`/admin/articles/${id}/approve`);
    const handleDisable = (id) => router.post(`/admin/articles/${id}/disable`);
    const handleDelete = (id) => {
        router.post(
            `/admin/articles/${id}/delete`,
            {},
            {
                onSuccess: () => {
                    setDeletedId(id);
                    setSuccessPopupMessage("Article has been deleted");
                    setPopupType("delete-success");
                    setSuccessPopupOpen(true);
                },
                onError: () => {
                    setSuccessPopupMessage("Failed to delete article");
                    setPopupType("delete-fail");
                    setSuccessPopupOpen(true);
                },
            }
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
                    setSuccessPopupMessage("Article rejected successfully!");
                    setPopupType("reject");
                    setSuccessPopupOpen(true);
                },
                onError: () => {
                    setSuccessPopupMessage("Failed to reject article");
                    setPopupType("reject-fail");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    // caret helper (used when editing text block)
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

    // start editing a text block (inline)
    const startEdit = (idx) => {
        const block = blocks[idx];
        if (!block || block.type !== "text") return;
        setEditingId(block.id ?? `new-${idx}`);
        // set content into DOM once rendered
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

    // apply text changes to local blocks (pull from DOM)
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

    // grid helpers: derive grid size from blocks and ensure empty cells display
    const { maxX, maxY, gridCells } = useMemo(() => {
        const xs = blocks.map((b) => b.order_x || 1);
        const ys = blocks.map((b) => b.order_y || 1);
        const rawMaxX = Math.max(1, ...(xs.length ? xs : [1]));
        const rawMaxY = Math.max(1, ...(ys.length ? ys : [1]));
        // include extra cols/rows requested by admin UI
        const computedMaxX = rawMaxX + extraCols;
        const computedMaxY = rawMaxY + extraRows;
        // enforce max columns = 2
        const maxX = Math.min(2, computedMaxX);
        const maxY = Math.max(1, computedMaxY);

        const cells = [];
        for (let y = 1; y <= maxY; y++) {
            for (let x = 1; x <= maxX; x++) {
                let idx = blocks.findIndex(
                    (b) => Number(b.order_x) === x && Number(b.order_y) === y
                );
                if (idx === -1) idx = null; // normalize
                cells.push({ x, y, idx });
            }
        }
        return { maxX, maxY, gridCells: cells };
    }, [blocks, extraCols, extraRows]);

    // add new block at position
    const addBlockAt = (order_x, order_y, type) => {
        // prevent adding beyond max columns
        if (order_x > 2) return;
        // prevent duplicate block at same cell
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

            // Hapus block target berdasarkan posisinya
            let updated = prev.filter(
                (b) =>
                    !(
                        b.order_x === target.order_x &&
                        b.order_y === target.order_y
                    )
            );

            // Cek apakah baris itu masih punya blok
            const rowStillExists = updated.some(
                (b) => b.order_y === target.order_y
            );

            // Kalau row kosong, geser semua blok di bawahnya ke atas
            if (!rowStillExists) {
                updated = updated.map((b) => {
                    if (b.order_y > target.order_y) {
                        return { ...b, order_y: b.order_y - 1 };
                    }
                    return b;
                });
            }

            // ❌ Jangan normalize otomatis di sini — biarkan posisi asli tetap
            return updated;
        });
    };

    // select local file to replace/add image -> open cropper
    const onSelectImageForBlock = (file, idx) => {
        setCropFile(file);
        setCropTargetIdx(idx);
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // get cropped blob and attach to block as File
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
                    if (!blob) return reject(new Error("Canvas is empty"));
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
        // attach to target block
        setBlocks((prev) => {
            const copy = [...prev];
            const idx = cropTargetIdx;
            if (idx == null || idx < 0 || idx >= copy.length) {
                // adding a brand new image block (if target missing) — push
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
                    content:
                        copy[idx].content &&
                        typeof copy[idx].content === "string"
                            ? copy[idx].content
                            : null,
                };
            }
            return copy;
        });
        setCropFile(null);
        setCropTargetIdx(null);
    };

    // build and submit FormData (supports files in contents)
    const saveAllChanges = () => {
        const fd = new FormData();
        fd.append("title", article.title);
        fd.append("category", article.category);

        // append contents array fields; when there is newFile include file in same key
        blocks.forEach((b, i) => {
            fd.append(`contents[${i}][type]`, b.type);
            fd.append(`contents[${i}][order_x]`, b.order_x);
            fd.append(`contents[${i}][order_y]`, b.order_y);
            // if text: send content HTML
            if (b.type === "text") {
                fd.append(`contents[${i}][content]`, b.content ?? "");
            } else {
                // image: if newFile present, attach as file; otherwise send existing path string
                if (b.newFile) {
                    fd.append(
                        `contents[${i}][content]`,
                        b.newFile,
                        b.newFile.name
                    );
                } else {
                    // send original string or null; adminUpdate will store as-is
                    fd.append(`contents[${i}][content]`, b.content ?? "");
                }
            }
        });

        router.post(`/admin/articles/${article.id}/update`, fd, {
            forceFormData: true,
            onSuccess: () => {
                setSuccessPopupMessage("Article has been updated and saved");
                setPopupType("update");
                setSuccessPopupOpen(true);
            },
            onError: (e) => console.error(e),
        });
    };

    // cancel all local edits -> reset from article
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

    // small utility to render cell controls when editingMode true
    const renderCellControls = (cell, idxInBlocks) => {
        if (!editingMode) return null;
        return (
            <div className="mt-2 flex flex-wrap gap-2 items-center">
                {idxInBlocks == null ? (
                    <>
                        <Button
                            type="button"
                            className=" text-white text-sm px-3 py-1 h-auto"
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
                                    // create a temp block then open cropper with target = index of new block
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
                                        // open cropper for the new index
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

    // Add column/row controls
    const addRow = () => {
        setExtraRows((s) => s + 1);
        setBlocks((prev) => normalizeGrid(prev));
        setEditingMode(true);
    };
    const addColumn = () => {
        if (maxX >= 2) return;
        setExtraCols((s) => s + 1);
        setBlocks((prev) => normalizeGrid(prev));
        setEditingMode(true);
    };

    // Reindex grid blocks supaya posisi tetap berurutan setelah add/delete
    const normalizeGrid = (blocks) => {
        // urutkan berdasarkan y, lalu x
        const sorted = [...blocks].sort(
            (a, b) => a.order_y - b.order_y || a.order_x - b.order_x
        );
        // assign ulang posisi agar grid rapi (2 kolom maksimum)
        return sorted.map((b, i) => ({
            ...b,
            order_x: (i % 2) + 1,
            order_y: Math.floor(i / 2) + 1,
        }));
    };

    // when user selects file for crop: set state
    useEffect(() => {
        if (!cropFile) return;
        // nothing else needed – modal uses cropFile
    }, [cropFile]);

    return (
        <Layout_Admin title={`View Article: ${article.title}`}>
            <div className="p-6 space-y-6">
                <Popup
                    triggerText=""
                    title={successPopupMessage}
                    description=""
                    confirmText="OK"
                    open={successPopupOpen}
                    onConfirm={() => {
                        setSuccessPopupOpen(false);
                        if (popupType === "delete-success") {
                            router.get("/admin/articles/list");
                        } else if (popupType === "update") {
                            setEditingMode(false);
                            router.reload(); // stay di halaman view
                        } else if (popupType === "reject-fail") {
                        }
                    }}
                    onClose={() => {
                        setSuccessPopupOpen(false);
                        if (popupType === "delete-success") {
                            router.get("/admin/articles/list");
                        } else if (popupType === "update") {
                            setEditingMode(false);
                            router.reload();
                        } else if (popupType === "reject-fail") {
                        }
                    }}
                />

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{article.title}</h1>
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
                            {editingMode ? "Exit Edit Mode" : "Enter Edit Mode"}
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
                                {/* grid controls */}
                                <Button onClick={addRow}>Add Row</Button>
                                <Button
                                    onClick={addColumn}
                                    disabled={maxX >= 2}
                                >
                                    Add Column
                                </Button>
                            </>
                        )}
                        <Button
                            onClick={() => {
                                if (editingMode) {
                                    setPendingAction("back");
                                    setUnsavedPopupOpen(true);
                                } else {
                                    handleBack();
                                }
                            }}
                            className="bg-gray-600"
                        >
                            ← Back
                        </Button>
                    </div>
                </div>

                {/* Info & action buttons (unchanged) */}
                <div className="bg-gray-50 rounded-lg p-4 border flex flex-row justify-between space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p>
                            <strong>Author:</strong>{" "}
                            {article.user?.nickname || article.user?.name}
                        </p>
                        <p>
                            <strong>Category:</strong> {article.category}
                        </p>
                        <p>
                            {article.status === "approved" && (
                                <>
                                    <strong>Status:</strong>{" "}
                                    <span className="text-green-600 font-semibold">
                                        Approved and Enabled
                                    </span>
                                </>
                            )}
                            {article.status === "pending" && (
                                <>
                                    <strong>Status:</strong>{" "}
                                    <span className="text-yellow-600 font-semibold">
                                        Pending
                                    </span>
                                </>
                            )}
                            {article.status === "disabled" && (
                                <>
                                    <strong>Status:</strong>{" "}
                                    <span className="text-yellow-600 font-semibold">
                                        Disabled
                                    </span>
                                </>
                            )}
                            {article.status === "rejected" && (
                                <>
                                    <strong>Status:</strong>{" "}
                                    <span className="text-red-600 font-semibold">
                                        Rejected
                                    </span>
                                </>
                            )}
                        </p>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(article.created_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>Last Updated:</strong>{" "}
                            {new Date(article.updated_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="flex flex-col justify-center space-y-2">
                        {article.status === "approved" && (
                            <>
                                <Button
                                    onClick={() => handleDisable(article.id)}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    Disable
                                </Button>
                                <Popup
                                    triggerText="Delete"
                                    title="Delete Article?"
                                    description="This action cannot be undone. The article will be permanently removed."
                                    confirmText="Yes, Delete"
                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                    triggerClass="bg-red-600 hover:bg-red-700 text-white"
                                    onConfirm={() => handleDelete(article.id)}
                                />
                            </>
                        )}
                        {article.status === "disabled" && (
                            <>
                                <Button
                                    onClick={() => handleEnable(article.id)}
                                    className="bg-green-600 hover:bg-green-800"
                                >
                                    Enable
                                </Button>
                                <Popup
                                    triggerText="Delete"
                                    title="Delete Article?"
                                    description="This action cannot be undone. The article will be permanently removed."
                                    confirmText="Yes, Delete"
                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                    triggerClass="bg-red-600 hover:bg-red-700 text-white"
                                    onConfirm={() => handleDelete(article.id)}
                                />
                            </>
                        )}
                        {article.status === "pending" && (
                            <>
                                <Popup
                                    triggerText="Approve"
                                    title="Approve Article?"
                                    description="This action cannot be undone. The article will be published and visible to users."
                                    confirmText="Yes, Approve"
                                    confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                    triggerClass="bg-green-600 hover:bg-green-700 text-white"
                                    onConfirm={() => handleApprove(article.id)}
                                />
                                <Button
                                    onClick={() => setRejectModalOpen(true)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {article.status === "rejected" && (
                            <>
                                <Popup
                                    triggerText="Delete"
                                    title="Delete Article?"
                                    description="This action cannot be undone. The article will be permanently removed."
                                    confirmText="Yes, Delete"
                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                    triggerClass="bg-red-600 hover:bg-red-700 text-white"
                                    onConfirm={() => handleDelete(article.id)}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Thumbnail */}
                {article.thumbnail_url && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Thumbnail
                        </h2>
                        <div
                            onClick={() =>
                                handleImageClick(article.thumbnail_url)
                            }
                        >
                            <img
                                src={article.thumbnail_url}
                                alt="Thumbnail"
                                className="max-w-sm rounded-lg border shadow"
                            />
                        </div>
                    </div>
                )}

                {/* Content grid */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Content</h2>
                    <div className="mx-auto w-full max-w-[900px]">
                        <div
                            className="grid gap-6"
                            style={{
                                gridTemplateColumns: `repeat(${Math.max(
                                    1,
                                    maxX
                                )}, minmax(0,1fr))`,
                            }}
                        >
                            {gridCells.map(({ x, y, idx }, i) => {
                                const blockIdx = idx;
                                const block =
                                    typeof blockIdx === "number" &&
                                    blockIdx >= 0
                                        ? blocks[blockIdx]
                                        : null;
                                return (
                                    <div
                                        key={`${y}-${x}`}
                                        className="rounded-md p-4 border bg-white min-h-[120px] break-words"
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
                                            {renderCellControls(
                                                { x, y },
                                                blockIdx
                                            )}
                                        </div>

                                        {block ? (
                                            block.type === "text" ? (
                                                editingId &&
                                                editingId ===
                                                    (block.id ??
                                                        `new-${blockIdx}`) ? (
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
                                                                onClick={
                                                                    cancelEdit
                                                                }
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
                                                <div className="w-full flex justify-center">
                                                    <div
                                                        className="w-full max-w-[320px] cursor-pointer"
                                                        onClick={() =>
                                                            handleImageClick(
                                                                block.preview || block.image_url
                                                            )
                                                        }
                                                    >
                                                        {block.preview ? (
                                                            <img
                                                                src={
                                                                    block.preview
                                                                }
                                                                alt={`Block ${x},${y}`}
                                                                className="w-full h-48 object-cover rounded-md"
                                                            />
                                                        ) : block.image_url ? (
                                                            <img
                                                                src={block.image_url}
                                                                alt={`Block ${x},${y}`}
                                                                className="w-full h-48 object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-400">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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
                </div>

                {/* Crop modal */}
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

                {/* Image preview modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                        onClick={handleCloseModal}
                    >
                        <div
                            className="relative max-w-5xl max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage}
                                alt="Full Preview"
                                className="w-auto max-w-full max-h-[90vh] object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>
            <Popup
                triggerText=""
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave edit mode? Your changes will be lost."
                confirmText="OK"
                open={unsavedPopupOpen}
                onConfirm={() => {
                    setUnsavedPopupOpen(false);
                    if (pendingAction === "back") {
                        cancelAll(); // reset dan keluar dari edit mode
                        handleBack();
                    } else if (pendingAction === "exit") {
                        cancelAll(); // reset dan keluar dari edit mode
                    }
                    setPendingAction(null);
                }}
                onClose={() => {
                    setUnsavedPopupOpen(false);
                    setPendingAction(null);
                }}
            />
            {rejectModalOpen && (
                <Popup
                    triggerText=""
                    title="Reject Article"
                    description=""
                    confirmText="Submit Rejection"
                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                    open={rejectModalOpen}
                    onConfirm={() => {
                        if (!rejectReason.trim()) {
                            setSuccessPopupMessage("Please provide a reason.");
                            setPopupType("reject-fail");
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
                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">
                            Reason for Rejection:
                        </label>
                        <textarea
                            className="w-full border rounded-md p-2 text-sm"
                            rows={4}
                            placeholder="Write your reason here..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                </Popup>
            )}
        </Layout_Admin>
    );
}
