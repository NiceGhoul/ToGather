import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar_User() {
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        router.post("/logout");
    };

    const toggleDropdown = () => {
        setOpen(!open);
    };

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

                <div className="relative flex items-center">
                    <span className="nav-link font-semibold">
                        Welcome, {auth?.user?.nickname ?? "Guest"}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={auth?.user?.avatar} />
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
                            <DropdownMenuItem>Liked Campaign</DropdownMenuItem>
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
