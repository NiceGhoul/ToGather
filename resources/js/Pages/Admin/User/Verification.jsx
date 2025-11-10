import { useState } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Popup from "@/Components/Popup";
import { Search, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { router, usePage } from "@inertiajs/react";

export default function Verification({ requests }) {
    const { filters } = usePage().props;

    // 🔹 State
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [modalTitle, setModalTitle] = useState("");

    // 🔹 Filter frontend only
    const filteredRequests = requests.filter((req) => {
        if (statusFilter !== "all" && req.status !== statusFilter) return false;
        if (search) {
            const term = search.toLowerCase();
            return req.user.email.toLowerCase().includes(term);
        }
        return true;
    });

    // 🔹 Toggle select
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filteredRequests.map((r) => r.user.id));
        } else {
            setSelectedIds([]);
        }
    };

    // 🔹 Handle single verification
    const handleVerification = async (userId, action) => {
        try {
            const response = await fetch(`/users/${userId}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ acceptance: action }),
            });

            if (!response.ok) throw new Error("Verification failed");
            window.location.reload();
        } catch (error) {
            console.error("Error verifying user:", error);
            alert("An error occurred while verifying.");
        }
    };

    // 🔹 Bulk verification
    const handleBulkAction = async (action) => {
        try {
            for (const id of selectedIds) {
                await handleVerification(id, action);
            }
            alert(
                `All selected users have been ${
                    action === "accepted" ? "approved" : "rejected"
                }.`
            );
            window.location.reload();
        } catch (error) {
            console.error("Bulk verification error:", error);
        }
    };

    return (
        <Layout_Admin title="User Verification List">
            <div className="p-6 space-y-6">
                {/* 🔎 Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                    {/* Row 1: Search + Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* LEFT: Search */}
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[260px] focus-visible:ring-purple-700"
                            />
                            <Button
                                onClick={() => setSearch(search)}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* RIGHT: Status Filter Buttons */}
                        <div className="flex items-center gap-2">
                            {["all", "accepted", "pending", "rejected"].map(
                                (status) => (
                                    <Button
                                        key={status}
                                        className={`${
                                            statusFilter === status
                                                ? "bg-purple-800 text-white"
                                                : "bg-purple-400"
                                        } hover:bg-purple-800`}
                                        onClick={() => setStatusFilter(status)}
                                    >
                                        {status === "all"
                                            ? "All"
                                            : status.charAt(0).toUpperCase() +
                                              status.slice(1)}
                                    </Button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Row 2: Bulk Actions */}
                    {statusFilter !== "all" && statusFilter !== "rejected" && (
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                            <div className="text-sm mr-2">
                                {selectedIds.length} selected
                            </div>

                            <div className="flex items-center gap-2">
                                {/* ✅ Show both when filter = pending */}
                                {statusFilter === "pending" && (
                                    <>
                                        <Popup
                                            triggerText={
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>
                                                        Approve Selected
                                                    </span>
                                                </div>
                                            }
                                            title="Approve Selected Users?"
                                            description="All selected users will be approved."
                                            confirmText="Approve All"
                                            confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                            triggerClass="bg-green-200 hover:bg-green-300 text-green-700"
                                            disabledValue={
                                                selectedIds.length === 0
                                            }
                                            onConfirm={() =>
                                                handleBulkAction("accepted")
                                            }
                                        />

                                        <Popup
                                            triggerText={
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <XCircle className="w-4 h-4" />
                                                    <span>Reject Selected</span>
                                                </div>
                                            }
                                            title="Reject Selected Users?"
                                            description="All selected users will be rejected."
                                            confirmText="Reject All"
                                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                                            disabledValue={
                                                selectedIds.length === 0
                                            }
                                            onConfirm={() =>
                                                handleBulkAction("rejected")
                                            }
                                        />
                                    </>
                                )}

                                {/* ❌ Only show Reject when filter = accepted */}
                                {statusFilter === "accepted" && (
                                    <Popup
                                        triggerText={
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <XCircle className="w-4 h-4" />
                                                <span>Reject Selected</span>
                                            </div>
                                        }
                                        title="Reject Selected Users?"
                                        description="All selected users will be rejected."
                                        confirmText="Reject All"
                                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                        triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                                        disabledValue={selectedIds.length === 0}
                                        onConfirm={() =>
                                            handleBulkAction("rejected")
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 🧾 Verification Table */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredRequests.length > 0 &&
                                            selectedIds.length ===
                                                filteredRequests.length
                                        }
                                        onChange={(e) =>
                                            toggleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Email</th>
                                <th className="px-4 py-2 border">ID Photo</th>
                                <th className="px-4 py-2 border">
                                    Selfie with ID
                                </th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((r) => (
                                    <tr key={r.id}>
                                        <td className="border px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    r.user.id
                                                )}
                                                onChange={() =>
                                                    toggleSelect(r.user.id)
                                                }
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            {r.id}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {r.user.email}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            {r.id_photo_url ? (
                                                <Button
                                                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm"
                                                    onClick={() => {
                                                        setModalImage(
                                                            r.id_photo_url
                                                        );
                                                        setModalTitle(
                                                            "ID Photo"
                                                        );
                                                    }}
                                                >
                                                    ID Photo
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td className="border px-4 py-2 text-center">
                                            {r.selfie_url ? (
                                                <Button
                                                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm"
                                                    onClick={() => {
                                                        setModalImage(
                                                            r.selfie_url
                                                        );
                                                        setModalTitle(
                                                            "Selfie with ID"
                                                        );
                                                    }}
                                                >
                                                    Selfie
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td
                                            className={`border px-4 py-2 capitalize font-medium text-center ${
                                                r.status === "accepted"
                                                    ? "text-green-600"
                                                    : r.status === "pending"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {r.status}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                {r.status === "pending" && (
                                                    <>
                                                        <Popup
                                                            triggerText={
                                                                <div className="flex items-center gap-4 cursor-pointer">
                                                                    <CheckCircle className="w-4 h-4 text-green-700" />
                                                                </div>
                                                            }
                                                            title="Approve User Verification?"
                                                            description="Are you sure you want to approve this user's verification?"
                                                            confirmText="Approve"
                                                            confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                                            triggerClass="bg-green-200 hover:bg-green-300 text-green-700 px-3 py-1 rounded-md"
                                                            onConfirm={() =>
                                                                handleVerification(
                                                                    r.user.id,
                                                                    "accepted"
                                                                )
                                                            }
                                                        />
                                                        <Popup
                                                            triggerText={
                                                                <div className="flex items-center gap-2 cursor-pointer">
                                                                    <XCircle className="w-4 h-4" />
                                                                </div>
                                                            }
                                                            title="Reject User?"
                                                            description="Are you sure you want to reject this user's verification?"
                                                            confirmText="Reject"
                                                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md"
                                                            onConfirm={() =>
                                                                handleVerification(
                                                                    r.user.id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                                {r.status === "accepted" && (
                                                    <Popup
                                                        triggerText={
                                                            <div className="flex items-center gap-2 cursor-pointer">
                                                                <XCircle className="w-4 h-4" />
                                                            </div>
                                                        }
                                                        title="Reject User?"
                                                        description="Reject this user’s verification?"
                                                        confirmText="Reject"
                                                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                        triggerClass="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded-md"
                                                        onConfirm={() =>
                                                            handleVerification(
                                                                r.user.id,
                                                                "rejected"
                                                            )
                                                        }
                                                    />
                                                )}
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
                                        No verification requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalImage && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setModalImage(null)} // klik luar = tutup
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full"
                        onClick={(e) => e.stopPropagation()} // biar klik dalam gak nutup
                    >
                        <h2 className="text-lg font-semibold mb-3">
                            {modalTitle}
                        </h2>
                        <img
                            src={modalImage}
                            alt={modalTitle}
                            className="w-full h-auto rounded-md object-contain max-h-[80vh]"
                        />
                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={() => setModalImage(null)}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout_Admin>
    );
}
