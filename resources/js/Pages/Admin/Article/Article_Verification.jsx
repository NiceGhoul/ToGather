import { usePage, router } from "@inertiajs/react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";

export default function ArticleRequestList() {
    const { articles } = usePage().props;

    const handleApprove = (id) => {
        if (confirm("Approve this article?")) {
            router.post(`/admin/articles/${id}/approve`);
        }
    };

    const handleReject = (id) => {
        if (confirm("Reject this article?")) {
            router.post(`/admin/articles/${id}/reject`);
        }
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
                            <th className="border px-4 py-2">#</th>
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
                                    <td className="border px-4 py-2 text-gray-600">
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
                                        <Button
                                            onClick={() => handleView(a.id)}
                                            className="bg-purple-800 hover:bg-purple-700"
                                        >
                                            View
                                        </Button>
                                        <Button
                                            onClick={() => handleApprove(a.id)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(a.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Reject
                                        </Button>
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
