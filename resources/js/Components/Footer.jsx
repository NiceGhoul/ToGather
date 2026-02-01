import { Link } from "@inertiajs/react";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-purple-50 border-t border-purple-10 dark:bg-purple-900 ">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between text-gray-700 text-left gap-12">
                {/*Brand & About */}
                <div className="flex-2">
                    <h2 className="text-xl font-semibold text-purple-700 mb-2 dark:text-white">
                        ToGather
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-600 max-w-xs dark:text-white">
                        A crowdfunding platform that empowers small businesses
                        and entrepreneurs to gather support and grow together.
                    </p>
                </div>

                {/*Navigation */}
                <div className="flex-2">
                    <h3 className="font-semibold mb-3 text-purple-700 dark:text-white">
                        Explore
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                href="/home"
                                className="hover:text-purple-600 dark:text-white"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/articles/list"
                                className="hover:text-purple-600 dark:text-white"
                            >
                                Articles
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/campaigns/list"
                                className="hover:text-purple-600 dark:text-white"
                            >
                                Campaigns
                            </Link>
                        </li>
                        <li>
                            <Link href="/#" className="hover:text-purple-600 dark:text-white">
                                About
                            </Link>
                        </li>
                    </ul>
                </div>

                {/*Social Media */}
                <div className="flex-1">
                    <h3 className="font-semibold mb-3 text-purple-700 dark:text-white">
                        Connect
                    </h3>
                    <div className="flex space-x-4 text-gray-500 dark:text-white">
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

            {/*Bottom Bar */}
            <div className="border-t border-purple-100  py-4 text-center text-sm text-white-500">
                <p className="flex items-center justify-center gap-1">
                    © 2025 ToGather · Made with{" "}
                    <Heart size={14} className="text-red-500" />
                </p>
            </div>
        </footer>
    );
}
