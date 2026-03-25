"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle2, Clock, ShieldCheck, Wallet, ArrowLeft, RefreshCcw, Download, Receipt, XCircle, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InvoiceClient({ order, payment }: { order: any, payment: any }) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  
  // State untuk Ulasan (Review)
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Cek apakah order ini sudah pernah diberi ulasan
  useEffect(() => {
    const checkReview = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.reviews?.find((r: any) => r.orderId === currentOrder.id)) {
          setHasReviewed(true);
        }
      } catch (e) {}
    };
    checkReview();
  }, [currentOrder.id]);

  const handleCopy = () => {
    if (payment?.number) {
      navigator.clipboard.writeText(payment.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Nomor rekening disalin!");
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/system?type=orders");
      const data = await res.json();
      if (data.data) {
        const updatedOrder = data.data.find((o: any) => o.id === currentOrder.id);
        if (updatedOrder) setCurrentOrder(updatedOrder);
      }
    } catch (error) {
      toast.error("Gagal mengecek server.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText) return toast.error("Komentar ulasan tidak boleh kosong!");
    
    setIsSubmittingReview(true);
    const toastId = toast.loading("Mengirim ulasan...");

    try {
      const slug = currentOrder.productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: currentOrder.id,
          productSlug: slug,
          customerName: currentOrder.customerName,
          rating,
          text: reviewText
        })
      });

      if (res.ok) {
        toast.success("Terima kasih atas ulasan Anda!", { id: toastId });
        setHasReviewed(true);
      } else {
        toast.error("Gagal mengirim ulasan.", { id: toastId });
      }
    } catch (e) {
      toast.error("Terjadi kesalahan server.", { id: toastId });
    }
    setIsSubmittingReview(false);
  };

  const orderDate = currentOrder.date ? new Date(currentOrder.date).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Tanggal tidak tersedia';

  const isSuccess = currentOrder.status === 'Sukses';
  const isCanceled = currentOrder.status === 'Batal';

  return (
    <div className="flex flex-col items-center pb-20 relative min-h-[80vh]">
      
      {/* 🌌 BACKGROUND GRID MEWAH (BARU) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 w-[800px] h-[500px] bg-brand-blue/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-3xl flex justify-between items-center mb-8 relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors bg-darker/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl glass rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row z-10">
        
        {/* Glow Status */}
        <div className={`absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000 ${isSuccess ? 'bg-green-500/10' : isCanceled ? 'bg-red-500/10' : 'bg-brand-blue/10'}`} />

        {/* KIRI: STATUS PEMBAYARAN & INSTRUKSI */}
        <div className="flex-1 p-8 md:p-12 relative z-10 border-b md:border-b-0 md:border-r border-white/10 border-dashed bg-darker/40 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Pembayaran Berhasil
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-2">Terima Kasih!</h1>
                <p className="text-gray-400 text-sm mb-6">Akses produk dan detail pesanan telah dikirimkan ke email <span className="text-white">{currentOrder.customerEmail}</span>.</p>

                {/* 🔥 KOTAK LICENSE KEY (BARU DI HALAMAN INVOICE) 🔥 */}
                {currentOrder.licenseKey && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 border border-brand-blue/30 rounded-2xl p-6 mb-8 text-center relative overflow-hidden shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 blur-[40px] rounded-full pointer-events-none" />
                    <p className="text-brand-cyan text-xs font-bold uppercase tracking-widest mb-2 flex justify-center items-center"><ShieldCheck className="w-4 h-4 mr-1"/> License Key Resmi Anda</p>
                    
                    <div className="flex items-center justify-center gap-3">
                      <code className="text-3xl font-black text-white tracking-widest select-all">{currentOrder.licenseKey}</code>
                    </div>
                    
                    <Link href="/redeem" className="inline-block mt-4 bg-brand-blue hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:-translate-y-1 relative z-10">
                      Redeem / Download Script
                    </Link>
                  </motion.div>
                )}

                {/* 🔥 FORM ULASAN BINTANG 5 */}
                {!hasReviewed ? (
                  <div className="bg-darker/60 border border-white/10 rounded-2xl p-6 mb-8 shadow-inner">
                    <h3 className="text-white font-bold mb-4 flex items-center"><Star className="w-4 h-4 mr-2 text-amber-400" /> Berikan Ulasan Anda</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setRating(star)} className={`transition-all hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-gray-600'}`}>
                            <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                      <textarea required value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Bagaimana kualitas script ini?" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-brand-blue mb-4 min-h-[100px]" />
                      <button type="submit" disabled={isSubmittingReview} className="w-full bg-brand-blue hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 mr-2" /> {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan Bintang 5"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center flex flex-col items-center">
                    <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}</div>
                    <p className="text-green-400 font-bold">Ulasan Anda Telah Diterima!</p>
                    <p className="text-xs text-gray-500 mt-1">Ulasan ini akan ditampilkan di katalog produk.</p>
                  </div>
                )}
              </motion.div>
            ) : isCanceled ? (
              <motion.div key="canceled" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
                  <XCircle className="w-4 h-4 mr-2" /> Dibatalkan
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-2">Pesanan Batal</h1>
                <p className="text-gray-400 text-sm mb-10">Pesanan ini telah dibatalkan atau melewati batas waktu pembayaran.</p>
              </motion.div>
            ) : (
              <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center justify-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
                  <Clock className="w-4 h-4 mr-2 animate-pulse" /> Menunggu Pembayaran
                </div>
                <h1 className="text-3xl font-extrabold text-white mb-2">Selesaikan Tagihan</h1>
                <p className="text-gray-400 text-sm mb-10">Pesanan Anda telah dicatat. Silakan transfer sebelum batas waktu.</p>
                <div className="bg-darker/80 border border-white/5 rounded-2xl p-6 mb-8 shadow-inner">
                  <p className="text-gray-400 text-sm font-medium mb-1">Total Pembayaran</p>
                  <p className="text-4xl font-black text-white tracking-tight mb-6">Rp {Number(currentOrder.price).toLocaleString("id-ID")}</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1.5 flex items-center"><Wallet className="w-3.5 h-3.5 mr-1" /> Metode Pembayaran</p>
                      <p className="text-lg font-bold text-brand-cyan">{payment?.name || currentOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1.5">Nomor Tujuan / Rekening</p>
                      <div className="flex items-center justify-between bg-black/50 border border-white/10 p-3 rounded-xl">
                        <span className="font-mono text-xl font-bold text-white pl-2">{payment?.number || "-"}</span>
                        <button onClick={handleCopy} className="p-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-lg shadow-lg">
                          {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <button onClick={handleRefreshStatus} disabled={isRefreshing} className="w-full border py-4 rounded-xl font-bold flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 border-white/10 text-white shadow-lg">
              <RefreshCcw className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin text-brand-cyan" : ""}`} />
              {isRefreshing ? "Mengecek Mutasi..." : "Cek Status Pembayaran"}
            </button>
          )}
        </div>

        {/* KANAN: DETAIL PESANAN */}
        <div className="w-full md:w-[350px] bg-white/[0.02] p-8 md:p-12 relative z-10 flex flex-col backdrop-blur-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center text-white border-b border-white/10 pb-4"><Receipt className="mr-2 text-brand-blue" /> Detail Pesanan</h3>
          <div className="space-y-6 flex-1">
            <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p><p className="font-mono text-white text-sm bg-white/5 inline-block px-2 py-0.5 rounded border border-white/5">INV-{currentOrder.id}</p></div>
            <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Tanggal & Waktu</p><p className="text-gray-300 text-sm">{orderDate}</p></div>
            <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Status</p><p className={`text-sm font-bold ${isSuccess ? 'text-green-400' : isCanceled ? 'text-red-400' : 'text-amber-400'}`}>{currentOrder.status.toUpperCase()}</p></div>
            <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Produk</p><p className="font-bold text-white text-sm">{currentOrder.productTitle}</p></div>
            <div><p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Data Pembeli</p><p className="text-gray-300 text-sm">{currentOrder.customerName}</p></div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <ShieldCheck className={`w-8 h-8 mx-auto mb-3 opacity-80 ${isSuccess ? 'text-green-400' : 'text-brand-blue'}`} />
            <p className="text-xs text-gray-400 leading-relaxed">
              Transaksi diamankan oleh Natakenshi Developer. Harap simpan Invoice ID ini.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}