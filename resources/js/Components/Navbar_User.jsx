import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Navbar_User() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = () => {
        router.post("/logout");
    };

    const toggleDropdown = () => {
        setOpen(!open);
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
            await fetch('/notifications/read-all', {
                method: 'POST',
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


    useEffect(() => {
        fetchNotifications();
    }, []);

    const { url, props } = usePage();
    const auth = props.auth;
    const isActive = (path) => url.startsWith(path);

    return (
        <header>
            <nav className="flex justify-between items-center px-6 py-4">
                <div className="flex gap-4">
                    <Link
                        href="/home"
                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive("/home")
                                ? "bg-white/20 font-semibold text-white"
                                : "hover:bg-white/10 text-white font-semibold"
                        }`}
                    >
                        Home for User
                    </Link>

                    <Link
                        href="/campaigns/list"
                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive("/campaigns")
                                ? "bg-white/20  text-white font-semibold"
                                : "hover:bg-white/10 text-white font-semibold"
                        }`}
                    >
                        Campaign
                    </Link>

                    <Link
                        href="/articles/list"
                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive("/articles")
                                ? "bg-white/20 text-white font-semibold"
                                : "hover:bg-white/10 text-white font-semibold"
                        }`}
                    >
                        Article
                    </Link>
                </div>

                <div className="relative flex items-center gap-4">
                    <span className="nav-link font-semibold">
                        Welcome {auth?.user?.nickname ?? "Guest"}
                    </span>
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
                                variant="ghost"
                                size="sm"
                                className="relative p-2"
                            >
                                <Bell className="h-5 w-5 text-white" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
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
                                    notifications.map((notification) => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            className="flex-col items-start p-3"
                                        >
                                            <div className="font-medium">
                                                {notification.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(
                                                    notification.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={auth?.user?.profile_image_url}
                                />
                                <AvatarFallback>
                                    {auth?.user?.nickname
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                My Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/articles/myArticles">
                                    My Articles
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/articles/likedArticles">Liked Article</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/campaigns/likedCampaign">Liked Campaign</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/campaigns/create">
                                    Create Campaign
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/articles/create">
                                    Create Article
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}
