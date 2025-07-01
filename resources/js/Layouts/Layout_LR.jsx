import { motion } from "framer-motion";
export default function Layout_LR({ children }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/LR.png')" }}
      ></div>
      <div className="relative z-10 w-full max-w-xl px-4">
        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
