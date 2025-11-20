import { Head } from "@inertiajs/react";
import { useState } from "react";
import Layout_Admin from "@/Layouts/Layout_Admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Search, DollarSign, Calendar, Target } from "lucide-react";

export default function Transaction({ donations, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // jumlah transaksi per halaman

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const getStatusBadge = (status) => {
        const variants = {
            successful: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        return (
            <Badge
                className={`px-3 py-1 text-sm font-medium ${variants[status]}`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    // 🔍 Filter hasil search
    const filteredDonations = donations.filter(
        (donation) =>
            donation.user?.nickname
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            donation.campaign?.title
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            donation.amount.toString().includes(searchTerm)
    );

    // 📄 Pagination logic
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDonations = filteredDonations.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePrevPage = () =>
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <Layout_Admin>
            <Head title="Transactions" />

            <div className="bg-gray-50 dark:bg-gray-950 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Transaction Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Monitor all donation transactions
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Transactions
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.total_count || 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Amount
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(stats?.total_amount || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Successful
                                </CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats?.successful_count || 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {stats?.pending_count || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by donor name, campaign, or amount..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1); // reset ke halaman 1 pas search
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transactions List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {paginatedDonations.length > 0 ? (
                                    paginatedDonations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {donation.anonymous
                                                                ? "Anonymous"
                                                                : donation.user
                                                                      ?.nickname ||
                                                                  "Unknown"}
                                                        </p>
                                                        {getStatusBadge(
                                                            donation.status
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Donated to:{" "}
                                                        {donation.campaign
                                                            ?.title ||
                                                            "Unknown Campaign"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {formatDate(
                                                            donation.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(
                                                        donation.amount
                                                    )}
                                                </p>
                                                {donation.message && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 max-w-xs truncate">
                                                        "{donation.message}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No transactions found
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={handlePrevPage}
                                    >
                                        Prev
                                    </Button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={handleNextPage}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout_Admin>
    );
}
