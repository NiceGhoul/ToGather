// Layout_User.jsx
import Navbar_User from "../Components/Navbar_User";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";

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
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </>
    );
}
