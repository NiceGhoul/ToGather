import { Head, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout_User from "@/Layouts/Layout_User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Heart,
    Target,
    DollarSign,
    Edit,
    LogOut,
    AlertCircle,
    Shield,
    Camera,
    Upload,
    FileText,
} from "lucide-react";

export default function Show({
    auth,
    user,
    stats,
    verificationStatus,
    verificationRequest,
}) {
    // Debug: Log user data
    console.log("User data:", user);
    console.log("Profile image URL:", user.profile_image_url);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [detailsModal, setDetailsModal] = useState({
        open: false,
        type: "",
        data: [],
    });
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(
        user.profile_image || null
    );
    const [uploadingImage, setUploadingImage] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nickname: user.nickname || "",
        current_password: "",
        password: "",
        password_confirmation: "",
        profile_image: null,
        _method: "PUT",
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file));
        setData("profile_image", file);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        post("/profile/update", {
            onSuccess: () => {
                setIsEditOpen(false);
                reset();
                setProfileImage(null);
                // Refresh the page to show updated profile image
                window.location.reload();
            },
        });
    };

    const fetchDetails = async (type) => {
        try {
            const response = await fetch(`/profile/${type}-details`);
            const data = await response.json();
            setDetailsModal({ open: true, type, data });
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    return (
        <Layout_User>
            <Head title="Profile" />

            <div className="bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.profile_image_url} />
                                    <AvatarFallback className="text-2xl">
                                        {user.nickname
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {user.nickname}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {user.email}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                        <Badge variant="secondary">
                                            {user.role}
                                        </Badge>
                                        <Badge variant="outline">
                                            Member since{" "}
                                            {new Date(
                                                user.created_at
                                            ).getFullYear()}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditOpen(true)}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Verification Notice */}
                    {(!verificationRequest ||
                        verificationRequest?.status === "rejected") &&
                        user.status !== "banned" && (
                            <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20">
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <AlertCircle className="h-8 w-8 text-amber-600" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                                                Verification Required
                                            </h3>
                                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                                You need to complete
                                                verification to create campaigns
                                                and articles.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                router.visit(
                                                    "/verification/create"
                                                )
                                            }
                                            className="bg-amber-600 hover:bg-amber-700"
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            Get Verified
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => fetchDetails("campaigns")}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Campaigns Created
                                </CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.campaigns_count || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats?.active_campaigns || 0} Active
                                    {stats?.active_campaigns > 1 ? "s" : ""}
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => fetchDetails("articles")}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Articles Written
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.articles_count || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats?.approved_articles || 0} Approved
                                    {stats?.approved_articles > 1 ? "s" : ""}
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => fetchDetails("donations")}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Donations
                                </CardTitle>
                                <Heart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats?.donations_count || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {formatCurrency(stats?.total_donated || 0)}{" "}
                                    Donated
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => fetchDetails("raised")}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Raised
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(stats?.total_raised || 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    From your campaigns
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Information */}
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Nickname
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {user.nickname}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Email
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Verification Status
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {verificationRequest?.status ===
                                                    "accepted" && (
                                                    <Badge
                                                        variant="default"
                                                        className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium"
                                                    >
                                                        Verified
                                                    </Badge>
                                                )}
                                                {verificationRequest?.status ===
                                                    "pending" && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-3 py-1 text-sm font-medium"
                                                    >
                                                        Pending
                                                    </Badge>
                                                )}
                                                {verificationRequest?.status ===
                                                    "rejected" && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="px-3 py-1 text-sm font-medium"
                                                    >
                                                        Rejected
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Location
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {user.address || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Member Since
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src={
                                            profileImagePreview ||
                                            user.profile_image_url
                                        }
                                    />
                                    <AvatarFallback className="text-xl">
                                        {user.nickname
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 -right-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 rounded-full p-0"
                                        onClick={() =>
                                            document
                                                .getElementById("profile-image")
                                                .click()
                                        }
                                        disabled={processing}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 text-center">
                                Click the camera icon to change your profile
                                picture
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="nickname" className="dark:text-white">Nickname</Label>
                            <Input
                                id="nickname"
                                value={data.nickname}
                                onChange={(e) =>
                                    setData("nickname", e.target.value)
                                }
                                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                            {errors.nickname && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.nickname}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="current_password" className="dark:text-white">
                                Current Password
                            </Label>
                            <Input
                                id="current_password"
                                type="password"
                                value={data.current_password}
                                onChange={(e) =>
                                    setData("current_password", e.target.value)
                                }
                                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                            {errors.current_password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.current_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password" className="dark:text-white">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation" className="dark:text-white">
                                Confirm New Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className="mt-1 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Details Modal */}
            <Dialog
                open={detailsModal.open}
                onOpenChange={(open) =>
                    setDetailsModal({ ...detailsModal, open })
                }
            >
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">
                            {detailsModal.type === "donations" &&
                                "Your Donations"}
                            {detailsModal.type === "campaigns" &&
                                "Your Campaigns"}
                            {detailsModal.type === "raised" &&
                                "Funds Raised by Campaign"}
                            {detailsModal.type === "articles" &&
                                "Your Articles"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {detailsModal.data.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                No data available
                            </p>
                        ) : (
                            detailsModal.data.map((item, index) => (
                                <div
                                    key={index}
                                    className="border dark:border-gray-700 rounded-lg p-4 dark:bg-gray-700/50"
                                >
                                    {detailsModal.type === "donations" && (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold dark:text-white">
                                                    {item.campaign_title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(
                                                        item.amount
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        item.status.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {detailsModal.type === "campaigns" && (
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold dark:text-white">
                                                    {item.title}
                                                </h4>
                                                <Badge
                                                    className={`capitalize px-3 py-1 rounded-md text-white font-medium
                                                        ${
                                                            item.status ===
                                                            "active"
                                                                ? "bg-green-600"
                                                                : item.status ===
                                                                  "rejected"
                                                                ? "bg-red-600"
                                                                : item.status ===
                                                                  "banned"
                                                                ? "bg-red-600"
                                                                : item.status ===
                                                                  "completed"
                                                                ? "bg-purple-600"
                                                                : item.status ===
                                                                  "pending"
                                                                ? "bg-yellow-400 text-black"
                                                                : "bg-gray-400"
                                                        }`}
                                                >
                                                    {item.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        item.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {item.description?.substring(
                                                    0,
                                                    100
                                                )}
                                                ...
                                            </p>
                                            <div className="flex justify-between text-sm dark:text-gray-300">
                                                <span>
                                                    Target:{" "}
                                                    {formatCurrency(
                                                        item.target_amount
                                                    )}
                                                </span>
                                                <span>
                                                    Raised:{" "}
                                                    {formatCurrency(
                                                        item.current_amount || 0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {detailsModal.type === "raised" && (
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold dark:text-white">
                                                    {item.title}
                                                </h4>
                                                <p className="font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(
                                                        item.total_raised
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                                <span>
                                                    {item.donors_count} Donors
                                                </span>
                                                <span>
                                                    {(
                                                        (item.total_raised /
                                                            item.target_amount) *
                                                        100
                                                    ).toFixed(1)}
                                                    % of Target
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {detailsModal.type === "articles" && (
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold dark:text-white">
                                                    {item.title}
                                                </h4>
                                                <Badge
                                                    className={`capitalize px-3 py-1 rounded-md text-white font-medium
                                                        ${
                                                            item.status ===
                                                            "approved"
                                                                ? "bg-green-600"
                                                                : item.status ===
                                                                  "rejected"
                                                                ? "bg-red-600"
                                                                : item.status ===
                                                                  "pending"
                                                                ? "bg-yellow-400 text-black"
                                                                : "bg-gray-400"
                                                        }`}
                                                >
                                                    {item.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        item.status.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                <span>
                                                    Category: {item.category}
                                                </span>
                                                <span>
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                                                <Heart className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {item.likes_count || 0}{" "}
                                                    likes
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Layout_User>
    );
}
