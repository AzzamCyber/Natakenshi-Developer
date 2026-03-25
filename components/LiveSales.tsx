"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

export default function LiveSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [currentSale, setCurrentSale] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ambil pesanan dari API
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/system?type=orders");
        const data = await res.json();
        if (data.data) {
          // Hanya ambil pesanan yang berstatus "Sukses" agar terlihat nyata
          const successOrders = data.data.filter((o: any) => o.status === 'Sukses');
          if (successOrders.length > 0) setSales(successOrders);
        }
      } catch (e) {}
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (sales.length === 0) return;

    // Logika memunculkan pop-up acak
    const triggerSalePopup = () => {
      const randomSale = sales[Math.floor(Math.random() * sales.length)];
      
      // Sensor nama untuk privasi (Budi Santoso -> Budi***)
      const nameParts = randomSale.customerName?.split(' ') || ["Seseorang"];
      const firstName = nameParts[0];
      const maskedName = firstName.length > 3 ? firstName.substring(0, 3) + "***" : firstName + "***";

      setCurrentSale({ ...randomSale, maskedName });
      setIsVisible(true);

      // Hilangkan pop-up setelah 5 detik
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      // Jadwalkan pop-up berikutnya (acak antara 15 sampai 35 detik)
      const nextTime = Math.floor(Math.random() * (35000 - 15000 + 1)) + 15000;
      setTimeout(triggerSalePopup, nextTime);
    };

    // Mulai trigger pertama setelah 8 detik pengunjung masuk website
    const initialTimer = setTimeout(triggerSalePopup, 8000);

    return () => clearTimeout(initialTimer);
  }, [sales]);

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[8000] pointer-events-none">
      <AnimatePresence>
        {isVisible && currentSale && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-[#0a0f1c]/90 border border-brand-blue/30 p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] backdrop-blur-xl flex items-center gap-4 max-w-[300px] sm:max-w-sm pointer-events-auto cursor-default"
          >
            <div className="w-10 h-10 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center flex-shrink-0 relative">
               <Zap className="w-5 h-5 text-brand-cyan relative z-10" />
               <span className="animate-ping absolute w-full h-full rounded-full bg-brand-cyan/40"></span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">
                <span className="font-bold text-white">{currentSale.maskedName}</span> baru saja membeli
              </p>
              <p className="text-sm font-bold text-brand-cyan line-clamp-1">
                {currentSale.productTitle}
              </p>
              <p className="text-[10px] text-gray-500 flex items-center mt-1 uppercase tracking-wider font-bold">
                <CheckCircle2 className="w-3 h-3 text-green-400 mr-1" /> Terverifikasi
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}