import { usePage, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Popup from "@/Components/Popup";
import {
    Eye,
    EyeOff,
    Search,
    Trash,
    RotateCcw,
    File,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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

    // 🔹 Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10; // jumlah artikel per halaman

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
        setCurrentPage(1); // reset ke halaman 1 saat filter berubah
    }, [allArticles, search, category, status]);

    // 🧩 Pagination logic
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const currentArticles = filteredArticles.slice(
        startIndex,
        startIndex + articlesPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedIds([]); // reset selection tiap ganti halaman
        }
    };

    // 🔁 Reset filter
    const handleResetFilter = () => {
        setCategory("");
        setStatus("");
        setSearch("");
    };

    // 🔧 Aksi server (bulk & toggle)
    const handleDisable = (id) =>
        router.post(
            `/admin/articles/${id}/disable`,
            {},
            {
                onSuccess: () => {
                    setAllArticles((prev) =>
                        prev.map((a) =>
                            a.id === id ? { ...a, status: "disabled" } : a
                        )
                    );
                },
            }
        );

    const handleEnable = (id) =>
        router.post(
            `/admin/articles/${id}/enable`,
            {},
            {
                onSuccess: () => {
                    setAllArticles((prev) =>
                        prev.map((a) =>
                            a.id === id ? { ...a, status: "approved" } : a
                        )
                    );
                },
            }
        );

    const handleDelete = (id) =>
        router.post(
            `/admin/articles/${id}/delete`,
            {},
            {
                onSuccess: () => {
                    setSelectedIds((prev) => prev.filter((x) => x !== id));
                    setAllArticles((prev) => prev.filter((a) => a.id !== id));
                    setSuccessPopupMessage("Article deleted");
                    setSuccessPopupOpen(true);
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
            {
                onSuccess: () => {
                    setAllArticles((prev) =>
                        prev.map((a) =>
                            selectedIds.includes(a.id)
                                ? { ...a, status: "approved" }
                                : a
                        )
                    );
                    setSelectedIds([]);
                },
            }
        );

    const handleBulkDisable = () =>
        selectedIds.length &&
        router.post(
            "/admin/articles/bulk-disable",
            { ids: selectedIds },
            {
                onSuccess: () => {
                    setAllArticles((prev) =>
                        prev.map((a) =>
                            selectedIds.includes(a.id)
                                ? { ...a, status: "disabled" }
                                : a
                        )
                    );
                    setSelectedIds([]);
                },
            }
        );
    const handleBulkDelete = () =>
        selectedIds.length &&
        router.post(
            "/admin/articles/bulk-delete",
            { ids: selectedIds },
            {
                onSuccess: () => {
                    setAllArticles((prev) =>
                        prev.filter((a) => !selectedIds.includes(a.id))
                    );
                    setSelectedIds([]);
                    setSuccessPopupMessage("Selected articles deleted");
                    setSuccessPopupOpen(true);
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
                description="Article has been successfully deleted"
                confirmText="OK"
                open={successPopupOpen}
                onConfirm={() => setSuccessPopupOpen(false)}
                onClose={() => setSuccessPopupOpen(false)}
                confirmColor="bg-purple-600 hover:bg-purple-700 text-white"
            />

            <div className="p-6 space-y-6">
                {/* Filter & Bulk Section */}
                <div className="bg-purple-200 dark:bg-purple-800 p-4 rounded-lg shadow-md space-y-4">
                    {/* Row 1: Search & Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[260px] focus-visible:ring-purple-700 bg-white dark:bg-purple-200 dark:placeholder-purple-600"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="h-10 w-[200px] rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-purple-200 px-3 text-sm text-gray-700 dark:text-purple-600 shadow-sm focus:border-purple-700 focus:ring-1 focus:ring-purple-700/50 focus:outline-none"
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
                                className="bg-purple-800 hover:bg-purple-700 text-white dark:bg-purple-400 dark:text-black dark:hover:bg-purple-300"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Status filter buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                className={`${
                                    status === ""
                                        ? "bg-purple-800 text-white dark:bg-purple-400 dark:text-black"
                                        : "bg-purple-400 text-white dark:bg-purple-300 dark:text-black"
                                } hover:bg-purple-800 dark:hover:bg-purple-400`}
                                onClick={() => setStatus("")}
                            >
                                All
                            </Button>
                            <Button
                                className={`${
                                    status === "approved"
                                        ? "bg-purple-800 text-white dark:bg-purple-400 dark:text-black"
                                        : "bg-purple-400 text-white dark:bg-purple-300 dark:text-black"
                                } hover:bg-purple-800 dark:hover:bg-purple-400`}
                                onClick={() => setStatus("approved")}
                            >
                                Enabled
                            </Button>
                            <Button
                                className={`${
                                    status === "disabled"
                                        ? "bg-purple-800 text-white dark:bg-purple-400 dark:text-black"
                                        : "bg-purple-400 text-white dark:bg-purple-300 dark:text-black"
                                } hover:bg-purple-800 dark:hover:bg-purple-400`}
                                onClick={() => setStatus("disabled")}
                            >
                                Disabled
                            </Button>
                            <Button
                                className={`${
                                    status === "rejected"
                                        ? "bg-purple-800 text-white dark:bg-purple-400 dark:text-black"
                                        : "bg-purple-400 text-white dark:bg-purple-300 dark:text-black"
                                } hover:bg-purple-800 dark:hover:bg-purple-400`}
                                onClick={() => setStatus("rejected")}
                            >
                                Rejected
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Bulk actions */}
                    <div className="flex flex-wrap justify-end items-center gap-2 border-t border-black dark:border-purple-200 pt-3">
                        <div className="text-sm mr-auto dark:text-purple-200">
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
                                    triggerClass="bg-green-200 hover:bg-green-300 text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
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
                                    triggerClass="bg-yellow-200 hover:bg-yellow-300 text-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 dark:text-white"
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
                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                            disabledValue={selectedIds.length === 0}
                            onConfirm={handleBulkDelete}
                        />
                    </div>
                </div>

                {/* Articles Table */}
                <div className="bg-purple-200 dark:bg-purple-800 rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[42rem]">
                    <table className="min-w-full border dark:border-gray-700 dark:bg-purple-200">
                        <thead className="bg-purple-100 dark:bg-purple-600">
                            <tr>
                                <th className="px-4 py-2 border dark:border-gray-700 w-12 text-center dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={
                                            currentArticles.length > 0 &&
                                            selectedIds.length ===
                                                currentArticles.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Id
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Title
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Category
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Author
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Status
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentArticles.length > 0 ? (
                                currentArticles.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-gray-50 dark:hover:bg-purple-300"
                                    >
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
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
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {a.id}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {a.title}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {a.category}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {a.user?.nickname || a.user?.name}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 capitalize dark:text-black">
                                            {a.status === "approved"
                                                ? "Approved and Enabled"
                                                : a.status}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                            <div className="flex justify-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        handleView(a.id)
                                                    }
                                                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 dark:text-white"
                                                >
                                                    <File />
                                                </Button>
                                                {a.status === "approved" && (
                                                    <Button
                                                        className="bg-yellow-200 hover:bg-yellow-300 text-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 dark:text-white"
                                                        onClick={() =>
                                                            handleDisable(a.id)
                                                        }
                                                    >
                                                        <EyeOff />
                                                    </Button>
                                                )}
                                                {a.status === "disabled" && (
                                                    <Button
                                                        className="bg-green-200 hover:bg-green-300 text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
                                                        onClick={() =>
                                                            handleEnable(a.id)
                                                        }
                                                    >
                                                        <Eye />
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
                                                    triggerClass="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
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
                                        className="text-center py-4 text-gray-500 dark:text-gray-400 italic border dark:border-gray-700"
                                    >
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500 dark:text-purple-200">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                className="bg-white text-black hover:bg-gray-100 dark:bg-purple-200 dark:text-black dark:hover:bg-purple-300"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                            </Button>
                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`${
                                        currentPage === i + 1
                                            ? "bg-purple-800 text-white hover:bg-purple-800 dark:bg-purple-400 dark:text-black dark:hover:bg-purple-400"
                                            : "bg-purple-300 text-white hover:bg-purple-800 hover:text-white dark:bg-purple-300 dark:text-black dark:hover:bg-purple-400"
                                    }
                                        font-medium transition-colors duration-200`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                className="bg-white text-black hover:bg-gray-100 dark:bg-purple-200 dark:text-black dark:hover:bg-purple-300"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout_Admin>
    );
}
