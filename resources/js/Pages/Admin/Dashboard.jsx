import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const {
        user,
        stats,
        dailyDonations,
        weeklyDonations,
        monthlyDonations,
        yearlyDonations,
        userStats,
        campaignStats,
        articleStats,
    } = usePage().props;

    const [dailyStartDate, setDailyStartDate] = useState("");
    const [dailyEndDate, setDailyEndDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());

    const handleDailyDateChange = (start, end) => {
        setDailyStartDate(start);
        setDailyEndDate(end);
        router.get(
            "/admin/dashboard",
            {
                daily_start: start,
                daily_end: end,
            },
            { preserveState: true }
        );
    };

    const handleWeeklyChange = (year, month) => {
        setSelectedYear(year);
        setSelectedMonth(month);
        router.get(
            "/admin/dashboard",
            { weekly_year: year, weekly_month: month },
            { preserveState: true }
        );
    };

    const handleMonthlyYearChange = (year) => {
        setMonthlyYear(year);
        router.get(
            "/admin/dashboard",
            { monthly_year: year },
            { preserveState: true }
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check dark mode on mount
        setIsDarkMode(document.documentElement.classList.contains("dark"));

        // Listen for changes
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const tooltipStyle = {
        light: {
            backgroundColor: "#e9d5ff",
            border: "1px solid #d8b4fe",
            borderRadius: "8px",
            color: "#000",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
        dark: {
            backgroundColor: "#6b21a8",
            border: "1px solid #7c3aed",
            borderRadius: "8px",
            color: "#fff",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
    };

    const currentTooltipStyle = isDarkMode
        ? tooltipStyle.dark
        : tooltipStyle.light;

    return (
        <Layout_Admin title={"Welcome, " + user.nickname}>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Debug Info */}
                <div className="text-xs text-purple-700 dark:text-white">
                    Daily: {dailyDonations?.length || 0} items, Weekly:{" "}
                    {weeklyDonations?.length || 0} items, Monthly:{" "}
                    {monthlyDonations?.length || 0} items, Yearly:{" "}
                    {yearlyDonations?.length || 0} items
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-purple-200  text-purple-700 dark:bg-purple-800 dark:text-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                👥
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users}
                            </div>
                            <p className="text-xs text-purple-700  dark:text-white">
                                {userStats.verified_users} Verified,{" "}
                                {userStats.banned_users} Banned
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-200  text-purple-700 dark:bg-purple-800 dark:text-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Campaigns
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                🎯
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_campaigns}
                            </div>
                            <p className="text-xs text-purple-700  dark:text-white">
                                {stats.pending_campaigns} Pending Approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-200  text-purple-700 dark:bg-purple-800 dark:text-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Articles
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                📝
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_articles}
                            </div>
                            <p className="text-xs text-purple-700  dark:text-white">
                                {stats.pending_articles} Pending Review
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-200  text-purple-700 dark:bg-purple-800 dark:text-white shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Donations
                            </CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">
                                💰
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.total_donations)}
                            </div>
                            <p className="text-xs text-purple-700  dark:text-white">
                                From Successful Donations
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Donation Chart with Tabs */}
                <Card className="p-10">
                    <CardHeader>
                        <CardTitle>Donation Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="daily" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 ">
                                <TabsTrigger className="" value="daily">
                                    Daily
                                </TabsTrigger>
                                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly">
                                    Monthly
                                </TabsTrigger>
                                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                            </TabsList>

                            <TabsContent value="daily" className="mt-6">
                                <div className="w-full">
                                    <div className="mb-4 space-y-4">
                                        <h3 className="text-lg font-medium dark:text-white">
                                            Daily Donations
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-purple-700 dark:text-white mb-2">
                                                    Start Date
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-white text-purple-700 h-4 w-4" />
                                                    <Input
                                                        type="date"
                                                        value={dailyStartDate}
                                                        onChange={(e) =>
                                                            setDailyStartDate(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 bg-purple-200 dark:bg-purple-800 dark:text-white dark:border-gray-600"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-purple-700 dark:text-white mb-2">
                                                    End Date
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-700 dark:text-white h-4 w-4" />
                                                    <Input
                                                        type="date"
                                                        value={dailyEndDate}
                                                        onChange={(e) =>
                                                            setDailyEndDate(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="pl-10 bg-purple-200 dark:bg-purple-800 dark:text-white dark:border-gray-600"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-end gap-2">
                                                <Button
                                                    onClick={() =>
                                                        handleDailyDateChange(
                                                            dailyStartDate,
                                                            dailyEndDate
                                                        )
                                                    }
                                                    disabled={
                                                        !dailyStartDate ||
                                                        !dailyEndDate
                                                    }
                                                    className="bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                                >
                                                    Apply Filter
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setDailyStartDate("");
                                                        setDailyEndDate("");
                                                        handleDailyDateChange(
                                                            "",
                                                            ""
                                                        );
                                                    }}
                                                    className="bg-red-200 hover:bg-red-300 text-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        </div>
                                        {(dailyStartDate || dailyEndDate) && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">
                                                    Showing:
                                                </span>
                                                {dailyStartDate &&
                                                    dailyEndDate && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="dark:bg-gray-700 dark:text-gray-300"
                                                        >
                                                            {new Date(
                                                                dailyStartDate
                                                            ).toLocaleDateString()}{" "}
                                                            -{" "}
                                                            {new Date(
                                                                dailyEndDate
                                                            ).toLocaleDateString()}
                                                        </Badge>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="h-[400px] w-full">
                                        {dailyDonations &&
                                        dailyDonations.length === 0 ? (
                                            <div className="h-full flex items-center justify-center">
                                                <p className="text-center text-gray-500 dark:text-gray-400">
                                                    No donation data available
                                                </p>
                                            </div>
                                        ) : (
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={dailyDonations || []}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#f0f0f0"
                                                    />
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fontSize: 12 }}
                                                        stroke="#666"
                                                    />
                                                    <YAxis
                                                        tickFormatter={(
                                                            value
                                                        ) =>
                                                            formatCurrency(
                                                                value
                                                            )
                                                        }
                                                        tick={{ fontSize: 12 }}
                                                        stroke="#666"
                                                    />
                                                    <Tooltip
                                                        formatter={(value) => [
                                                            formatCurrency(
                                                                value
                                                            ),
                                                            "Amount",
                                                        ]}
                                                        contentStyle={
                                                            currentTooltipStyle
                                                        }
                                                    />
                                                    <Bar
                                                        dataKey="amount"
                                                        fill="url(#dailyGradient)"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                    <defs>
                                                        <linearGradient
                                                            id="dailyGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#3b82f6"
                                                                stopOpacity={
                                                                    0.8
                                                                }
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#3b82f6"
                                                                stopOpacity={
                                                                    0.3
                                                                }
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="weekly" className="mt-6">
                                <div className="h-[500px] w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            Weekly Donations -{" "}
                                            {new Date(
                                                selectedYear,
                                                selectedMonth - 1
                                            ).toLocaleString("default", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </h3>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedYear}
                                                onChange={(e) =>
                                                    handleWeeklyChange(
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                        selectedMonth
                                                    )
                                                }
                                                className="px-3 py-1 border rounded-md bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                            >
                                                {Array.from(
                                                    { length: 5 },
                                                    (_, i) =>
                                                        new Date().getFullYear() -
                                                        i
                                                ).map((year) => (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={selectedMonth}
                                                onChange={(e) =>
                                                    handleWeeklyChange(
                                                        selectedYear,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="px-3 py-1 border rounded-md bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                            >
                                                {Array.from(
                                                    { length: 12 },
                                                    (_, i) => i + 1
                                                ).map((month) => (
                                                    <option
                                                        key={month}
                                                        value={month}
                                                    >
                                                        {new Date(
                                                            2024,
                                                            month - 1
                                                        ).toLocaleString(
                                                            "default",
                                                            { month: "long" }
                                                        )}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {weeklyDonations &&
                                    weeklyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">
                                                No donation data available
                                            </p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={weeklyDonations || []}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#f0f0f0"
                                                />
                                                <XAxis
                                                    dataKey="week"
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#666"
                                                />
                                                <YAxis
                                                    tickFormatter={(value) =>
                                                        formatCurrency(value)
                                                    }
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#666"
                                                />
                                                <Tooltip
                                                    formatter={(value) => [
                                                        formatCurrency(value),
                                                        "Amount",
                                                    ]}
                                                    contentStyle={
                                                        currentTooltipStyle
                                                    }
                                                    cursor={{
                                                        fill: "rgba(139, 92, 246, 0.1)",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="amount"
                                                    fill="url(#weeklyGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient
                                                        id="weeklyGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#10b981"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#10b981"
                                                            stopOpacity={0.3}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="monthly" className="mt-6">
                                <div className="h-[500px] w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            Monthly Donations
                                        </h3>
                                        <select
                                            value={monthlyYear}
                                            onChange={(e) =>
                                                handleMonthlyYearChange(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="px-3 py-1 border rounded-md bg-purple-200 hover:bg-purple-300 text-purple-700 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white"
                                        >
                                            {Array.from(
                                                { length: 5 },
                                                (_, i) =>
                                                    new Date().getFullYear() - i
                                            ).map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {monthlyDonations &&
                                    monthlyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">
                                                No donation data available
                                            </p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={monthlyDonations || []}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#f0f0f0"
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#666"
                                                />
                                                <YAxis
                                                    tickFormatter={(value) =>
                                                        formatCurrency(value)
                                                    }
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#666"
                                                />
                                                <Tooltip
                                                    formatter={(value) => [
                                                        formatCurrency(value),
                                                        "Amount",
                                                    ]}
                                                    contentStyle={
                                                        currentTooltipStyle
                                                    }
                                                />
                                                <Bar
                                                    dataKey="amount"
                                                    fill="url(#monthlyGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient
                                                        id="monthlyGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#8b5cf6"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#8b5cf6"
                                                            stopOpacity={0.3}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="yearly" className="mt-6">
                                <div className="h-[500px] w-full">
                                    <h3 className="text-lg font-medium mb-4">
                                        All Years
                                    </h3>
                                    {yearlyDonations &&
                                    yearlyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">
                                                No donation data available
                                            </p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={yearlyDonations || []}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#f0f0f0"
                                                />
                                                <XAxis
                                                    dataKey="year"
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#666"
                                                />
                                                <YAxis
                                                    tickFormatter={(value) =>
                                                        formatCurrency(value)
                                                    }
                                                    tick={{ fontSize: 12 }}
                                                    stroke="#666"
                                                />
                                                <Tooltip
                                                    formatter={(value) => [
                                                        formatCurrency(value),
                                                        "Amount",
                                                    ]}
                                                    contentStyle={
                                                        currentTooltipStyle
                                                    }
                                                />
                                                <Bar
                                                    dataKey="amount"
                                                    fill="url(#yearlyGradient)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                                <defs>
                                                    <linearGradient
                                                        id="yearlyGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#f59e0b"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#f59e0b"
                                                            stopOpacity={0.3}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-purple-200  text-purple-700 dark:bg-purple-800  shadow-md">
                        <CardHeader>
                            <CardTitle className="dark:text-white">
                                Campaign Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(campaignStats).map(
                                    ([status, count]) => (
                                        <div
                                            key={status}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-purple-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${
                                                        status === "pending"
                                                            ? "bg-yellow-500"
                                                            : status ===
                                                                  "approved" ||
                                                              status ===
                                                                  "active"
                                                            ? "bg-green-500"
                                                            : status ===
                                                              "rejected"
                                                            ? "bg-red-500"
                                                            : status ===
                                                              "banned"
                                                            ? "bg-red-600"
                                                            : status ===
                                                              "disabled"
                                                            ? "bg-gray-400"
                                                            : status ===
                                                              "completed"
                                                            ? "bg-purple-400"
                                                            : "bg-gray-500"
                                                    }`}
                                                ></div>
                                                <span className="font-medium capitalize">
                                                    {status}
                                                </span>
                                            </div>
                                            <span className="text-2xl font-bold text-purple-700">
                                                {count}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md bg-purple-200  text-purple-700 dark:bg-purple-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">
                                Article Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(articleStats).map(
                                    ([status, count]) => (
                                        <div
                                            key={status}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-purple-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3 ">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${
                                                        status === "pending"
                                                            ? "bg-yellow-500"
                                                            : status ===
                                                                  "approved" ||
                                                              status ===
                                                                  "active"
                                                            ? "bg-green-500"
                                                            : status ===
                                                              "rejected"
                                                            ? "bg-red-500"
                                                            : status ===
                                                              "banned"
                                                            ? "bg-red-600"
                                                            : status ===
                                                              "disabled"
                                                            ? "bg-gray-400"
                                                            : "bg-gray-500"
                                                    } `}
                                                ></div>
                                                <span className="font-medium capitalize">
                                                    {status}
                                                </span>
                                            </div>
                                            <span className="text-2xl font-bold text-purple-700 ">
                                                {count}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout_Admin>
    );
}
