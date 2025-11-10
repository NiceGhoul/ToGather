import { usePage, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Popup from "@/Components/Popup";
import { Eye, EyeOff, Search, Trash, RotateCcw, File } from "lucide-react";

export default function Article_List() {
    const { articles, categories } = usePage().props;

    // 🔹 State untuk data dan filter
    const [allArticles, setAllArticles] = useState(articles || []);
    const [filteredArticles, setFilteredArticles] = useState(articles || []);
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    // 🔹 State lain tetap sama
    const [selectedIds, setSelectedIds] = useState([]);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    // 🧠 Filter frontend — otomatis jalan tiap kali search/category/status berubah
    useEffect(() => {
        let result = allArticles;

        // 🔹 Filter awal (hanya approved + disabled)
        if (status === "") {
            result = result.filter(
                (a) => a.status === "approved" || a.status === "disabled"
            );
        }
        // 🔹 Kalau klik tombol "Rejected"
        else if (status === "rejected") {
            result = result.filter((a) => a.status === "rejected");
        }
        // 🔹 Kalau filter lain (misalnya khusus "approved" aja)
        else {
            result = result.filter((a) => a.status === status);
        }

        // 🔹 Filter category
        if (category !== "") {
            result = result.filter((a) => a.category === category);
        }

        // 🔹 Filter search
        if (search.trim() !== "") {
            result = result.filter((a) =>
                a.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredArticles(result);
    }, [allArticles, search, category, status]);

    // 🔁 Reset filter
    const handleResetFilter = () => {
        setCategory("");
        setStatus("");
        setSearch("");
    };

    // 🔧 Aksi server (bulk & toggle)
    const handleDisable = (id) => router.post(`/admin/articles/${id}/disable`);
    const handleEnable = (id) => router.post(`/admin/articles/${id}/enable`);
    const handleDelete = (id) =>
        router.post(
            `/admin/articles/${id}/delete`,
            {},
            {
                onSuccess: () => {
                    setSelectedIds((prev) => prev.filter((x) => x !== id));
                    setSuccessPopupMessage("Article deleted");
                    setSuccessPopupOpen(true);
                    router.reload();
                },
            }
        );
    const handleView = (id) =>
        router.get(`/admin/articles/${id}/view?from=list`);

    // 🧩 Bulk logic
    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filteredArticles.map((a) => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkEnable = () =>
        selectedIds.length &&
        router.post(
            "/admin/articles/bulk-approve",
            { ids: selectedIds },
            { preserveState: true, onSuccess: () => setSelectedIds([]) }
        );
    const handleBulkDisable = () =>
        selectedIds.length &&
        router.post(
            "/admin/articles/bulk-disable",
            { ids: selectedIds },
            { preserveState: true, onSuccess: () => setSelectedIds([]) }
        );
    const handleBulkDelete = () =>
        selectedIds.length &&
        router.post(
            "/admin/articles/bulk-delete",
            { ids: selectedIds },
            {
                preserveState: true,
                onSuccess: () => {
                    setSelectedIds([]);
                    setSuccessPopupMessage("Selected articles deleted");
                    setSuccessPopupOpen(true);
                    router.reload();
                },
            }
        );

    // Auto close popup
    useEffect(() => {
        if (!successPopupOpen) return;
        const t = setTimeout(() => setSuccessPopupOpen(false), 3500);
        return () => clearTimeout(t);
    }, [successPopupOpen]);

    return (
        <Layout_Admin title="Manage Articles">
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
                {/* 🔎 Filter & Bulk Section */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    {/* Row 1: Search & Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[260px] focus-visible:ring-purple-700"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="h-10 w-[200px] rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-purple-700 focus:ring-2 focus:ring-purple-700/50 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <Button
                                onClick={handleResetFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Status filter buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                className={`${
                                    status === ""
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatus("")}
                            >
                                All
                            </Button>
                            <Button
                                className={`${
                                    status === "approved"
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatus("approved")}
                            >
                                Enabled
                            </Button>
                            <Button
                                className={`${
                                    status === "disabled"
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatus("disabled")}
                            >
                                Disabled
                            </Button>
                            <Button
                                className={`${
                                    status === "rejected"
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatus("rejected")}
                            >
                                Rejected
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Bulk actions */}
                    <div className="flex flex-wrap justify-end items-center gap-2 border-t pt-3">
                        <div className="text-sm mr-auto">
                            {selectedIds.length} selected
                        </div>

                        {/* 🔹 Tampilkan tombol Enable/Disable hanya kalau bukan status rejected */}
                        {status !== "rejected" && (
                            <>
                                <Popup
                                    triggerText={
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <Eye className="w-4 h-4" />
                                            <span>Enable Selected</span>
                                        </div>
                                    }
                                    title="Enable Selected Articles?"
                                    description="All selected articles will be enabled and shown publicly."
                                    confirmText="Yes, Enable Selected"
                                    confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                    triggerClass="bg-green-200 hover:bg-green-300 text-green-700"
                                    disabledValue={selectedIds.length === 0}
                                    onConfirm={handleBulkEnable}
                                />

                                <Popup
                                    triggerText={
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <EyeOff className="w-4 h-4" />
                                            <span>Disable Selected</span>
                                        </div>
                                    }
                                    title="Disable Selected Articles?"
                                    description="All selected articles will be disabled and hidden from public."
                                    confirmText="Yes, Disable Selected"
                                    confirmColor="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    triggerClass="bg-yellow-200 hover:bg-yellow-300 text-yellow-700"
                                    disabledValue={selectedIds.length === 0}
                                    onConfirm={handleBulkDisable}
                                />
                            </>
                        )}

                        {/* 🔸 Tombol Delete selalu muncul */}
                        <Popup
                            triggerText={
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Trash className="w-4 h-4" />
                                    <span>Delete Selected</span>
                                </div>
                            }
                            title="Delete Selected Articles?"
                            description="This action cannot be undone. All selected articles will be deleted permanently."
                            confirmText="Yes, Delete Selected"
                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                            disabledValue={selectedIds.length === 0}
                            onConfirm={handleBulkDelete}
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
                                            filteredArticles.length > 0 &&
                                            selectedIds.length ===
                                                filteredArticles.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2 border">Id</th>
                                <th className="px-4 py-2 border">Title</th>
                                <th className="px-4 py-2 border">Category</th>
                                <th className="px-4 py-2 border">Author</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((a) => (
                                    <tr key={a.id}>
                                        <td className="border px-4 py-2 text-center">
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
                                        <td className="border px-4 py-2">
                                            {a.id}
                                        </td>
                                        <td className="border px-4 py-2">
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
                                        <td className="border px-4 py-2 text-center">
                                            <div className="flex justify-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        handleView(a.id)
                                                    }
                                                    className="bg-purple-200 hover:bg-purple-300"
                                                >
                                                    <File className="text-purple-700" />
                                                </Button>
                                                {a.status === "approved" && (
                                                    <Button
                                                        className="bg-yellow-200 hover:bg-yellow-300"
                                                        onClick={() =>
                                                            handleDisable(a.id)
                                                        }
                                                    >
                                                        <EyeOff className="text-yellow-700" />
                                                    </Button>
                                                )}
                                                {a.status === "disabled" && (
                                                    <Button
                                                        className="bg-green-200 hover:bg-green-300"
                                                        onClick={() =>
                                                            handleEnable(a.id)
                                                        }
                                                    >
                                                        <Eye className="text-green-700" />
                                                    </Button>
                                                )}
                                                <Popup
                                                    triggerText={
                                                        <Trash className="w-4 h-4" />
                                                    }
                                                    title="Delete Article?"
                                                    description="This action cannot be undone. The article will be permanently removed."
                                                    confirmText="Yes, Delete"
                                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                    triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
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
                                        colSpan="7"
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
