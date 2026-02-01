import { usePage, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import Popup from "@/Components/Popup";
import {
    Eye,
    EyeOff,
    Trash,
    RotateCcw,
    File,
    Ban,
    EyeClosed,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";

export default function Campaign_List() {
    const { campaigns, filters, categories } = usePage().props;
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // ===== Pagination =====
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(
        Math.ceil(campaigns.length / itemsPerPage),
    );
    let startIndex = (currentPage - 1) * itemsPerPage;
    const [filteredCampaign, setFilteredCampaigns] = useState(campaigns || []);

    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const [successPopupMessage, setSuccessPopupMessage] = useState("");

    const statuses = [
        "active",
        "inactive",
        "pending",
        "draft",
        "rejected",
        "completed",
    ];
    const handleResetFilter = () => {
        setCategory("All");
        setStatus("All");
        setSearch("");
    };

    const handleDelete = (id) => {
        router.post(`/admin/campaigns/delete/${id}`);
    };

    useEffect(() => {
        let result = campaigns;

        if (status != "All") {
            result = campaigns.filter((a) => a.status === status);
        }

        if (category != "All") {
            result = campaigns.filter((a) => a.category === category);
        }

        if (search.trim() != "") {
            result =
                campaigns.filter(
                    (a) =>
                        a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.user.nickname
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                ) || a.user.name.toLowerCase().includes(search.toLowerCase());
        }

        setTotalPages(Math.ceil(result.length / itemsPerPage) || 1);
        setFilteredCampaigns(
            result.slice(startIndex, startIndex + itemsPerPage),
        );
    }, [campaigns, search, category, status, handleDelete]);

    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(filteredCampaign.map((a) => a.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleView = (id) => {
        router.get(`/admin/campaigns/view/${id}?from=list`);
    };

    const handleChangeStatus = (id, status) => {
        router.post(`/admin/campaigns/changeStatus/${id}`, { status: status });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSelectedIds([]);
        }
    };

    const handleSuccessClose = () => {
        setSuccessPopupOpen(false);
        router.reload();
    };

    const handleBulkEnable = () => {
        router.post(
            `/admin/campaigns/bulkEnable`,
            { ids: selectedIds },
            {
                onSuccess: () => {
                    setSuccessPopupMessage("Selected Campaigns Enabled");
                    setSuccessPopupOpen(true);
                },
            },
        );
        setSelectedIds([]);
    };

    const handleBulkDisable = () => {
        router.post(
            `/admin/campaigns/bulkDisable`,
            { ids: selectedIds },
            {
                onSuccess: () => {
                    setSuccessPopupMessage("Selected Campaigns Disabled");
                    setSuccessPopupOpen(true);
                },
            },
        );
        setSelectedIds([]);
    };

    const handleBulkDelete = () => {
        router.post(
            `/admin/campaigns/bulkDelete`,
            { ids: selectedIds },
            {
                onSuccess: () => {
                    setSuccessPopupMessage("Selected Campaigns Enabled");
                    setSuccessPopupOpen(true);
                },
            },
        );
        setSelectedIds([]);
    };

    return (
        <Layout_Admin title="Manage Campaigns">
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
                <div className="dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                    {/* Search bar & filter by category */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search by title/creator"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-[260px] focus-visible:ring-purple-700 dark:text-white"
                            />
                            <Select
                                onValueChange={(value) => setCategory(value)}
                                defaultValue="All"
                                className="h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-sm text-gray-700 dark:text-white shadow-sm focus:border-purple-700 focus:ring-2 focus:ring-purple-700/50 focus:outline-none"
                            >
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">
                                        All Categories
                                    </SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={handleResetFilter}
                                className="bg-purple-800 hover:bg-purple-700 text-white"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* filter by status */}
                        <div className="flex items-center gap-2">
                            <Label className="dark:text-white text-base">
                                {"Filter By Status: "}
                            </Label>
                            <Select
                                className="h-10 w-[250px] rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm focus:border-purple-700 focus:ring-2 focus:ring-purple-700/50 focus:outline-none"
                                onValueChange={(value) => setStatus(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"All"}>All</SelectItem>
                                    {statuses.map((dat, idx) => (
                                        <SelectItem key={idx} value={dat}>
                                            {dat.charAt(0).toUpperCase() +
                                                dat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* bulk actions (enable, disable, delete) */}
                    <div className="flex flex-wrap justify-end items-center gap-2 border-t pt-3">
                        <div className="text-sm mr-auto">
                            {selectedIds.length} selected
                        </div>
                        { (status === "inactive") && 
                            <Popup
                                triggerText={
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Eye className="w-4 h-4" />
                                        <span>Enable Selected</span>
                                    </div>
                                }
                                title="Enable Selected Campaigns?"
                                description="All selected campaigns will be enabled and shown publicly."
                                confirmText="Yes, Enable Selected"
                                confirmColor="bg-green-600 hover:bg-green-700 text-white"
                                triggerClass="bg-green-200 hover:bg-green-300 text-green-700"
                                disabledValue={selectedIds.length === 0}
                                onConfirm={handleBulkEnable}
                            />
                        }
                        {(status === "active") && 
                            <Popup
                                triggerText={
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <EyeOff className="w-4 h-4" />
                                        <span>Disable Selected</span>
                                    </div>
                                }
                                title="Disable Selected Campaigns?"
                                description="All selected articles will be disabled and hidden from public."
                                confirmText="Yes, Disable Selected"
                                confirmColor="bg-yellow-600 hover:bg-yellow-700 text-white"
                                triggerClass="bg-yellow-200 hover:bg-yellow-300 text-yellow-700"
                                disabledValue={selectedIds.length === 0}
                                onConfirm={handleBulkDisable}
                            />
                        }

                        <Popup
                            triggerText={
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Trash className="w-4 h-4" />
                                    <span>Delete Selected</span>
                                </div>
                            }
                            title="Delete Selected Campaign?"
                            description="This action cannot be undone. All selected Campaign will be deleted permanently."
                            confirmText="Yes, Delete Selected"
                            confirmColor="bg-red-600 hover:bg-red-700 text-white"
                            triggerClass="bg-red-200 hover:bg-red-300 text-red-700"
                            disabledValue={selectedIds.length === 0}
                            onConfirm={handleBulkDelete}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <table className="min-w-full border-separate border-spacing-0 dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700 dark:text-gray-100">
                            <tr>
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
                                        class="dark:border-gray-700 px-4 py-2 dark:text-gray-200 dark:hover:bg-gray-600 hover:bg-gray-200"
                                    >
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    a.id,
                                                )}
                                                onChange={() =>
                                                    handleToggle(a.id)
                                                }
                                            />
                                        </td>
                                        <td className="border dark:border-gray-700 dark:text-gray-200 px-4 py-2">
                                            {a.id}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {a.title}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {a.category}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {a.user?.nickname || a.user?.name}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {parseInt(
                                                a.goal_amount,
                                            ).toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200">
                                            {a.duration}
                                            {a.duration > 1 ? " days" : " day"}
                                        </td>
                                        <td className="border dark:border-gray-700 px-4 py-2 dark:text-gray-200 capitalize">
                                            {a.status === "approved"
                                                ? "Approved and Enabled"
                                                : a.status}
                                        </td>
                                        <td className=" px-4 py-2 dark:border-gray-700 dark:text-gray-200 text-center">
                                            <div className="flex justify-center gap-3">
                                                <Button
                                                    onClick={() =>
                                                        handleView(a.id)
                                                    }
                                                    className="bg-purple-200 hover:bg-purple-300 cursor-pointer"
                                                >
                                                    <File className="text-purple-700 " />
                                                </Button>
                                                {a.status === "active" && (
                                                    <Button
                                                        className="bg-yellow-200 hover:bg-yellow-300 cursor-pointer"
                                                        onClick={() =>
                                                            handleChangeStatus(
                                                                a.id,
                                                                "inactive",
                                                            )
                                                        }
                                                    >
                                                        <EyeOff className="text-yellow-700" />
                                                    </Button>
                                                )}
                                                {a.status === "inactive" && (
                                                    <Button
                                                        className="bg-green-200 hover:bg-green-300 cursor-pointer"
                                                        onClick={() =>
                                                            handleChangeStatus(
                                                                a.id,
                                                                "active",
                                                            )
                                                        }
                                                    >
                                                        <Eye className="text-green-700" />
                                                    </Button>
                                                )}
                                                {(a.status === "completed" ||
                                                    a.status === "rejected" ||
                                                    a.status === "banned") && (
                                                    <Button className="bg-gray-300/60 cursor-not-allowed text-gray-700 hover:bg-gray-300/60">
                                                        <EyeClosed />
                                                    </Button>
                                                )}
                                                <Popup
                                                    triggerText={
                                                        <Trash className="w-4 h-4" />
                                                    }
                                                    title="Delete Campaign?"
                                                    description="This action cannot be undone. The campaign will be permanently removed."
                                                    confirmText="Yes, Delete"
                                                    confirmColor="bg-red-600 hover:bg-red-700 text-white"
                                                    triggerClass="bg-red-200 hover:bg-red-300 text-red-700 cursor-pointer"
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
