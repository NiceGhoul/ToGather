import { usePage, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Popup from "@/Components/Popup";

export default function Article_List() {
    const { articles, categories, filters } = usePage().props;
    const [category, setCategory] = useState(filters.category || "");
    const [status, setStatus] = useState(filters.status || "");
    const [search, setSearch] = useState(filters.search || "");

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
        router.post(`/admin/articles/${id}/delete`);
    };

    const handleView = (id) => {
        router.get(`/admin/articles/${id}/view`);
    };
    const handleEnable = (id) => {
        router.post(`/admin/articles/${id}/approve`);
    };

    return (
        <Layout_Admin title="Manage Articles">
            <div className="p-6 space-y-6">
                {/* 🔎 Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow-md grid md:grid-cols-5 gap-5">
                    <div className="searchParameter flex flex-row gap-6 md:col-span-3">
                        {/* Search */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 w-full"
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
                                className="border border-gray-300 rounded px-3 py-2 w-full"
                            >
                                <option value="">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="disabled">Disabled</option>
                            </select>
                        </div>
                        {/* Filter Button */}
                        <div className="flex flex-row items-center gap-3">
                            <Button
                                onClick={handleFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white w-35 rounded-md"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                onClick={handleResetFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white w-35 rounded-md"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 🗂️ Articles Table */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
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
                                            {a.status}
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
                                                        className="bg-green-600 hover:bg-green-700 w-18"
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
                                        colSpan="5"
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
