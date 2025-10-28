import { usePage, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Popup from "@/Components/Popup";

export default function Article_List() {
    const { articles, categories, filters } = usePage().props;
    const [category, setCategory] = useState(filters.category || "");
    const [status, setStatus] = useState(filters.status || "");
    const [search, setSearch] = useState(filters.search || "");
    const [selectedIds, setSelectedIds] = useState([]);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    const handleFilter = () => {
        router.get(
            "/admin/articles/list",
            { category, status, search },
            { preserveState: true }
        );
    };

    const handleResetFilter = () => {
        setCategory("");
        setStatus("");
        setSearch("");
        router.get(
            "/admin/articles/list",
            { category: "", status: "", search: "" },
            { preserveState: true }
        );
    };
    const handleDisable = (id) => {
        router.post(`/admin/articles/${id}/disable`);
    };
    const handleDelete = (id) => {
        router.post(
            `/admin/articles/${id}/delete`,
            {},
            {
                onSuccess: () => {
                    // hapus id dari selection supaya counter update segera
                    setSelectedIds((prev) => prev.filter((x) => x !== id));

                    setSuccessPopupMessage("Article deleted");
                    setSuccessPopupOpen(true);

                    // optional: reload untuk memastikan data sinkron dengan server
                    router.reload();
                },
                onError: (errors) => {
                    setSuccessPopupMessage("Delete failed");
                    setSuccessPopupOpen(true);
                    console.error("Delete error:", errors);
                },
            }
        );
    };

    const handleView = (id) => {
        router.get(`/admin/articles/${id}/view?from=list`);
    };
    const handleEnable = (id) => {
        router.post(`/admin/articles/${id}/approve`);
    };

    // Bulk handlers
    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(articles.map((a) => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkEnable = () => {
        if (selectedIds.length === 0) return;
        router.post(
            "/admin/articles/bulk-approve",
            { ids: selectedIds },
            {
                preserveState: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const handleBulkDisable = () => {
        if (selectedIds.length === 0) return;
        router.post(
            "/admin/articles/bulk-disable",
            { ids: selectedIds },
            {
                preserveState: true,
                onSuccess: () => setSelectedIds([]),
            }
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;

        router.post(
            "/admin/articles/bulk-delete",
            { ids: selectedIds },
            {
                preserveState: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setSuccessPopupMessage("Selected articles deleted");
                    setSuccessPopupOpen(true);
                    router.reload(); // refresh list
                },
            }
        );
    };

    // optional: auto-close popup after X ms (remove if you want manual close)
    useEffect(() => {
        if (!successPopupOpen) return;
        const t = setTimeout(() => setSuccessPopupOpen(false), 3500);
        return () => clearTimeout(t);
    }, [successPopupOpen]);

    return (
        <Layout_Admin title="Manage Articles">
            {/* success popup (re-usable Popup component) */}
            <Popup
                triggerText=""
                title={successPopupMessage}
                description=""
                confirmText="OK"
                open={successPopupOpen}
                onConfirm={() => setSuccessPopupOpen(false)}
                onClose={() => setSuccessPopupOpen(false)}
                triggerClass=""
            />
            <div className="p-6 space-y-6">
                {/* 🔎 Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    {/* Row 1: Search & Filter */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="min-w-[200px]"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 min-w-[160px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 min-w-[160px]"
                            >
                                <option value="">All Approved Article</option>
                                <option value="approved">Enabled</option>
                                <option value="disabled">Disabled</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Filter Button */}
                        <div className="flex flex-row items-center gap-3">
                            <Button
                                onClick={handleFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white rounded-md"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                onClick={handleResetFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white rounded-md"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Bulk action buttons */}
                    <div className="flex flex-wrap justify-start items-center gap-2 border-t pt-3">
                        <div className="text-sm mr-2">
                            {selectedIds.length} selected
                        </div>
                        <Popup
                            triggerText="Enable Selected"
                            title="Enable All Selected Article?"
                            description="All selected articles will be enabled and will be shown publicly."
                            confirmText="Yes, Enable All"
                            confirmColor="bg-green-600 hover:bg-green-700 text-white"
                            triggerClass="bg-green-600 hover:bg-green-700 text-white"
                            disabledValue={selectedIds.length === 0}
                            onConfirm={() => handleBulkEnable()}
                        />
                        <Popup
                            triggerText="Disable Selected"
                            title="Disable All Selected Article?"
                            description="All selected articles will be disabled and will be hidden from public."
                            confirmText="Yes, Disable All"
                            confirmColor="bg-yellow-600 hover:bg-yellow-700 text-white"
                            triggerClass="bg-yellow-600 hover:bg-yellow-700 text-white"
                            disabledValue={selectedIds.length === 0}
                            onConfirm={() => handleBulkDisable()}
                        />
                        <Popup
                            triggerText="Delete Selected"
                            title="Delete All Selected Article?"
                            description="This action cannot be undone. All selected articles will be deleted permanently."
                            confirmText="Yes, Delete All"
                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                            triggerClass="bg-red-600 hover:bg-red-700 text-white"
                            disabledValue={selectedIds.length === 0}
                            onConfirm={() => handleBulkDelete()}
                        />
                    </div>
                </div>

                {/* 🗂️ Articles Table */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            articles.length > 0 &&
                                            selectedIds.length ===
                                                articles.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2 border w-100">
                                    Title
                                </th>
                                <th className="px-4 py-2 border">Category</th>
                                <th className="px-4 py-2 border">Author</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length > 0 ? (
                                articles.map((a) => (
                                    <tr key={a.id}>
                                        <td className="border px-4 py-2 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    a.id
                                                )}
                                                onChange={() =>
                                                    handleToggle(a.id)
                                                }
                                            />
                                        </td>
                                        <td className="border px-4 py-2 w-150">
                                            {a.title}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {a.category}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {a.user?.nickname || a.user?.name}
                                        </td>
                                        <td className="border px-4 py-2 capitalize">
                                            {a.status === "approved"
                                                ? "Approved and Enabled"
                                                : a.status}
                                        </td>
                                        <td className="border px-4 py-2 text-center gap-2">
                                            <div className="actionBtnContainer flex flex-row justify-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        handleView(a.id)
                                                    }
                                                    className="bg-purple-800 hover:bg-purple-700 text-white w-18"
                                                >
                                                    View
                                                </Button>
                                                {a.status === "approved" && (
                                                    <Button
                                                        className="bg-yellow-600 hover:bg-yellow-700 w-18"
                                                        onClick={() =>
                                                            handleDisable(a.id)
                                                        }
                                                    >
                                                        Disable
                                                    </Button>
                                                )}
                                                {a.status === "disabled" && (
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700 w-18"
                                                        onClick={() =>
                                                            handleEnable(a.id)
                                                        }
                                                    >
                                                        Enable
                                                    </Button>
                                                )}
                                                <Popup
                                                    triggerText="Delete"
                                                    title="Delete Article?"
                                                    description="This action cannot be undone. The article will be permanently removed."
                                                    confirmText="Yes, Delete"
                                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                    triggerClass="bg-red-600 hover:bg-red-700 text-white w-18"
                                                    onConfirm={() =>
                                                        handleDelete(a.id)
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-4 text-gray-500 italic"
                                    >
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout_Admin>
    );
}
