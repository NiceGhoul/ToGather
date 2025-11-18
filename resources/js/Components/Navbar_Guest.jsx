import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar_Guest() {
    // fungsi bantu kalau mau highlight aktif
    const isActive = (path) => window.location.pathname.startsWith(path);

    return (
        <header>
            <nav className="flex justify-between items-center px-6 py-4">
                {/* 🔹 LEFT SIDE (Home, Campaign, Article) */}
                <div className="flex items-center gap-4">
                    {/* HOME */}
                    <Link
                        href="/"
                        className={`px-3 py-2 rounded-md transition-all duration-200 ${
                            isActive("/") &&
                            !isActive("/articles") &&
                            !isActive("/campaigns")
                                ? "bg-white/20 text-white font-semibold"
                                : "hover:bg-white/10 text-white font-semibold"
                        }`}
                    >
                        Home
                    </Link>

                    {/* CAMPAIGN DROPDOWN */}
                    <div className="relative group">
                        <button
                            type="button"
                            className={`flex items-center px-3 py-2 rounded-md leading-none transition-all duration-200 text-white font-semibold ${
                                isActive("/campaigns")
                                    ? "bg-white/20"
                                    : "hover:bg-white/10"
                            }`}
                        >
                            Campaign
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </button>

                        <div
                            className="absolute left-0 top-full min-w-[260px] rounded-xl bg-white text-gray-900 shadow-lg py-2 px-2 z-50
                                opacity-0 translate-y-1 pointer-events-none
                                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                                transition-all duration-150"
                        >
                            <Link
                                href="/campaigns/list"
                                className="block px-3 py-2 text-sm rounded-md hover:bg-slate-100"
                            >
                                Browse Campaigns
                            </Link>
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-sm rounded-md font-semibold hover:bg-slate-100"
                            >
                                Start a Campaign
                            </Link>
                        </div>
                    </div>

                    {/* ARTICLE DROPDOWN */}
                    <div className="relative group">
                        <button
                            type="button"
                            className={`flex items-center px-3 py-2 rounded-md leading-none transition-all duration-200 text-white font-semibold ${
                                isActive("/articles")
                                    ? "bg-white/20"
                                    : "hover:bg-white/10"
                            }`}
                        >
                            Article
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </button>

                        <div
                            className="absolute left-0 top-full min-w-[260px] rounded-xl bg-white text-gray-900 shadow-lg py-2 px-2 z-50
                                opacity-0 translate-y-1 pointer-events-none
                                group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                                transition-all duration-150"
                        >
                            <Link
                                href="/articles/list"
                                className="block px-3 py-2 text-sm rounded-md hover:bg-slate-100"
                            >
                                Browse Articles
                            </Link>
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-sm font-semibold rounded-md hover:bg-slate-100"
                            >
                                Write an Article
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 🔹 RIGHT SIDE (Login / Register) */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/users/create"
                        className="px-3 py-2 rounded-md text-white font-semibold hover:bg-white/10 transition-all"
                    >
                        Sign Up
                    </Link>
                    <Link
                        href="/login"
                        className="px-3 py-2 rounded-md text-white font-semibold hover:bg-white/10 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </nav>
        </header>
    );
}
