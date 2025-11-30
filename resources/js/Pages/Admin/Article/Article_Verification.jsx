import { usePage, router } from "@inertiajs/react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/Components/ui/button";
import Popup from "@/Components/Popup";
import { useState, useEffect } from "react";
import {
    File,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function ArticleRequestList() {
    const { articles } = usePage().props;

    const [selectedIds, setSelectedIds] = useState([]);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    // ===== Reject (per item) =====
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [targetRejectId, setTargetRejectId] = useState(null);

    // ===== Bulk Reject =====
    const [bulkRejectModalOpen, setBulkRejectModalOpen] = useState(false);
    const [bulkRejectReason, setBulkRejectReason] = useState("");

    // ===== Pagination =====
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentArticles = articles.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedIds([]);
        }
    };

    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(currentArticles.map((a) => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleApprove = (id) => {
        router.post(
            `/admin/articles/${id}/approve`,
            {},
            {
                onSuccess: () => {
                    setSuccessPopupMessage("Article approved");
                    setSuccessPopupOpen(true);
                    router.reload();
                },
                onError: () => {
                    setSuccessPopupMessage("Approve failed");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    const submitReject = (id, reason) => {
        router.post(
            `/admin/articles/${id}/reject`,
            { reason },
            {
                onSuccess: () => {
                    setRejectModalOpen(false);
                    setRejectReason("");
                    setTargetRejectId(null);
                    setSuccessPopupMessage("Article rejected successfully!");
                    setSuccessPopupOpen(true);
                    router.reload();
                },
                onError: () => {
                    setSuccessPopupMessage("Failed to reject article");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        router.post(
            "/admin/articles/bulk-approve",
            { ids: selectedIds },
            {
                preserveState: true,
                onSuccess: () => {
                    setSuccessPopupMessage("Selected articles approved");
                    setSuccessPopupOpen(true);
                    setSelectedIds([]);
                    router.reload();
                },
                onError: () => {
                    setSuccessPopupMessage("Bulk approve failed");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    const submitBulkReject = (ids, reason) => {
        if (ids.length === 0) return;
        router.post(
            "/admin/articles/bulk-reject",
            { ids, reason },
            {
                preserveState: true,
                onSuccess: () => {
                    setSuccessPopupMessage("Selected articles rejected");
                    setSuccessPopupOpen(true);
                    setSelectedIds([]);
                    setBulkRejectModalOpen(false);
                    setBulkRejectReason("");
                    router.reload();
                },
                onError: () => {
                    setSuccessPopupMessage("Bulk reject failed");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    const handleSuccessClose = () => {
        setSuccessPopupOpen(false);
        router.reload();
    };

    useEffect(() => {
        if (!successPopupOpen) return;
        const t = setTimeout(() => handleSuccessClose(), 2500);
        return () => clearTimeout(t);
    }, [successPopupOpen]);

    return (
        <Layout_Admin title="Article Requests">
            <Popup
                triggerText=""
                title={successPopupMessage}
                description=""
                confirmText="OK"
                confirmColor={"bg-purple-800 hover:bg-purple-700 text-white"}
                open={successPopupOpen}
                onConfirm={handleSuccessClose}
                onClose={handleSuccessClose}
                triggerClass=""
            />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-2 dark:text-white">
                    Pending Article Requests
                </h1>

                {/* 🔹 Bulk Actions */}
                <div className="mb-4 flex items-center gap-3 flex-row justify-end border-b bg-purple-200 dark:bg-purple-800 pb-3 pt-3 px-5 rounded-lg">
                    <div className="text-sm mr-auto dark:text-gray-200">
                        {selectedIds.length} selected
                    </div>

                    <Popup
                        triggerText={
                            <div className="flex items-center gap-2 cursor-pointer">
                                <CheckCircle />
                                <span>Approve Selected</span>
                            </div>
                        }
                        title="Approve Selected Articles?"
                        description="This will approve all selected articles."
                        confirmText="Yes, Approve"
                        confirmColor="bg-green-600 hover:bg-green-700 text-white"
                        triggerClass="bg-green-200 hover:bg-green-300 text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
                        disabledValue={selectedIds.length === 0}
                        onConfirm={() => handleBulkApprove()}
                    />

                    <Button
                        className="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                        disabled={selectedIds.length === 0}
                        onClick={() => setBulkRejectModalOpen(true)}
                    >
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            <span>Reject Selected</span>
                        </div>
                    </Button>
                </div>

                {/* 🧾 Table + Pagination wrapper */}
                <div className="bg-purple-200 dark:bg-purple-800 rounded-lg shadow-md p-4 flex flex-col justify-between min-h-[45rem]">
                    <table className="min-w-full border dark:border-gray-700 text-sm dark:bg-purple-200">
                        <thead>
                            <tr className="bg-purple-100 dark:bg-purple-600 text-left">
                                <th className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
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
                                <th className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                    Id
                                </th>
                                <th className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                    Title
                                </th>
                                <th className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                    Author
                                </th>
                                <th className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                    Category
                                </th>
                                <th className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                    Created At
                                </th>
                                <th className="border dark:border-gray-700 px-4 py-2 text-center dark:text-gray-200">
                                    Action
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
                                        <td className="border dark:border-gray-700 px-4 py-2 font-medium dark:text-black">
                                            {a.id}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 font-medium dark:text-black">
                                            {a.title}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {a.user?.nickname || a.user?.name}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {a.category}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-black">
                                            {new Date(
                                                a.created_at
                                            ).toLocaleString()}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 text-center dark:text-black">
                                            <div className="flex flex-row justify-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        router.get(
                                                            `/admin/articles/${a.id}/view?from=verification`
                                                        )
                                                    }
                                                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 dark:text-white"
                                                >
                                                    <File />
                                                </Button>

                                                <Popup
                                                    triggerText={
                                                        <CheckCircle />
                                                    }
                                                    title="Approve Article?"
                                                    description="The article will be approved and shown publicly."
                                                    confirmText="Yes, Approve"
                                                    confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                                    triggerClass="bg-green-200 hover:bg-green-300 text-green-700 dark:bg-green-600 dark:hover:bg-green-700 dark:text-white"
                                                    onConfirm={() =>
                                                        handleApprove(a.id)
                                                    }
                                                />

                                                <Button
                                                    className="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                                                    onClick={() => {
                                                        setTargetRejectId(a.id);
                                                        setRejectModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <XCircle />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-6 text-gray-500 dark:text-gray-400 border dark:border-gray-700 italic"
                                    >
                                        No pending article requests.
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
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                            </Button>
                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`
                                        ${
                                            currentPage === i + 1
                                                ? "bg-purple-800 text-white hover:bg-purple-800"
                                                : "bg-purple-300 text-purple-900 hover:bg-purple-800 hover:text-white"
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
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==== MODAL: Per-item Reject reason ==== */}
            {rejectModalOpen && (
                <Popup
                    triggerText=""
                    title="Reject Article"
                    description=""
                    confirmText="Submit Rejection"
                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                    open={rejectModalOpen}
                    onConfirm={() => {
                        if (!rejectReason.trim()) {
                            setSuccessPopupMessage("Please provide a reason.");
                            setSuccessPopupOpen(true);
                            return;
                        }
                        submitReject(targetRejectId, rejectReason);
                    }}
                    onClose={() => {
                        setRejectModalOpen(false);
                        setRejectReason("");
                        setTargetRejectId(null);
                    }}
                >
                    <div className="mt-2">
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Reason for Rejection:
                        </label>
                        <textarea
                            className="w-full border dark:border-gray-600 rounded-md p-2 text-sm dark:bg-gray-800 dark:text-white"
                            rows={4}
                            placeholder="Write your reason here..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                </Popup>
            )}

            {/* ==== MODAL: Bulk Reject reason ==== */}
            {bulkRejectModalOpen && (
                <Popup
                    triggerText=""
                    title="Reject Selected Articles"
                    description=""
                    confirmText="Submit Rejection"
                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                    open={bulkRejectModalOpen}
                    onConfirm={() => {
                        if (selectedIds.length === 0) return;
                        if (!bulkRejectReason.trim()) {
                            setSuccessPopupMessage("Please provide a reason.");
                            setSuccessPopupOpen(true);
                            return;
                        }
                        submitBulkReject(selectedIds, bulkRejectReason);
                    }}
                    onClose={() => {
                        setBulkRejectModalOpen(false);
                        setBulkRejectReason("");
                    }}
                >
                    <div className="mt-2">
                        <p className="text-sm mb-2 dark:text-gray-200">
                            You are rejecting <b>{selectedIds.length}</b>{" "}
                            article(s).
                        </p>
                        <label className="block text-sm font-medium mb-1 dark:text-white">
                            Reason for Rejection:
                        </label>
                        <textarea
                            className="w-full border dark:border-gray-600 rounded-md p-2 text-sm dark:bg-gray-800 dark:text-white"
                            rows={4}
                            placeholder="Write your reason here..."
                            value={bulkRejectReason}
                            onChange={(e) =>
                                setBulkRejectReason(e.target.value)
                            }
                        />
                    </div>
                </Popup>
            )}
        </Layout_Admin>
    );
}
