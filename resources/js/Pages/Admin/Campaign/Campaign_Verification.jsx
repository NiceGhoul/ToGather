import { usePage, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Popup from "@/Components/Popup";
import { Eye, EyeOff, Trash, RotateCcw, File, Ban, CheckCircle, XCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip } from "@/Components/ui/tooltip";

export default function Campaign_Verification() {

    const { campaigns, filters, categories } = usePage().props;
    const [allCampaigns, setAllCampaigns] = useState(campaigns || []);
    const [filteredCampaign, setFilteredCampaigns] = useState(campaigns || []);
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(campaigns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCampaigns = campaigns.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedIds([]);
        }
    };

       const handleResetFilter = () => {
           setCategory("");
           setSearch("");
       };

    useEffect(() => {
        let result = allCampaigns;
        if (category != "") {
            result = result.filter((a) => a.category === category);
        }

        if (search.trim() != "") {
            result = result.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.user.nickname.toLowerCase().includes(search.toLowerCase())) || a.user.name.toLowerCase().includes(search.toLowerCase())
        }

        setFilteredCampaigns(result);
    }, [allCampaigns, search, category, status]);

    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(currentCampaigns.map((a) => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleView = (id) => {
        router.get(`/admin/campaigns/view/${id}`)
    }

    const handleDelete = (id) => {
        router.post(`/admin/campaigns/delete/${id}`)
    }

      const handleChangeStatus = (id, status) => {
          router.post(`/admin/campaigns/changeStatus/${id}`, status);
      };

    return (
        <Layout_Admin title="Verify Campaigns">
            <div className="p-6 space-y-6">
                {/* 🔎 Filter & Bulk Section */}
                <div className="dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                    {/* Row 1: Search & Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by title/creator"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-[300px] h-10 border-[0.5px] focus-visible:ring-purple-700 dark:text-white dark:focus-visible:ring-purple-400 dark:placeholder:text-white"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className=" w-[260px] h-10
                                rounded-md border-1 border-gray-300
                                bg-white px-3 text-sm text-gray-700 shadow-sm
                                focus:border-purple-700 focus:ring-2 focus:ring-purple-700/50 focus:outline-none
                                dark:bg-gray-800 dark:text-white dark:border-white
                                dark:placeholder:text-gray-400 dark:focus:ring-purple-400"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <Button
                                onClick={handleResetFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Bulk actions */}
                    <div className="flex flex-wrap justify-end items-center gap-2 border-t pt-3">
                        <div className="text-sm mr-auto">
                            {selectedIds.length} selected
                        </div>

                        <Popup
                            triggerText={
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Accept Selected</span>
                                </div>
                            }
                            title="Accept Selected Campaign?"
                            description="campaign status will be set as active and will be shown publicly"
                            confirmText="Yes, Accept Selected"
                            confirmColor="bg-green-600 hover:bg-green-700 text-white"
                            triggerClass="bg-green-200 hover:bg-green-300 text-green-700"
                            disabledValue={selectedIds.length === 0}
                            // onConfirm={handleBulkSelect}
                        />

                        <Popup
                            triggerText={
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <XCircle className="w-4 h-4" />
                                    <span>Reject Selected</span>
                                </div>
                            }
                            title="Reject Selected Campaign?"
                            description="This campaign status will be set as rejected and will inaccessable!"
                            confirmText="Yes, Reject Selected"
                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                            disabledValue={selectedIds.length === 0}
                            // onConfirm={handleBulkDelete}
                        />
                    </div>
                </div>

                <div className="dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <table className="min-w-full border-separate border-spacing-0 dark:bg-gray-800">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                                <th className="px-4 py-2 border dark:border-gray-700 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredCampaign.length > 0 &&
                                            selectedIds.length ===
                                                filteredCampaign.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>
                                <th className="px-4 py-2">Id</th>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Creator</th>
                                <th className="px-4 py-2">Goal Amount</th>
                                <th className="px-4 py-2">Durations</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaign.length > 0 ? (
                                filteredCampaign.map((a) => (
                                    <tr
                                        key={a.id}
                                        class="dark:border-gray-700 px-4 py-2 dark:text-gray-200 dark:hover:bg-gray-800"
                                    >
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2 text-center">
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
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {a.id}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2">
                                            {a.title}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2">
                                            {a.category}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2">
                                            {a.user?.nickname || a.user?.name}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2">
                                            {parseInt(
                                                a.goal_amount
                                            ).toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2">
                                            {a.duration}
                                            {a.duration > 1 ? " days" : " day"}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2 capitalize">
                                            {a.status === "approved"
                                                ? "Approved and Enabled"
                                                : a.status}
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2 text-center">
                                            <div className="flex justify-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        handleView(a.id)
                                                    }
                                                    className="bg-purple-200 hover:bg-purple-300  dark:bg-purple-900 dark:hover:bg-purple-300"
                                                >
                                                    <File className="text-purple-700 dark:text-purple-300" />
                                                </Button>
                                                <Popup
                                                    triggerText={
                                                        <CheckCircle className="w-4 h-4" />
                                                    }
                                                    title="Accept Campaign?"
                                                    description="This campaign status will be set as active and will be shown publicly"
                                                    confirmText="Yes, Confirm"
                                                    confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                                    triggerClass="bg-green-200 hover:bg-green-300 text-green-700"
                                                    onConfirm={() =>
                                                        handleDelete(a.id)
                                                    }
                                                />
                                                <Popup
                                                    triggerText={
                                                        <XCircle className="w-4 h-4" />
                                                    }
                                                    title="Reject Campaign?"
                                                    description="This campaign status will be set as rejected and will inaccessable!"
                                                    confirmText="Yes, Confirm"
                                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                    triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                                                    onConfirm={() =>
                                                        handleDelete(a.id)
                                                    }
                                                />
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
                                        No Campaign found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                     <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
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
        </Layout_Admin>
    );
}
