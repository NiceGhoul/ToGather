import { Link } from "@inertiajs/react";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-purple-50 mt-16 border-t border-purple-100">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between text-gray-700 text-left gap-12">
                {/* 🟣 Brand & About */}
                <div className="flex-2">
                    <h2 className="text-xl font-semibold text-purple-700 mb-2">
                        ToGather
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
                        A crowdfunding platform that empowers small businesses
                        and entrepreneurs to gather support and grow together.
                    </p>
                </div>

                {/* 🟣 Navigation */}
                <div className="flex-2">
                    <h3 className="font-semibold mb-3 text-purple-700">
                        Explore
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/home"
                                className="hover:text-purple-600"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/articles/list"
                                className="hover:text-purple-600"
                            >
                                Articles
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/campaigns/list"
                                className="hover:text-purple-600"
                            >
                                Campaigns
                            </Link>
                        </li>
                        <li>
                            <Link href="/#" className="hover:text-purple-600">
                                About
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 🟣 Social Media */}
                <div className="flex-1">
                    <h3 className="font-semibold mb-3 text-purple-700">
                        Connect
                    </h3>
                    <div className="flex space-x-4 text-gray-500">
                        <a href="#" className="hover:text-purple-600">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="hover:text-purple-600">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="hover:text-purple-600">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* 🟣 Bottom Bar */}
            <div className="border-t border-purple-100 py-4 text-center text-sm text-gray-500">
                <p className="flex items-center justify-center gap-1">
                    © {new Date().getFullYear()} ToGather · Made with{" "}
                    <Heart size={14} className="text-red-500" /> by Harry
                    Sebastian
                </p>
            </div>
        </footer>
    );
}
