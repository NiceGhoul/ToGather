import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function ArticleView() {
    const { article } = usePage().props;

    const handleBack = () => {
        window.history.back();
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

    const handleApprove = (id) => {
        router.post(`/admin/articles/${id}/approve`);
    };

    const handleReject = (id) => {
        router.post(`/admin/articles/${id}/reject`);
    };

    return (
        <Layout_Admin title={`View Article: ${article.title}`}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-purple-700">
                        {article.title}
                    </h1>
                    <Button
                        onClick={handleBack}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                        ← Back to List
                    </Button>
                </div>

                {/* Info Section */}
                <div className="bg-gray-50 rounded-lg p-4 border flex flex-row justify-between space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <p>
                            <strong>Author:</strong>{" "}
                            {article.user?.nickname || article.user?.name}
                        </p>
                        <p>
                            <strong>Category:</strong> {article.category}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span className="capitalize text-green-600">
                                {article.status}
                            </span>
                        </p>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {new Date(article.created_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>Last Updated:</strong>{" "}
                            {new Date(article.updated_at).toLocaleString()}
                        </p>
                    </div>
                    {/* Buttons */}
                    {article.status === "approved" && (
                        <div className="btnContainer flex flex-col justify-center space-y-2">
                            <Button
                                onClick={() => handleDisable(article.id)}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                Disable
                            </Button>
                            <Button
                                onClick={() => handleDelete(article.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    )}

                    {article.status === "disabled" && (
                        <div className="btnContainer flex flex-col justify-center space-y-2">
                            <Button
                                onClick={() => handleEnable(article.id)}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                Enable
                            </Button>
                            <Button
                                onClick={() => handleDelete(article.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    )}

                    {article.status === "pending" && (
                        <div className="btnContainer flex flex-col justify-center space-y-2">
                            <Button
                                onClick={() => handleApprove(article.id)}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                Approve
                            </Button>
                            <Button
                                onClick={() => handleReject(article.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Reject
                            </Button>
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                {article.thumbnail && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Thumbnail
                        </h2>
                        <img
                            src={`/storage/${article.thumbnail}`}
                            alt="Thumbnail"
                            className="max-w-sm rounded-lg border shadow"
                        />
                    </div>
                )}

                {/* Content */}
                <div>
                    <h2 className="text-lg font-semibold mb-2">Content</h2>
                    {article.content ? (
                        <div
                            className="prose max-w-full border rounded-lg p-4 bg-white"
                            dangerouslySetInnerHTML={{
                                __html: article.content,
                            }}
                        />
                    ) : (
                        <p className="text-gray-500 italic">
                            No written content available.
                        </p>
                    )}
                </div>

                {/* Attachment */}
                {article.attachment && (
                    <div>
                        <h2 className="text-lg font-semibold mb-2">
                            Attachment
                        </h2>
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={() =>
                                    window.open(
                                        `/storage/${article.attachment}`,
                                        "_blank"
                                    )
                                }
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                📎 Open Attachment
                            </Button>
                            <a
                                href={`/storage/${article.attachment}`}
                                download
                                className="text-blue-700 underline text-sm"
                            >
                                Download File
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </Layout_Admin>
    );
}
