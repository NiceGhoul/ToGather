import { usePage, router } from "@inertiajs/react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";

export default function ArticleModeration() {
    const { articles } = usePage().props;

    const handleView = (id) => {
        router.get(`/admin/articles/${id}/view`);
    };
    const handleEnable = (id) => {
        router.post(`/admin/articles/${id}/approve`);
    };

    const handleDisable = (id) => {
        router.post(`/admin/articles/${id}/disable`);
    };

    const handleDelete = (id) => {
        router.post(`/admin/articles/${id}/delete`);
    };

    return (
        <Layout_Admin title="Article Moderation">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">All Active Articles</h1>
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Title</th>
                            <th className="border px-4 py-2">Author</th>
                            <th className="border px-4 py-2">Category</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((a) => (
                            <tr key={a.id}>
                                <td className="border px-4 py-2">{a.title}</td>
                                <td className="border px-4 py-2">
                                    {a.user.nickname}
                                </td>
                                <td className="border px-4 py-2">
                                    {a.category}
                                </td>
                                <td className="border px-4 py-2 capitalize">
                                    {a.status}
                                </td>
                                <td className="border px-4 py-2 space-x-2">
                                    {a.status === "approved" && (
                                        <>
                                            <Button
                                                className="bg-purple-800 hover:bg-purple-700"
                                                onClick={() => handleView(a.id)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() =>
                                                    handleDisable(a.id)
                                                }
                                            >
                                                Disable
                                            </Button>
                                            <Button
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() =>
                                                    handleDelete(a.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                    {a.status === "disabled" && (
                                        <>
                                            <Button
                                                className="bg-purple-800 hover:bg-purple-700"
                                                onClick={() => handleView(a.id)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() =>
                                                    handleEnable(a.id)
                                                }
                                            >
                                                Enable
                                            </Button>
                                            <Button
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={() =>
                                                    handleDelete(a.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout_Admin>
    );
}
