import { usePage, router } from "@inertiajs/react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";
import Popup from "@/Components/Popup";

export default function ArticleRequestList() {
    const { articles } = usePage().props;

    const handleApprove = (id) => {
        router.post(`/admin/articles/${id}/approve`);
    };

    const handleReject = (id) => {
        router.post(`/admin/articles/${id}/reject`);
    };

    const handleView = (id) => {
        router.get(`/admin/articles/${id}/view`);
    };

    return (
        <Layout_Admin title="Article Requests">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Pending Article Requests
                </h1>

                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border px-4 py-2 hidden">#</th>
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
                                    <td className="border px-4 py-2 hidden text-gray-600">
                                        {index + 1}
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
                                                onClick={() => handleView(a.id)}
                                                className="bg-purple-800 hover:bg-purple-700"
                                            >
                                                View
                                            </Button>
                                            <Popup
                                                triggerText="Approve"
                                                title="Approve Article?"
                                                description="This action cannot be undone. The article will be approved and be shown on public"
                                                confirmText="Yes, Approve"
                                                confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                                triggerClass="bg-green-600 hover:bg-green-700 text-white w-18"
                                                onConfirm={() =>
                                                    handleApprove(a.id)
                                                }
                                            />
                                            <Popup
                                                triggerText="Reject"
                                                title="Reject Article?"
                                                description="This action cannot be undone. The article will be rejected"
                                                confirmText="Yes, Reject"
                                                confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                triggerClass="bg-red-600 hover:bg-red-700 text-white w-18"
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
