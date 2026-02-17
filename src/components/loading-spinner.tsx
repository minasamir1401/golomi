"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full"
            />
        </div>
    );
}
