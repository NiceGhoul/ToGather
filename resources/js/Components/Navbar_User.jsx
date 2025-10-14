import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
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
                        <DropdownMenuTrigger className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none">
                            <img
                                src={
                                    auth?.user?.profile_url ??
                                    "https://via.placeholder.com/40"
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
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
                            <DropdownMenuItem disabled>
                                My Article
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
