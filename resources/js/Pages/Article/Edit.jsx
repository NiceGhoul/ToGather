import Layout_User from "@/Layouts/Layout_User";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
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

// 🔥 IMPORT MINI QUILL EDITOR
import MiniEditor from "@/Components/MiniEditor";

export default function Edit() {
    const { article } = usePage().props;

    // -------- STATES --------
    const [editingMode, setEditingMode] = useState(false);

    // All blocks
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

    const [extraRows, setExtraRows] = useState(0);
    const [editingIndex, setEditingIndex] = useState(null); // which block is being edited

    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    // -------- GRID STRUCTURE --------
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

    // -------- IMAGE HANDLING --------
    const onSelectImageForBlock = (file, idx) => {
        const url = URL.createObjectURL(file);
        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], newFile: file, preview: url };
            return copy;
        });
    };

    // -------- ADD BLOCK --------
    const addBlock = (type) => {
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
        setBlocks((prev) => {
            const removedY = prev[idx].order_y;
            let updated = prev.filter((_, i) => i !== idx);

            updated = updated.map((b) =>
                b.order_y > removedY ? { ...b, order_y: b.order_y - 1 } : b
            );

            return updated;
        });
    };

    const addRow = () => setExtraRows((r) => r + 1);

    // -------- START EDIT --------
    const startEdit = (idx) => {
        setEditingIndex(idx);
    };

    const applyEdit = (idx, value) => {
        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], content: value };
            return copy;
        });
        setEditingIndex(null);
    };

    const cancelEdit = () => setEditingIndex(null);

    // -------- SAVE --------
    const saveAllChanges = () => {
        const fd = new FormData();

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
                setSuccessPopupMessage("Article updated successfully!");
                setSuccessPopupOpen(true);
                setEditingMode(false);
                setEditingIndex(null);
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
        setEditingIndex(null);
        setEditingMode(false);
    };

    // -------- CELL UI --------
    const renderCellContent = (block, idx) => {
        if (!block) return <div className="text-gray-400 dark:text-gray-500">Empty</div>;

        // TEXT BLOCK
        if (block.type === "text") {
            // If this block is being edited → Show QUILL
            if (editingIndex === idx) {
                return (
                    <div>
                        <MiniEditor
                            value={block.content}
                            onChange={(html) => {
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

            // Normal view
            return (
                <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                        __html: block.content || "<i>Empty</i>",
                    }}
                />
            );
        }

        // IMAGE BLOCK
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
                        className="text-sm px-3 py-1"
                    >
                        <CaseSensitive />
                    </Button>

                    <Button className="relative px-3 py-1 text-sm">
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

        if (block.type === "text") {
            return (
                <div className="flex gap-2 mt-2">
                    <Button
                        className="bg-purple-700 text-white text-sm"
                        onClick={() => startEdit(idx)}
                    >
                        <Pencil />
                    </Button>

                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white text-sm"
                        onClick={() => removeBlock(idx)}
                    >
                        <Trash className="bg-red-600 hover:bg-red-700" />
                    </Button>
                </div>
            );
        }

        if (block.type === "image") {
            return (
                <div className="flex gap-2 mt-2">
                    <Button className="relative bg-purple-700 text-white text-sm">
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
                        className="bg-red-600 hover:bg-red-700 text-white text-sm"
                        onClick={() => removeBlock(idx)}
                    >
                        <X className="bg-red-600 hover:bg-red-700" />
                    </Button>
                </div>
            );
        }
    };

    // -------- RENDER --------
    return (
        <Layout_User>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{article.title}</h1>

                    <div className="flex gap-2">
                        <Button onClick={() => setEditingMode(!editingMode)}>
                            {editingMode ? (
                                <div className="flex items-center gap-2 text-xs">
                                    <PencilOff className="w-4 h-4" />
                                    Exit Edit
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs">
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </div>
                            )}
                        </Button>

                        {editingMode && (
                            <>
                                <Button
                                    className="bg-green-600 text-white"
                                    onClick={saveAllChanges}
                                >
                                    <Save className="w-4 h-4 mr-1" /> Save
                                </Button>

                                <Button
                                    className="bg-gray-400 text-white"
                                    onClick={cancelAll}
                                >
                                    <Ban className="w-4 h-4 mr-1" /> Cancel
                                </Button>

                                <Button onClick={addRow}>Add Row</Button>
                            </>
                        )}

                        <Button
                            className="bg-purple-800 text-white"
                            onClick={() => router.get("/articles/myArticles")}
                        >
                            <ArrowBigLeft />
                        </Button>
                    </div>
                </div>

                {/* GRID */}
                <div className="space-y-6">
                    {gridCells.map(({ x, y }, i) => {
                        // find block at order_y = y
                        const idx = blocks.findIndex((b) => b.order_y === y);
                        const block = idx >= 0 ? blocks[idx] : null;

                        return (
                            <div
                                key={i}
                                className="p-4 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm"
                            >
                                <div className="mb-2 text-xs text-gray-400 dark:text-gray-500">
                                    Grid (1, {y}) —
                                    {block
                                        ? block.type === "text"
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

                <Popup
                    triggerText=""
                    title={successPopupMessage}
                    confirmText="OK"
                    open={successPopupOpen}
                    onConfirm={() => {
                        setSuccessPopupOpen(false);
                        router.reload();
                    }}
                />
            </div>
        </Layout_User>
    );
}
