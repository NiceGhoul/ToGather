import { useState } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import Popup from "@/Components/Popup";
import {
    Search,
    RotateCcw,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { router, usePage } from "@inertiajs/react";

export default function Verification({ requests }) {
    const { filters } = usePage().props;

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalImage, setModalImage] = useState(null);
    const [modalTitle, setModalTitle] = useState("");

    // 🔹 Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 🔹 Filter frontend only
    const filteredRequests = requests.filter((req) => {
        if (statusFilter !== "all" && req.status !== statusFilter) return false;
        if (search) {
            const term = search.toLowerCase();
            return req.user.email.toLowerCase().includes(term);
        }
        return true;
    });

    // 🔹 Pagination logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRequests = filteredRequests.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedIds([]);
        }
    };

    // 🔹 Select logic
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(currentRequests.map((r) => r.user.id));
        } else {
            setSelectedIds([]);
        }
    };

    // 🔹 Verification actions
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
                {/*  Filter Section */}
                <div className="bg-purple-200 dark:bg-purple-800 p-4 rounded-lg shadow-md space-y-4">
                    {/* Search + Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by email..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-[260px] focus-visible:ring-purple-700 bg-white dark:bg-purple-200 dark:placeholder-purple-600"
                            />
                            <Button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                    setCurrentPage(1);
                                }}
                                className="bg-purple-800 hover:bg-purple-700 text-white dark:bg-purple-400 dark:text-black dark:hover:bg-purple-300"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {["all", "accepted", "pending", "rejected"].map(
                                (status) => (
                                    <Button
                                        key={status}
                                        className={`${
                                            statusFilter === status
                                                ? "bg-purple-800 text-white dark:bg-purple-400 dark:text-black"
                                                : "bg-purple-400 text-white dark:bg-purple-300 dark:text-black"
                                        } hover:bg-purple-800 dark:hover:bg-purple-400 `}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setCurrentPage(1);
                                        }}
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

                    {/* Bulk Actions */}
                    {statusFilter !== "all" && statusFilter !== "rejected" && (
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-purple-800 dark:border-white pt-3">
                            <div className="text-sm mr-2 text-gray-600 dark:text-gray-200">
                                {selectedIds.length} selected
                            </div>
                            <div className="flex items-center gap-2">
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
                                            triggerClass="bg-green-200 hover:bg-green-300 text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
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
                                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                                            disabledValue={
                                                selectedIds.length === 0
                                            }
                                            onConfirm={() =>
                                                handleBulkAction("rejected")
                                            }
                                        />
                                    </>
                                )}
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
                                        triggerClass="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
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

                {/* 🧾 Table */}
                <div className="bg-purple-200 dark:bg-purple-800 rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[42rem]">
                    <table className="min-w-full border dark:border-gray-700 dark:bg-purple-200">
                        <thead className="bg-purple-100 dark:bg-purple-600">
                            <tr>
                                {statusFilter !== "all" &&
                                    statusFilter !== "rejected" && (
                                        <th className="px-4 py-2 border dark:border-gray-700 w-12 text-center dark:text-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    currentRequests.length >
                                                        0 &&
                                                    selectedIds.length ===
                                                        currentRequests.length
                                                }
                                                onChange={(e) =>
                                                    toggleSelectAll(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </th>
                                    )}

                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    ID
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Email
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    ID Photo
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Selfie with ID
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 dark:text-gray-200">
                                    Status
                                </th>
                                <th className="px-4 py-2 border dark:border-gray-700 text-center dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRequests.length > 0 ? (
                                currentRequests.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="hover:bg-gray-50 dark:hover:bg-purple-300"
                                    >
                                        {statusFilter !== "all" &&
                                            statusFilter !== "rejected" && (
                                                <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(
                                                            r.user.id
                                                        )}
                                                        onChange={() =>
                                                            toggleSelect(
                                                                r.user.id
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}

                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {r.id}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {r.user.email}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-black">
                                            {r.id_photo_url ? (
                                                <Button
                                                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white text-sm"
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
                                                <span className="text-gray-400 dark:text-gray-500">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                            {r.selfie_url ? (
                                                <Button
                                                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white text-sm"
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
                                                <span className="text-gray-400 dark:text-gray-500">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td
                                            className={`border dark:border-gray-700 px-4 py-2 capitalize font-medium text-center ${
                                                r.status === "accepted"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : r.status === "pending"
                                                    ? "text-yellow-600 dark:text-yellow-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {r.status}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                            <div className="flex justify-center gap-2">
                                                {r.status === "pending" && (
                                                    <>
                                                        <Popup
                                                            triggerText={
                                                                <div className="flex items-center gap-2 cursor-pointer">
                                                                    <CheckCircle />
                                                                </div>
                                                            }
                                                            title="Approve User Verification?"
                                                            description="Approve this user's verification?"
                                                            confirmText="Approve"
                                                            confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                                            triggerClass="bg-green-200 hover:bg-green-300 text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white px-3 py-1 rounded-md"
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
                                                            description="Reject this user's verification?"
                                                            confirmText="Reject"
                                                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white px-3 py-1 rounded-md"
                                                            onConfirm={() =>
                                                                handleVerification(
                                                                    r.user.id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
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
                                        No verification requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* 🔸 Pagination Section */}
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
                                            ? "bg-purple-800 text-white hover:bg-purple-800 dark:bg-purple-400 dark:text-black dark:hover:bg-purple-400 "
                                            : "bg-purple-300 text-white hover:bg-purple-800 hover:text-white dark:bg-purple-300 dark:text-black dark:hover:bg-purple-400"
                                    }
                                        font-medium transition-colors duration-200
                                    `}
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

            {/* 🔹 Modal */}
            {modalImage && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setModalImage(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-3xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-3 dark:text-white">
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
