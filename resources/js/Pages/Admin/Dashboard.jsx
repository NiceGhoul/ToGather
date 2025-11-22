import Layout_Admin from "@/Layouts/Layout_Admin";
import { usePage, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useState } from "react";

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
        articleStats
    } = usePage().props;

    const [dailyYear, setDailyYear] = useState(new Date().getFullYear());
    const [dailyMonth, setDailyMonth] = useState(new Date().getMonth() + 1);
    const [dailyWeek, setDailyWeek] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());

    const handleDailyChange = (year, month, week) => {
        setDailyYear(year);
        setDailyMonth(month);
        setDailyWeek(week);
        router.get('/admin/dashboard', { daily_year: year, daily_month: month, daily_week: week }, { preserveState: true });
    };

    const handleWeeklyChange = (year, month) => {
        setSelectedYear(year);
        setSelectedMonth(month);
        router.get('/admin/dashboard', { weekly_year: year, weekly_month: month }, { preserveState: true });
    };

    const handleMonthlyYearChange = (year) => {
        setMonthlyYear(year);
        router.get('/admin/dashboard', { monthly_year: year }, { preserveState: true });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            disabled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <Layout_Admin title={"Welcome, " + user.nickname}>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                </div>

                {/* Debug Info */}
                <div className="text-xs text-gray-500">
                    Daily: {dailyDonations?.length || 0} items,
                    Weekly: {weeklyDonations?.length || 0} items,
                    Monthly: {monthlyDonations?.length || 0} items,
                    Yearly: {yearlyDonations?.length || 0} items
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">👥</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                {userStats.verified_users} verified, {userStats.banned_users} banned
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">🎯</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_campaigns}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pending_campaigns} pending approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">📝</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_articles}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pending_articles} pending review
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground">💰</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_donations)}</div>
                            <p className="text-xs text-muted-foreground">
                                From successful donations
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
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="daily">Daily</TabsTrigger>
                                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                            </TabsList>

                            <TabsContent value="daily" className="mt-6">
                                <div className="h-[500px] w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            Daily Donations - Week {dailyWeek}, {new Date(dailyYear, dailyMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <div className="flex gap-2">
                                            <select
                                                value={dailyYear}
                                                onChange={(e) => handleDailyChange(parseInt(e.target.value), dailyMonth, dailyWeek)}
                                                className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            >
                                                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={dailyMonth}
                                                onChange={(e) => handleDailyChange(dailyYear, parseInt(e.target.value), dailyWeek)}
                                                className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            >
                                                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                    <option key={month} value={month}>
                                                        {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={dailyWeek}
                                                onChange={(e) => handleDailyChange(dailyYear, dailyMonth, parseInt(e.target.value))}
                                                className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            >
                                                <option value={1}>Week 1</option>
                                                <option value={2}>Week 2</option>
                                                <option value={3}>Week 3</option>
                                                <option value={4}>Week 4</option>
                                            </select>
                                        </div>
                                    </div>
                                    {dailyDonations && dailyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">No donation data available</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dailyDonations || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                                                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} stroke="#666" />
                                                <Tooltip
                                                    formatter={(value) => [formatCurrency(value), "Amount"]}
                                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Bar dataKey="amount" fill="url(#dailyGradient)" radius={[4, 4, 0, 0]} />
                                                <defs>
                                                    <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="weekly" className="mt-6">
                                <div className="h-[500px] w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">
                                            Weekly Donations - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => handleWeeklyChange(parseInt(e.target.value), selectedMonth)}
                                                className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            >
                                                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={selectedMonth}
                                                onChange={(e) => handleWeeklyChange(selectedYear, parseInt(e.target.value))}
                                                className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                            >
                                                {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                    <option key={month} value={month}>
                                                        {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {weeklyDonations && weeklyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">No donation data available</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyDonations || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#666" />
                                                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} stroke="#666" />
                                                <Tooltip
                                                    formatter={(value) => [formatCurrency(value), "Amount"]}
                                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Bar dataKey="amount" fill="url(#weeklyGradient)" radius={[4, 4, 0, 0]} />
                                                <defs>
                                                    <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
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
                                        <h3 className="text-lg font-medium">Monthly Donations</h3>
                                        <select
                                            value={monthlyYear}
                                            onChange={(e) => handleMonthlyYearChange(parseInt(e.target.value))}
                                            className="px-3 py-1 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        >
                                            {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {monthlyDonations && monthlyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">No donation data available</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyDonations || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
                                                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} stroke="#666" />
                                                <Tooltip
                                                    formatter={(value) => [formatCurrency(value), "Amount"]}
                                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Bar dataKey="amount" fill="url(#monthlyGradient)" radius={[4, 4, 0, 0]} />
                                                <defs>
                                                    <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="yearly" className="mt-6">
                                <div className="h-[500px] w-full">
                                    <h3 className="text-lg font-medium mb-4">All Years</h3>
                                    {yearlyDonations && yearlyDonations.length === 0 ? (
                                        <div className="h-full flex items-center justify-center">
                                            <p className="text-center text-gray-500 dark:text-gray-400">No donation data available</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={yearlyDonations || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#666" />
                                                <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} stroke="#666" />
                                                <Tooltip
                                                    formatter={(value) => [formatCurrency(value), "Amount"]}
                                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Bar dataKey="amount" fill="url(#yearlyGradient)" radius={[4, 4, 0, 0]} />
                                                <defs>
                                                    <linearGradient id="yearlyGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(campaignStats).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                status === 'pending' ? 'bg-yellow-500' :
                                                status === 'approved' || status === 'active' ? 'bg-green-500' :
                                                status === 'rejected' ? 'bg-red-500' :
                                                status === 'banned' ? 'bg-red-600' :
                                                status === 'disabled' ? 'bg-gray-400' :
                                                status === 'completed' ? 'bg-purple-400' :
                                                'bg-gray-500'
                                            }`}></div>
                                            <span className="font-medium capitalize">{status}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-700 dark:text-white">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Article Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(articleStats).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                status === 'pending' ? 'bg-yellow-500' :
                                                status === 'approved' || status === 'active' ? 'bg-green-500' :
                                                status === 'rejected' ? 'bg-red-500' :
                                                status === 'banned' ? 'bg-red-600' :
                                                status === 'disabled' ? 'bg-gray-400' :
                                                'bg-gray-500'
                                            }`}></div>
                                            <span className="font-medium capitalize">{status}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-700 dark:text-white">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout_Admin>
    );
}
