import { usePage, router } from "@inertiajs/react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";
import Popup from "@/Components/Popup";
import { useState, useEffect } from "react";
import { File, Check, X } from "lucide-react";

export default function ArticleRequestList() {
    const { articles } = usePage().props;

    const [selectedIds, setSelectedIds] = useState([]);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

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

    const handleApprove = (id) => {
        router.post(`/admin/articles/${id}/approve`);
    };

    const handleReject = (id) => {
        router.post(`/admin/articles/${id}/reject`);
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
                },
                onError: (errors) => {
                    console.error("Bulk approve error:", errors);
                    setSuccessPopupMessage("Bulk approve failed");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    const handleBulkReject = () => {
        if (selectedIds.length === 0) return;
        router.post(
            "/admin/articles/bulk-reject",
            { ids: selectedIds },
            {
                preserveState: true,
                onSuccess: () => {
                    setSuccessPopupMessage("Selected articles rejected");
                    setSuccessPopupOpen(true);
                    setSelectedIds([]);
                },
                onError: (errors) => {
                    console.error("Bulk reject error:", errors);
                    setSuccessPopupMessage("Bulk reject failed");
                    setSuccessPopupOpen(true);
                },
            }
        );
    };

    // close popup then refresh list so UI stays in sync
    const handleSuccessClose = () => {
        setSuccessPopupOpen(false);
        router.reload();
    };

    // optional auto-close after X ms (keeps UX snappy)
    useEffect(() => {
        if (!successPopupOpen) return;
        const t = setTimeout(() => handleSuccessClose(), 2500);
        return () => clearTimeout(t);
    }, [successPopupOpen]);

    return (
        <Layout_Admin title="Article Requests">
            {/* success popup */}
            <Popup
                triggerText=""
                title={successPopupMessage}
                description=""
                confirmText="OK"
                open={successPopupOpen}
                onConfirm={handleSuccessClose}
                onClose={handleSuccessClose}
                triggerClass=""
            />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Pending Article Requests
                </h1>

                <div className="mb-4 flex items-center gap-3">
                    <div className="text-sm">{selectedIds.length} selected</div>

                    <Popup
                        triggerText={
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Check className="w-4 h-4" />
                                <span>Approve Selected</span>
                            </div>
                        }
                        title="Approve Selected Articles?"
                        description="This will approve all selected articles."
                        confirmText="Yes, Approve"
                        confirmColor="bg-green-600 hover:bg-green-700 text-white"
                        triggerClass="bg-green-600 hover:bg-green-700 text-white"
                        disabledValue={selectedIds.length === 0}
                        onConfirm={() => handleBulkApprove()}
                    />

                    <Popup
                        triggerText={
                            <div className="flex items-center gap-2 cursor-pointer">
                                <X className="w-4 h-4" />
                                <span>Reject Selected</span>
                            </div>
                        }
                        title="Reject Selected Articles?"
                        description="This will reject all selected articles."
                        confirmText="Yes, Reject"
                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                        triggerClass="bg-red-600 hover:bg-red-700 text-white"
                        disabledValue={selectedIds.length === 0}
                        onConfirm={() => handleBulkReject()}
                    />
                </div>

                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={
                                        articles.length > 0 &&
                                        selectedIds.length === articles.length
                                    }
                                    onChange={(e) =>
                                        handleSelectAll(e.target.checked)
                                    }
                                />
                            </th>
                            <th className="border px-4 py-2">Title</th>
                            <th className="border px-4 py-2">Author</th>
                            <th className="border px-4 py-2">Category</th>
                            <th className="border px-4 py-2">Created At</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length > 0 ? (
                            articles.map((a, index) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(a.id)}
                                            onChange={() => handleToggle(a.id)}
                                        />
                                    </td>
                                    <td className="border px-4 py-2 font-medium text-black">
                                        {a.title}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {a.user?.nickname || a.user?.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {a.category}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {new Date(
                                            a.created_at
                                        ).toLocaleString()}
                                    </td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <div className="actionBtnContainer flex flex-row justify-center gap-3">
                                            <Button
                                                onClick={() =>
                                                    router.get(
                                                        `/admin/articles/${a.id}/view?from=verification`
                                                    )
                                                }
                                                className="bg-purple-800 hover:bg-purple-700"
                                            >
                                                <File />
                                            </Button>

                                            <Popup
                                                triggerText={<Check />}
                                                title="Approve Article?"
                                                description="This action cannot be undone. The article will be approved and be shown on public"
                                                confirmText="Yes, Approve"
                                                confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                                triggerClass="bg-green-600 hover:bg-green-700 text-white"
                                                onConfirm={() =>
                                                    handleApprove(a.id)
                                                }
                                            />
                                            <Popup
                                                triggerText={<X />}
                                                title="Reject Article?"
                                                description="This action cannot be undone. The article will be rejected"
                                                confirmText="Yes, Reject"
                                                confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                triggerClass="bg-red-600 hover:bg-red-700 text-white"
                                                onConfirm={() =>
                                                    handleReject(a.id)
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
                                    className="text-center py-6 text-gray-500 border"
                                >
                                    No pending article requests.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout_Admin>
    );
}
