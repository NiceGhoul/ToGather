import { AppSidebar } from "@/Components/Sidebar_Admin_Item";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { Link, usePage, router } from "@inertiajs/react";
import { Bell } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { ThemeToggle } from "@/Components/ui/theme-toggle";
import { useState, useEffect } from "react";

export default function Page({ children, title }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = () => {
        router.post("/logout");
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch("/notifications");
            const data = await response.json();
            setNotifications(data);
            const unread = data.filter((n) => !n.read_at).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch("/notifications/read-all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    // Fetch unread count on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="w-full max-w-full h-screen overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center justify-between w-full px-5">
                            <div className="flex items-center gap-2 text-white ">
                                <SidebarTrigger className="-ml-1" />
                                <Separator
                                    orientation="vertical"
                                    className=" data-[orientation=vertical]:h-4"
                                />
                                <h1 className="text-lg font-semibold">
                                    {title}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <DropdownMenu
                                    onOpenChange={(open) => {
                                        if (open) {
                                            fetchNotifications();
                                            if (unreadCount > 0) {
                                                markAllAsRead();
                                            }
                                        }
                                    }}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="relative dark:bg-purple-200 dark:text-black"
                                        >
                                            <Bell className="h-4 w-4" />
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {unreadCount > 9
                                                        ? "9+"
                                                        : unreadCount}
                                                </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-80"
                                    >
                                        <DropdownMenuLabel>
                                            Notifications
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <ScrollArea className="h-80">
                                            {loading ? (
                                                <DropdownMenuItem disabled>
                                                    Loading...
                                                </DropdownMenuItem>
                                            ) : notifications.length === 0 ? (
                                                <DropdownMenuItem disabled>
                                                    No notifications
                                                </DropdownMenuItem>
                                            ) : (
                                                notifications.map(
                                                    (notification, index) => (
                                                        <div
                                                            key={
                                                                notification.id
                                                            }
                                                        >
                                                            <DropdownMenuItem className="flex-col items-start p-3">
                                                                <div className="font-medium">
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(
                                                                        notification.created_at
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </DropdownMenuItem>
                                                            {index <
                                                                notifications.length -
                                                                    1 && (
                                                                <Separator />
                                                            )}
                                                        </div>
                                                    )
                                                )
                                            )}
                                        </ScrollArea>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>
                    <div className="flex-1 overflow-auto">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
