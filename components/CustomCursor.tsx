"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Jangan aktifkan efek kursor di HP/Tablet (layar sentuh)
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Deteksi jika kursor berada di atas tombol atau link
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      {/* 🔵 Aura Glow Belakang (Lebih lambat & membesar saat hover tombol) */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 bg-brand-blue/30 blur-md rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1, // Membesar saat menyentuh tombol
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
      {/* 🔵 Titik Inti Cyan (Mengikuti kursor dengan cepat) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-cyan rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: isHovering ? 0 : 1, // Menghilang saat hover tombol agar tidak menghalangi
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
    </>
  );
}