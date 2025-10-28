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

    const { props } = usePage();
    const auth = props.auth;

    return (
        <header>
            <nav className="flex justify-between items-center px-6 py-4">
                <div>
                    <Link className="nav-link" href="/">
                        Home for User
                    </Link>
                    <Link className="nav-link" href="/campaigns/list">
                        Campaign
                    </Link>
                    <Link className="nav-link" href="/articles/list">
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
                                    {auth?.user?.nickname?.charAt(0)?.toUpperCase()}
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
