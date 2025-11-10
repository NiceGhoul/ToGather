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
} from "lucide-react";

export default function User_List() {
    const { users } = usePage().props;

    // 🔹 Popup states
    const [popupMessage, setPopupMessage] = useState("");
    const [popupDescription, setPopupDescription] = useState("");
    const [popupOpen, setPopupOpen] = useState(false);

    // 🔹 Filter & selection states
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // 🧩 Filtered data (frontend only)
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

    // 🧩 Ban / Unban per user
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

    // 🧩 Bulk select
    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filteredUsers.map((u) => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    // 🧩 Bulk / Global Action Handler
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
                    case "banAll":
                        message = "All Users Banned";
                        desc = "All users in the system have been banned.";
                        break;
                    case "unbanAll":
                        message = "All Users Unbanned";
                        desc = "All users have been restored to active status.";
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
                triggerText=""
                title={popupMessage}
                description={popupDescription}
                open={popupOpen}
                confirmText="OK"
                onConfirm={() => setPopupOpen(false)}
                onClose={() => setPopupOpen(false)}
            />

            <div className="p-6 space-y-6">
                {/* 🔎 Filter + Bulk Section */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    {/* Row 1: Search & Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* LEFT: Search bar */}
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by nickname or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[260px] focus-visible:ring-purple-700"
                            />
                            <Button
                                onClick={() => setSearch("")}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* RIGHT: Filter buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                className={`${
                                    statusFilter === "all"
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatusFilter("all")}
                            >
                                All
                            </Button>
                            <Button
                                className={`${
                                    statusFilter === "active"
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatusFilter("active")}
                            >
                                Active
                            </Button>
                            <Button
                                className={`${
                                    statusFilter === "banned"
                                        ? "bg-purple-800 text-white"
                                        : "bg-purple-400"
                                } hover:bg-purple-800`}
                                onClick={() => setStatusFilter("banned")}
                            >
                                Banned
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Bulk Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                        <div className="text-sm text-gray-600 mr-2">
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
                                description="All selected users will be restored and can use the platform again."
                                confirmText="Yes, Unban All"
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
                                description="All selected users will be banned and will lose access."
                                confirmText="Yes, Ban All"
                                confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                                disabledValue={selectedIds.length === 0}
                                onConfirm={() => handleBulkAction("ban")}
                            />
                        </div>
                    </div>
                </div>

                {/* 🧾 User Table */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredUsers.length > 0 &&
                                            selectedIds.length ===
                                                filteredUsers.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Nickname</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">Address</th>
                                <th className="px-4 py-2 border">Role</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td className="border px-4 py-2 text-center">
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
                                        <td className="border px-4 py-2">
                                            {u.id}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {u.nickname}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {u.email}
                                        </td>
                                        <td className="border px-4 py-2 truncate max-w-xs">
                                            {u.address}
                                        </td>
                                        <td className="border px-4 py-2 capitalize">
                                            {u.role}
                                        </td>
                                        <td
                                            className={`border px-4 py-2 capitalize font-medium ${
                                                u.status === "banned"
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {u.status}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
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
                                                        ? "User will be restored and can access again."
                                                        : "User will be banned and lose access."
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
                                        className="text-center py-4 text-gray-500 italic"
                                    >
                                        No users found.
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
