import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout_Admin";
import { Button } from "@/components/ui/button";
import Popup from "@/Components/Popup";
import { Trash, Pencil } from "lucide-react";

export default function Lookup() {
    const { lookups } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [successPopup, setSuccessPopup] = useState(false);
    const [errorPopup, setErrorPopup] = useState({
        show: false,
        message: "",
    });

    const handleEdit = (lookup) => {
        setEditData(lookup);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        router.post(
            `/admin/lookups/delete/${id}`,
            {},
            {
                onSuccess: () => {
                    // opsional: bisa tambahkan notifikasi kalau kamu pakai toast
                    console.log("Lookup deleted successfully.");
                },
                onError: (err) => {
                    console.error("Error deleting lookup:", err);
                },
            }
        );
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
                // ✅ Save berhasil → tutup modal + tampilkan popup success
                setShowModal(false);
                setEditData(null);
                setSuccessPopup(true);
            },
            onError: (err) => {
                // ❌ Validasi error → tampilkan popup error
                const firstError =
                    err[Object.keys(err)[0]] || "An error occurred.";
                setErrorPopup({
                    show: true,
                    message: firstError,
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
                        className="bg-purple-800 hover:bg-purple-700 text-white"
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
                                    {/* Tombol Edit */}
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(lookup)}
                                        className="bg-purple-200 hover:bg-purple-300 text-purple-700"
                                    >
                                        <Pencil className="w-4 h-4 text-purple-700 hover:text-purple-700" />
                                    </Button>

                                    {/* Tombol Delete */}
                                    <Popup
                                        triggerText={
                                            <Trash className="w-4 h-4" />
                                        }
                                        title="Delete Lookup?"
                                        description="This action cannot be undone. The Lookup will be removed permanently."
                                        confirmText="Yes, Delete"
                                        confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                        triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                                        onConfirm={() =>
                                            handleDelete(lookup.id)
                                        }
                                    />
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
                                    placeholder="Lookup Type"
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
                                    placeholder="Lookup Code"
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
                                    placeholder="Lookup Value"
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
                                    placeholder="Lookup Description"
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
                                <Button
                                    type="submit"
                                    variant="default"
                                    className="bg-purple-800 hover:bg-purple-700 text-white"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {successPopup && (
                <Popup
                    triggerText=""
                    title="Success!"
                    description="Lookup saved successfully."
                    confirmText="OK"
                    showCancel={false}
                    confirmColor="bg-green-600 hover:bg-green-700 text-white"
                    onConfirm={() => setSuccessPopup(false)}
                />
            )}
            {errorPopup.show && (
                <Popup
                    triggerText=""
                    title="Error"
                    description={errorPopup.message}
                    confirmText="OK"
                    showCancel={false}
                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                    onConfirm={() =>
                        setErrorPopup({ show: false, message: "" })
                    }
                />
            )}
        </AdminLayout>
    );
}
