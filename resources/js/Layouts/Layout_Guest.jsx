// Layout_Guest.jsx
import Navbar_Guest from "../Components/Navbar_Guest";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import Footer from "../Components/Footer";

export default function Layout_Guest({ children }) {
    const page = usePage();

    return (
        <>
            <Navbar_Guest />
            <AnimatePresence mode="wait">
                <motion.main
                    key={page.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full max-w-none !p-0 !m-0 overflow-x-hidden overflow-y-hidden"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            <Footer />
        </>
    );
}
