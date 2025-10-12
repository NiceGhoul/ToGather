import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";

export default function Lookup() {
    const { lookups } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [popup, setPopup] = useState({
        show: false,
        message: "",
        type: "",
        action: null,
        id: null,
    });

    const handleEdit = (lookup) => {
        setEditData(lookup);
        setShowModal(true);
    };

    // show delete popup
    const handleDelete = (id) => {
        setPopup({
            show: true,
            message: "Are you sure want to delete this lookup?",
            type: "confirm",
            action: "delete",
            id: id,
        });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditData(null);
    };

    const handleModalSave = (e) => {
        e.preventDefault();

        const url = editData.id
            ? `/admin/lookups/update/${editData.id}`
            : `/admin/lookups/store`;

        router.post(url, editData, {
            onSuccess: () => {
                setPopup({
                    show: true,
                    message: editData.id
                        ? "Lookup updated successfully."
                        : "Lookup added successfully.",
                    type: "success",
                });
            },
            onError: (err) => {
                setPopup({
                    show: true,
                    message: err[Object.keys(err)[0]],
                    type: "error",
                });
            },
        });
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePopupOk = () => {
        if (popup.type === "confirm" && popup.action === "delete") {
            // delete action
            router.post(
                `/admin/lookups/delete/${popup.id}`,
                {},
                {
                    onSuccess: () => {
                        setPopup({
                            show: true,
                            message: "Lookup deleted successfully.",
                            type: "success",
                            action: null,
                            id: null,
                        });
                    },
                    onError: (err) => {
                        setPopup({
                            show: true,
                            message: err[Object.keys(err)[0]],
                            type: "error",
                            action: null,
                            id: null,
                        });
                    },
                }
            );
        } else if (popup.type === "error") {
            // error action, popup stays open
            setPopup({
                show: false,
                message: "",
                type: "",
                action: null,
                id: null,
            });
        } else {
            // success action, close popup
            setPopup({
                show: false,
                message: "",
                type: "",
                action: null,
                id: null,
            });
            setShowModal(false);
            setEditData(null);
        }
    };

    // cancel popup
    const handlePopupCancel = () => {
        setPopup({
            show: false,
            message: "",
            type: "",
            action: null,
            id: null,
        });
    };

    const handleAdd = () => {
        setEditData({
            id: null,
            lookup_type: "",
            lookup_code: "",
            lookup_value: "",
            lookup_description: "",
        });
        setShowModal(true);
    };

    return (
        <AdminLayout title="Lookup Table">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Lookup Table</h1>
                <div className="btnContainer mb-4 flex justify-end">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAdd()}
                    >
                        + Add New Lookup
                    </Button>
                </div>
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 hidden">ID</th>
                            <th className="border px-4 py-2">Type</th>
                            <th className="border px-4 py-2">Code</th>
                            <th className="border px-4 py-2">Value</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lookups.map((lookup) => (
                            <tr key={lookup.id}>
                                <td className="border px-4 py-2 hidden">
                                    {lookup.id}
                                </td>
                                <td className="border px-4 py-2">
                                    {lookup.lookup_type}
                                </td>
                                <td className="border px-4 py-2">
                                    {lookup.lookup_code}
                                </td>
                                <td className="border px-4 py-2">
                                    {lookup.lookup_value}
                                </td>
                                <td className="border px-4 py-2">
                                    {lookup.lookup_description}
                                </td>
                                <td className="border px-4 py-2 text-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(lookup)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(lookup.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Edit */}
            {showModal && editData && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: "rgba(255,255,255,0.5)" }}
                    onClick={handleModalClose}
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg w-full max-w-md relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {editData.id ? "Edit Lookup" : "Add New Lookup"}
                        </h2>

                        <form onSubmit={handleModalSave} className="space-y-3">
                            <div>
                                <label className="block font-medium">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    name="lookup_type"
                                    value={editData.lookup_type}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    name="lookup_code"
                                    value={editData.lookup_code}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium">
                                    Value
                                </label>
                                <input
                                    type="text"
                                    name="lookup_value"
                                    value={editData.lookup_value}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="lookup_description"
                                    value={editData.lookup_description || ""}
                                    onChange={handleChange}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleModalClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="default">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Popup */}
            {popup.show && (
                <div className="fixed inset-0 flex items-center justify-center z-[100]">
                    <div className="bg-white border rounded shadow-lg p-6 text-center min-w-[300px]">
                        <div
                            className={`mb-4 font-bold ${
                                popup.type === "success"
                                    ? "text-green-600"
                                    : popup.type === "error"
                                    ? "text-red-600"
                                    : "text-gray-800"
                            }`}
                        >
                            {popup.type === "success"
                                ? "Success"
                                : popup.type === "error"
                                ? "Error"
                                : "Confirmation"}
                        </div>
                        <div className="mb-4">{popup.message}</div>
                        <div className="flex justify-center gap-2">
                            <Button onClick={handlePopupOk}>OK</Button>
                            {popup.type === "confirm" && (
                                <Button
                                    variant="outline"
                                    onClick={handlePopupCancel}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
