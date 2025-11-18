import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Popup from "@/Components/Popup";
import {
    Ban,
    CheckCircle,
    RotateCcw,
    Search,
    Check,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function User_List() {
    const { users } = usePage().props;

    const [popupMessage, setPopupMessage] = useState("");
    const [popupDescription, setPopupDescription] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);

    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // 🔹 Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10; // jumlah data per halaman

    // 🧩 Filtered data
    const filteredUsers = users.filter((u) => {
        if (statusFilter !== "all" && u.status !== statusFilter) return false;
        if (search) {
            const term = search.toLowerCase();
            return (
                u.nickname?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term)
            );
        }
        return true;
    });

    // 🧩 Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedIds([]); // reset selection tiap ganti halaman
        }
    };

    // 🧩 Toggle Status per user
    const handleToggleStatus = (user) => {
        const url = `/admin/users/${user.id}/${
            user.status === "banned" ? "unblock" : "block"
        }`;
        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    const isBanned = user.status === "banned";
                    setPopupMessage(isBanned ? "User Unbanned" : "User Banned");
                    setPopupDescription(
                        isBanned
                            ? `User "${user.nickname}" has been successfully unbanned.`
                            : `User "${user.nickname}" has been banned and can no longer access the system.`
                    );
                    setPopupOpen(true);
                    router.reload();
                },
            }
        );
    };

    // 🧩 Selection logic
    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(currentUsers.map((u) => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    // 🧩 Bulk actions
    const handleBulkAction = (action) => {
        let endpoint = "";
        let payload = {};

        if (action === "ban") {
            endpoint = "/admin/users/bulkBan";
            payload = { ids: selectedIds };
        } else if (action === "unban") {
            endpoint = "/admin/users/bulkUnban";
            payload = { ids: selectedIds };
        }

        router.post(endpoint, payload, {
            preserveScroll: true,
            onSuccess: () => {
                let message = "";
                let desc = "";

                switch (action) {
                    case "ban":
                        message = "Users Banned";
                        desc = `${selectedIds.length} selected users have been banned.`;
                        break;
                    case "unban":
                        message = "Users Unbanned";
                        desc = `${selectedIds.length} selected users have been unbanned.`;
                        break;
                }

                setPopupMessage(message);
                setPopupDescription(desc);
                setPopupOpen(true);
                setSelectedIds([]);
                router.reload();
            },
        });
    };

    useEffect(() => {
        if (!popupOpen) return;
        const t = setTimeout(() => setPopupOpen(false), 3000);
        return () => clearTimeout(t);
    }, [popupOpen]);

    return (
        <Layout_Admin title="User List">
            <Popup
                title={popupMessage}
                description={popupDescription}
                open={popupOpen}
                confirmText="OK"
                onConfirm={() => setPopupOpen(false)}
                onClose={() => setPopupOpen(false)}
            />

            <div className="p-6 space-y-6">
                {/* 🔎 Filter + Bulk Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                    {/* Search & Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by nickname or email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-[260px] focus-visible:ring-purple-700"
                            />
                            <Button
                                onClick={() => setSearch("")}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {["all", "active", "banned"].map((f) => (
                                <Button
                                    key={f}
                                    className={`${
                                        statusFilter === f
                                            ? "bg-purple-800 text-white"
                                            : "bg-purple-400"
                                    } hover:bg-purple-800`}
                                    onClick={() => {
                                        setStatusFilter(f);
                                        setCurrentPage(1);
                                    }}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Bulk actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t dark:border-gray-700 pt-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                            {selectedIds.length} selected
                        </div>
                        <div className="flex items-center gap-2">
                            <Popup
                                triggerText={
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <CheckCircle />
                                        <span>Unban Selected</span>
                                    </div>
                                }
                                title="Unban Selected Users?"
                                description="All selected users will be unbanned."
                                confirmText="Yes, Unban"
                                confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                triggerClass="bg-green-200 hover:bg-green-300 text-green-700"
                                disabledValue={selectedIds.length === 0}
                                onConfirm={() => handleBulkAction("unban")}
                            />
                            <Popup
                                triggerText={
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <XCircle className="w-4 h-4" />
                                        <span>Ban Selected</span>
                                    </div>
                                }
                                title="Ban Selected Users?"
                                description="All selected users will lose access."
                                confirmText="Yes, Ban"
                                confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                                disabledValue={selectedIds.length === 0}
                                onConfirm={() => handleBulkAction("ban")}
                            />
                        </div>
                    </div>
                </div>

                {/* 🧾 Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[42rem]">
                    <table className="min-w-full border dark:border-gray-700 dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 border dark:border-gray-700 w-12 text-center dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={
                                            currentUsers.length > 0 &&
                                            selectedIds.length ===
                                                currentUsers.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">ID</th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">Nickname</th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">Email</th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">Address</th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">Role</th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">Status</th>
                                <th className="px-4 py-2 border dark:border-gray-700 text-center dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    u.id
                                                )}
                                                onChange={() =>
                                                    handleToggle(u.id)
                                                }
                                            />
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {u.id}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {u.nickname}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {u.email}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 truncate max-w-xs dark:text-gray-200">
                                            {u.address}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 capitalize dark:text-gray-200">
                                            {u.role}
                                        </td>
                                        <td
                                            className={`border dark:border-gray-700 px-4 py-2 capitalize font-medium ${
                                                u.status === "banned"
                                                    ? "text-red-600 dark:text-red-400"
                                                    : "text-green-600 dark:text-green-400"
                                            }`}
                                        >
                                            {u.status}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                            <Popup
                                                triggerText={
                                                    u.status === "banned" ? (
                                                        <CheckCircle className="text-green-700" />
                                                    ) : (
                                                        <XCircle className="text-red-700" />
                                                    )
                                                }
                                                triggerClass={`${
                                                    u.status === "banned"
                                                        ? "bg-green-200 hover:bg-green-300 text-green-700"
                                                        : "bg-red-200 hover:bg-red-300 text-red-700"
                                                } p-2 rounded-md`}
                                                description={
                                                    u.status === "banned"
                                                        ? "User will be restored."
                                                        : "User will be banned."
                                                }
                                                confirmText={
                                                    u.status === "banned"
                                                        ? "Unban"
                                                        : "Ban"
                                                }
                                                confirmColor={
                                                    u.status === "banned"
                                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                                        : "bg-red-600 hover:bg-red-700 text-white"
                                                }
                                                onConfirm={() =>
                                                    handleToggleStatus(u)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-4 text-gray-500 dark:text-gray-400 italic border dark:border-gray-700"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                            </Button>
                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`${
                                        currentPage === i + 1
                                            ? "bg-purple-800 text-white hover:bg-purple-800"
                                            : "bg-purple-300 text-white hover:bg-purple-800 hover:text-white"
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
