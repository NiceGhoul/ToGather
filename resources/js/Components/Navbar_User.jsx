import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    const draft = props.draft_campaign
    const isActive = (path) => url.startsWith(path);

    const handleStart = () => {
        if(draft){
            router.get(`campaigns/create/detailsPreview/${draft.id}`)
        }else{
            router.get('campaigns/create')
        }
    }

    return (
        <header className="sticky top-0 left-0 right-0 z-50 flex justify-between items-center bg-purple-800">

            <nav className="flex justify-between items-center px-6 py-4 top-0 z-50 w-full bg-purple-800">
                <div className="flex gap-4 items-center">
                    {/* HOME */}
                    <Link
                        href="/home"
                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive("/home")
                                ? "bg-white/20 font-semibold text-white"
                                : "hover:bg-white/10 text-white font-semibold"
                        }`}
                    >
                        Home
                    </Link>

                    <div className="flex items-center gap-4">
                        {/*CAMPAIGN DROPDOWN */}
                        <div className="relative group">
                            <button
                                type="button"
                                className={`flex items-center px-3 py-2 rounded-md leading-none transition-all duration-200 text-white font-semibold
                                            ${
                                                isActive("/campaigns")
                                                    ? "bg-white/20"
                                                    : "hover:bg-white/10"
                                            }`}
                            >
                                Campaign
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            <div
                                className="absolute left-0 top-full min-w-[260px] rounded-xl bg-white dark:bg-gray-800
                                         text-gray-900 dark:text-white shadow-lg py-2 px-2 z-50
                                           opacity-0 translate-y-1 pointer-events-none
                                           group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                                           transition-all duration-150"
                            >
                                <Link
                                    href="/campaigns/list"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    Browse Campaigns
                                </Link>
                                <Link
                                    href="/campaigns/myCampaigns"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    My Campaigns
                                </Link>
                                <Link
                                    href="/campaigns/likedCampaign"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    Liked Campaigns
                                </Link>
                                <div className="border-t dark:border-gray-700 my-2" />
                                <Button
                                    onClick={() => handleStart()}
                                    className="bg-color-none text-black dark:text-white w-full text-start block px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-gray-700">
                                    Start a Campaign
                                </Button>
                            </div>
                        </div>

                        {/*ARTICLE DROPDOWN */}
                        <div className="relative group">
                            <button
                                type="button"
                                className={`flex items-center px-3 py-2 rounded-md leading-none transition-all duration-200 text-white font-semibold
                                            ${
                                                isActive("/articles")
                                                    ? "bg-white/20"
                                                    : "hover:bg-white/10"
                                            }`}
                            >
                                Article
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            <div
                                className="absolute left-0 top-full min-w-[260px] rounded-xl bg-white dark:bg-gray-800
                                         text-gray-900 dark:text-white shadow-lg py-2 px-2 z-50
                                           opacity-0 translate-y-1 pointer-events-none
                                           group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                                           transition-all duration-150"
                            >
                                <Link
                                    href="/articles/list"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    Browse Articles
                                </Link>
                                <Link
                                    href="/articles/myArticles"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    My Articles
                                </Link>
                                <Link
                                    href="/articles/likedArticles"
                                    className="block px-4 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    Liked Articles
                                </Link>
                                <div className="border-t dark:border-gray-700 my-2" />
                                <Link
                                    href="/articles/create"
                                    className="block px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-gray-700"
                                >
                                    Write an Article
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center gap-4">
                    <span className="nav-link font-semibold">
                        Welcome {auth?.user?.nickname ?? "Guest"}
                    </span>
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
                                variant="ghost"
                                size="sm"
                                className="relative p-2"
                            >
                                <Bell className="h-5 w-5 text-white" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                                    notifications.map((notification, index) => (
                                        <div key={notification.id}>
                                            <DropdownMenuItem
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
                                            {index < notifications.length - 1 && (
                                                <Separator />
                                            )}
                                        </div>
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
                            <DropdownMenuItem asChild>
                                <Link href="/profile">Profile</Link>
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
