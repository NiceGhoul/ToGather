import Layout_User from "@/Layouts/Layout_User";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import Popup from "@/Components/Popup";
import {
    Pencil,
    PencilOff,
    Save,
    Ban,
    ArrowBigLeft,
    CaseSensitive,
    X,
    Check,
    Trash,
    Image as ImageIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import MiniEditor from "@/Components/MiniEditor";

export default function Edit() {
    const { article } = usePage().props;

    // ------------------------ STATES ------------------------
    const [editingMode, setEditingMode] = useState(false);
    const [isDirty, setIsDirty] = useState(false); // track unsaved changes
    const [confirmExitOpen, setConfirmExitOpen] = useState(false);
    const [exitAction, setExitAction] = useState(() => null);

    const [blocks, setBlocks] = useState(() =>
        (article.contents || []).map((c) => ({
            id: c.id ?? null,
            type: c.type,
            content: c.image_url || c.content || null,

            order_x: Number(c.order_x),
            order_y: Number(c.order_y),
            newFile: null,
            preview: c.image_url || null,
        }))
    );

    const [extraRows, setExtraRows] = useState(0);
    const [editingIndex, setEditingIndex] = useState(null);

    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    // ------------------------ GRID STRUCTURE ------------------------
    const { maxY, gridCells } = useMemo(() => {
        const ys = blocks.map((b) => b.order_y || 1);
        const rawMaxY = Math.max(1, ...(ys.length ? ys : [1]));
        const computedMaxY = rawMaxY + extraRows;

        const cells = [];
        for (let y = 1; y <= computedMaxY; y++) {
            cells.push({ x: 1, y });
        }

        return { maxY: computedMaxY, gridCells: cells };
    }, [blocks, extraRows]);

    // ------------------------ IMAGE HANDLING ------------------------
    const onSelectImageForBlock = (file, idx) => {
        setIsDirty(true);
        const url = URL.createObjectURL(file);

        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], newFile: file, preview: url };
            return copy;
        });
    };

    // ------------------------ ADD BLOCK ------------------------
    const addBlock = (type) => {
        setIsDirty(true);

        const nextY = blocks.length + 1;
        setBlocks((prev) => [
            ...prev,
            {
                id: null,
                type,
                content: "",
                order_x: 1,
                order_y: nextY,
                newFile: null,
                preview: null,
            },
        ]);

        setEditingMode(true);
    };

    const removeBlock = (idx) => {
        setIsDirty(true);

        setBlocks((prev) => {
            const removedY = prev[idx].order_y;
            let updated = prev.filter((_, i) => i !== idx);

            updated = updated.map((b) =>
                b.order_y > removedY ? { ...b, order_y: b.order_y - 1 } : b
            );

            return updated;
        });
    };

    const addRow = () => {
        setIsDirty(true);
        setExtraRows((r) => r + 1);
    };

    // ------------------------ EDIT TEXT ------------------------
    const startEdit = (idx) => setEditingIndex(idx);

    const applyEdit = (idx, value) => {
        setIsDirty(true);

        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], content: value };
            return copy;
        });

        setEditingIndex(null);
    };

    const cancelEdit = () => setEditingIndex(null);

    // ------------------------ SAVE ------------------------
    const saveAllChanges = () => {
        const fd = new FormData();

        blocks.forEach((b, i) => {
            fd.append(`contents[${i}][id]`, b.id ?? "");
            fd.append(`contents[${i}][type]`, b.type);
            fd.append(`contents[${i}][order_x]`, b.order_x);
            fd.append(`contents[${i}][order_y]`, b.order_y);

            if (b.type === "text" || b.type === "paragraph") {
                // === TEXT ===
                fd.append(`contents[${i}][content]`, b.content ?? "");
            } else if (b.newFile) {
                // === IMAGE (NEW FILE) ===
                fd.append(`contents[${i}][content]`, b.newFile);
            } else {
                // === IMAGE (USE OLD URL) ===
                fd.append(`contents[${i}][content]`, b.content ?? "");
            }
        });

        router.post(`/articles/${article.id}/update`, fd, {
            forceFormData: true,
            onSuccess: () => {
                setSuccessPopupMessage("Article updated successfully!");
                setSuccessPopupOpen(true);
                setEditingMode(false);
                setEditingIndex(null);
                setIsDirty(false);
            },
        });
    };

    // ------------------------ CANCEL ALL ------------------------
    const cancelAll = () => {
        setBlocks(
            (article.contents || []).map((c) => ({
                id: c.id ?? null,
                type: c.type,
                content: c.image_url || c.content || null,
                preview: c.image_url || null,
                order_x: Number(c.order_x),
                order_y: Number(c.order_y),
                newFile: null,
                preview: c.image_url || null,
            }))
        );

        setEditingMode(false);
        setEditingIndex(null);
        setIsDirty(false);
    };

    // ------------------------ REQUEST EXIT ------------------------
    const requestExit = (callback) => {
        if (editingMode && isDirty) {
            setExitAction(() => callback);
            setConfirmExitOpen(true);
        } else {
            callback();
        }
    };

    // ------------------------ RENDER CELL CONTENT ------------------------
    const renderCellContent = (block, idx) => {
        if (!block) return <div className="text-gray-400 dark:text-gray-500">Empty</div>;

        if (block.type === "text" || block.type === "paragraph") {
            if (editingIndex === idx) {
                return (
                    <div>
                        <MiniEditor
                            value={block.content}
                            onChange={(html) => {
                                setIsDirty(true);
                                setBlocks((prev) => {
                                    const copy = [...prev];
                                    copy[idx] = { ...copy[idx], content: html };
                                    return copy;
                                });
                            }}
                        />

                        <div className="flex gap-2 mt-2">
                            <Button
                                onClick={() => applyEdit(idx, block.content)}
                                className="bg-purple-800 hover:bg-purple-600"
                            >
                                <Check className="text-white" />
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={cancelEdit}
                            >
                                <X />
                            </Button>
                        </div>
                    </div>
                );
            }

            return (
                <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                        __html: block.content || "<i>Empty</i>",
                    }}
                />
            );
        }

        return (
            <div className="mt-2">
                {block.preview ? (
                    <img
                        src={block.preview}
                        className="w-full rounded-md shadow"
                    />
                ) : (
                    <div className="text-gray-400 dark:text-gray-500">No Image</div>
                )}
            </div>
        );
    };

    const renderControls = (block, idx) => {
        if (!editingMode) return null;
        if (editingIndex === idx) return null;

        if (!block) {
            return (
                <div className="flex gap-2 mt-2">
                    <Button
                        onClick={() => addBlock("text")}
                        className="bg-purple-800 text-white hover:bg-purple-700"
                    >
                        <CaseSensitive />
                    </Button>

                    <Button className="relative bg-purple-800 text-white hover:bg-purple-700">
                        <ImageIcon />
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                addBlock("image");
                                const newIndex = blocks.length;
                                onSelectImageForBlock(file, newIndex);
                            }}
                        />
                    </Button>
                </div>
            );
        }

        if (block.type === "text" || block.type === "paragraph") {
            return (
                <div className="flex gap-2 mt-2">
                    <Button
                        className="bg-purple-800 text-white hover:bg-purple-700"
                        onClick={() => startEdit(idx)}
                    >
                        <Pencil />
                    </Button>

                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => removeBlock(idx)}
                    >
                        <Trash />
                    </Button>
                </div>
            );
        }

        if (block.type === "image") {
            return (
                <div className="flex gap-2 mt-2">
                    <Button className="relative bg-purple-800 text-white hover:bg-purple-700">
                        <ImageIcon />
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) onSelectImageForBlock(f, idx);
                            }}
                        />
                    </Button>

                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => removeBlock(idx)}
                    >
                        <Trash />
                    </Button>
                </div>
            );
        }
    };

    // ------------------------ RENDER ------------------------
    return (
        <Layout_User>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{article.title}</h1>

                    <div className="flex gap-2">
                        {/* EXIT EDIT BUTTON */}
                        <Button
                            onClick={() =>
                                requestExit(() => {
                                    setEditingMode(!editingMode);
                                    setEditingIndex(null);
                                    router.reload();
                                })
                            }
                            className="bg-purple-800 text-white hover:bg-purple-700"
                        >
                            {editingMode ? (
                                <>
                                    <PencilOff className="w-4 h-4 mr-1" /> Exit
                                    Edit
                                </>
                            ) : (
                                <>
                                    <Pencil className="w-4 h-4 mr-1" /> Edit
                                </>
                            )}
                        </Button>

                        {editingMode && (
                            <>
                                <Button
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    onClick={saveAllChanges}
                                >
                                    <Save className="w-4 h-4 mr-1" /> Save
                                </Button>

                                <Button
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() =>
                                        requestExit(() => {
                                            cancelAll();
                                            setEditingIndex(null); // ⬅️ FIX
                                            router.reload();
                                        })
                                    }
                                >
                                    <Ban className="w-4 h-4 mr-1" /> Cancel
                                </Button>

                                <Button
                                    onClick={() => {
                                        setIsDirty(true);
                                        addRow();
                                    }}
                                    className="bg-purple-800 hover:bg-purple-700"
                                >
                                    Add Row
                                </Button>
                            </>
                        )}

                        {/* BACK BUTTON */}
                        <Button
                            className="bg-purple-800 text-white hover:bg-purple-700"
                            onClick={() =>
                                requestExit(() => {
                                    router.get(
                                        `/articles/${article.id}/details`
                                    );
                                    router.reload();
                                })
                            }
                        >
                            <ArrowBigLeft />
                        </Button>
                    </div>
                </div>

                {/* GRID */}
                <div className="space-y-6">
                    {gridCells.map(({ y }, i) => {
                        const idx = blocks.findIndex((b) => b.order_y === y);
                        const block = idx >= 0 ? blocks[idx] : null;

                        return (
                            <div
                                key={i}
                                className="p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
                            >
                                <div className="mb-2 text-xs text-gray-400">
                                    Block ({y}) —{" "}
                                    {block
                                        ? block.type === "text" ||
                                          block.type === "paragraph"
                                            ? "Text"
                                            : "Image"
                                        : "Empty"}
                                </div>

                                {renderCellContent(block, idx)}
                                {renderControls(block, idx)}
                            </div>
                        );
                    })}
                </div>

                {/* SUCCESS POPUP (UNCONTROLLED) */}
                {successPopupOpen && (
                    <Popup
                        title={successPopupMessage}
                        confirmText="OK"
                        showCancel={false}
                        description="Article has been saved and is now pending verification."
                        onConfirm={() => {
                            setSuccessPopupOpen(false);
                            router.reload();
                        }}
                        onClose={() => setSuccessPopupOpen(false)}
                    />
                )}

                {/* EXIT CONFIRMATION POPUP (UNCONTROLLED, ALWAYS WORKS) */}
                {confirmExitOpen && (
                    <Popup
                        title="Unsaved Changes"
                        confirmText="Exit"
                        cancelText="Stay"
                        description="Are you sure you want to exit editing mode? All unsaved changes will be lost."
                        onConfirm={() => {
                            setConfirmExitOpen(false);
                            exitAction?.();
                            cancelAll();
                            router.reload();
                            setIsDirty(false);
                        }}
                        onClose={() => setConfirmExitOpen(false)}
                    />
                )}
            </div>
        </Layout_User>
    );
}
