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
    Rows2,
    Columns2,
    CaseSensitive,
    X,
    Image as ImageIcon,
} from "lucide-react";
import { useState, useMemo, useRef } from "react";

export default function Edit() {
    const { article } = usePage().props;

    // -------- STATES --------
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
    const [editingId, setEditingId] = useState(null);
    const editableRef = useRef(null);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    // -------- GRID STRUCTURE --------
    const { maxX, maxY, gridCells } = useMemo(() => {
        const xs = blocks.map((b) => b.order_x || 1);
        const ys = blocks.map((b) => b.order_y || 1);
        const rawMaxX = Math.max(1, ...(xs.length ? xs : [1]));
        const rawMaxY = Math.max(1, ...(ys.length ? ys : [1]));
        const computedMaxX = Math.min(2, rawMaxX + extraCols);
        const computedMaxY = rawMaxY + extraRows;

        const cells = [];
        for (let y = 1; y <= computedMaxY; y++) {
            for (let x = 1; x <= computedMaxX; x++) {
                let idx = blocks.findIndex(
                    (b) => Number(b.order_x) === x && Number(b.order_y) === y
                );
                if (idx === -1) idx = null;
                cells.push({ x, y, idx });
            }
        }
        return { maxX: computedMaxX, maxY: computedMaxY, gridCells: cells };
    }, [blocks, extraCols, extraRows]);

    // -------- TEXT EDITING --------
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

    // -------- IMAGE HANDLING (tanpa crop) --------
    const onSelectImageForBlock = (file, idx) => {
        const url = URL.createObjectURL(file);
        setBlocks((prev) => {
            const copy = [...prev];
            copy[idx] = {
                ...copy[idx],
                newFile: file,
                preview: url,
            };
            return copy;
        });
    };

    // -------- GRID ACTIONS --------
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
            let updated = prev.filter(
                (b) =>
                    !(
                        b.order_x === target.order_x &&
                        b.order_y === target.order_y
                    )
            );

            const rowStillExists = updated.some(
                (b) => b.order_y === target.order_y
            );
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

    const addRow = () => setExtraRows((r) => r + 1);
    const addColumn = () => {
        if (maxX >= 2) return;
        setExtraCols((c) => c + 1);
    };

    // -------- SAVE / CANCEL --------
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

    // -------- RENDER CELL CONTROLS --------
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
                            <CaseSensitive />
                        </Button>
                        <Button className="relative px-3 py-1 text-sm h-auto">
                            <ImageIcon />
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setBlocks((prev) => [
                                        ...prev,
                                        {
                                            id: null,
                                            type: "image",
                                            content: null,
                                            order_x: cell.x,
                                            order_y: cell.y,
                                            newFile: file,
                                            preview: URL.createObjectURL(file),
                                        },
                                    ]);
                                }}
                            />
                        </Button>
                    </>
                ) : (
                    <>
                        {blocks[idxInBlocks].type === "text" ? (
                            <>
                                <Button
                                    className="text-white text-sm px-3 py-1 h-auto bg-purple-700"
                                    onClick={() => startEdit(idxInBlocks)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => removeBlock(idxInBlocks)}
                                    className="bg-red-600 text-white text-sm px-2 py-1 h-auto"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="relative inline-block">
                                    <Button
                                        type="button"
                                        className="bg-purple-700 text-white text-sm px-3 py-1 h-auto"
                                    >
                                        <ImageIcon />
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
                                    <X />
                                </Button>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };

    // -------- RENDER --------
    return (
        <Layout_User>
            <div className="p-6 space-y-6 max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col gap-3 items-start">
                    <h1 className="text-2xl font-bold">{article.title}</h1>
                    <div className="flex gap-2 w-full justify-end">
                        <Button onClick={() => setEditingMode((prev) => !prev)}>
                            {editingMode ? (
                                <div className="flex items-center gap-2 text-xs">
                                    <PencilOff className="w-4 h-4" />
                                    <span>Exit Edit</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs">
                                    <Pencil className="w-4 h-4" />
                                    <span>Edit</span>
                                </div>
                            )}
                        </Button>

                        {editingMode && (
                            <>
                                <Button
                                    onClick={saveAllChanges}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </div>
                                </Button>
                                <Button
                                    onClick={cancelAll}
                                    className="bg-gray-400 hover:bg-red-600 text-white"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <Ban className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </div>
                                </Button>
                                <Button onClick={addRow}>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Rows2 className="w-4 h-4" />
                                        <span>Add Row</span>
                                    </div>
                                </Button>
                                <Button
                                    onClick={addColumn}
                                    disabled={maxX >= 2}
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <Columns2 className="w-4 h-4" />
                                        <span>Add Column</span>
                                    </div>
                                </Button>
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

                {/* GRID CONTENT */}
                <div className="mx-auto w-full max-w-[900px]">
                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns: `repeat(${Math.max(
                                1,
                                maxX
                            )}, minmax(0, 1fr))`,
                        }}
                    >
                        {gridCells.map(({ x, y, idx }) => {
                            const blockIdx = idx;
                            const block =
                                typeof blockIdx === "number" && blockIdx >= 0
                                    ? blocks[blockIdx]
                                    : null;
                            return (
                                <div
                                    key={`${y}-${x}`}
                                    className="rounded-md p-4 border bg-white min-h-[120px]"
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
                                            <div className="w-full flex justify-center">
                                                <div className="w-full overflow-hidden rounded-md">
                                                    <img
                                                        src={
                                                            block.preview ||
                                                            block.image_url
                                                        }
                                                        alt={`Block ${x},${y}`}
                                                        className="w-full h-64 object-cover object-center rounded-md shadow-sm"
                                                    />
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

                {/* SUCCESS POPUP */}
                <Popup
                    triggerText=""
                    title={successPopupMessage}
                    description=""
                    confirmText="OK"
                    open={successPopupOpen}
                    onConfirm={() => {
                        setSuccessPopupOpen(false);
                        router.reload();
                    }}
                    onClose={() => setSuccessPopupOpen(false)}
                />
            </div>
        </Layout_User>
    );
}
