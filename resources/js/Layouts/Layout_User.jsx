// Layout_User.jsx
import Navbar_User from "../Components/Navbar_User";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import Footer from "../Components/Footer";

export default function Layout_User({ children }) {
    const page = usePage();

    return (
        <>
            <Navbar_User />
            <AnimatePresence mode="wait">
                <motion.main
                    key={page.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="pt-200 mt-[200px] w-full max-w-none !p-0 !m-0 overflow-x-hidden overflow-y-auto min-h-screen"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </>
    );
}
