"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, ArrowRight, Receipt, Loader2, ShieldCheck, CheckCircle2, XCircle, Clock, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TrackClient() {
  const [invoiceId, setInvoiceId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State untuk menampung hasil pencarian
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // State untuk Ulasan (Review)
  const [hasReviewed, setHasReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId) return;
    
    setIsProcessing(true);
    setErrorMsg("");
    setOrderData(null);
    setHasReviewed(false);
    
    const cleanId = invoiceId.replace(/INV-/i, "").trim();
    
    try {
      const resOrders = await fetch("/api/system?type=orders");
      const dataOrders = await resOrders.json();
      
      if (dataOrders.data) {
        const foundOrder = dataOrders.data.find((o: any) => o.id === cleanId || o.id.startsWith(cleanId));
        
        if (foundOrder) {
          setOrderData(foundOrder);
          
          const resReviews = await fetch("/api/reviews");
          const dataReviews = await resReviews.json();
          if (dataReviews.reviews?.find((r: any) => r.orderId === foundOrder.id)) {
            setHasReviewed(true);
          }
        } else {
          setErrorMsg("Pesanan tidak ditemukan. Pastikan ID Invoice sudah benar.");
        }
      } else {
        setErrorMsg("Gagal memuat data sistem.");
      }
    } catch (error) {
      setErrorMsg("Terjadi kesalahan koneksi ke server.");
    }
    
    setIsProcessing(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText) return toast.error("Komentar ulasan tidak boleh kosong!");
    
    setIsSubmittingReview(true);
    const toastId = toast.loading("Mengirim ulasan...");

    try {
      const slug = orderData.productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.id,
          productSlug: slug,
          customerName: orderData.customerName,
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

  return (
    <div className="flex flex-col items-center min-h-screen py-12 md:py-24 relative overflow-hidden">
      
      {/* 🌌 BACKGROUND GRID PATTERN */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[400px] bg-brand-blue/10 blur-[100px] md:blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl px-4 md:px-6 relative z-10 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!orderData ? (
            /* 🎯 FORM PENCARIAN */
            <motion.div key="search" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
              <div className="text-center mb-8 md:mb-10 mt-8 md:mt-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-darker border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)]">
                  <Receipt className="w-8 h-8 md:w-10 md:h-10 text-brand-blue" />
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">
                  Lacak <span className="text-gradient">Pesanan</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-lg max-w-md mx-auto">Masukkan Nomor Invoice (Order ID) Anda untuk melihat status.</p>
              </div>

              <div className="glass p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/20 blur-[50px] rounded-full" />

                <form onSubmit={handleTrack} className="relative z-10">
                  <label className="block text-xs md:text-sm font-bold text-gray-300 mb-2 md:mb-3 uppercase tracking-wider pl-1">
                    Nomor Invoice
                  </label>
                  
                  <div className="relative mb-5 md:mb-6 group">
                    <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-500 group-focus-within:text-brand-cyan transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={invoiceId}
                      onChange={(e) => setInvoiceId(e.target.value)}
                      className={`w-full bg-darker/80 border-2 rounded-2xl pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 text-base md:text-lg text-white font-mono focus:ring-0 outline-none transition-all placeholder:font-sans placeholder:text-gray-600 ${errorMsg ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-blue'}`} 
                      placeholder="Contoh: INV-1711..." 
                    />
                  </div>

                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs md:text-sm font-medium flex items-start">
                      <XCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0 mt-0.5" /> {errorMsg}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isProcessing || !invoiceId}
                    className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isProcessing || !invoiceId
                        ? "bg-gray-700 cursor-not-allowed text-gray-400 border border-white/5"
                        : "bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 text-white hover:-translate-y-1 shadow-brand-blue/30"
                    }`}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 md:w-6 md:h-6 mr-2 animate-spin" /> Mencari Data...</>
                    ) : (
                      <>Cek Status <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* 📄 HASIL PENCARIAN */
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              
              <button onClick={() => setOrderData(null)} className="mb-4 md:mb-6 inline-flex items-center text-xs md:text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali Pencarian
              </button>

              <div className="glass p-5 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 blur-[60px] md:blur-[80px] rounded-full pointer-events-none opacity-50 ${orderData.status === 'Sukses' ? 'bg-green-500/20' : orderData.status === 'Batal' ? 'bg-red-500/20' : 'bg-amber-500/20'}`} />
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 border-b border-white/10 pb-5 md:pb-6">
                    <div>
                      <p className="text-gray-400 text-xs md:text-sm font-medium mb-1">Status Pembayaran</p>
                      {orderData.status === 'Sukses' ? (
                        <div className="flex items-center text-xl md:text-2xl font-black text-green-400"><CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 mr-2" /> BERHASIL</div>
                      ) : orderData.status === 'Batal' ? (
                        <div className="flex items-center text-xl md:text-2xl font-black text-red-400"><XCircle className="w-5 h-5 md:w-6 md:h-6 mr-2" /> DIBATALKAN</div>
                      ) : (
                        <div className="flex items-center text-xl md:text-2xl font-black text-amber-400"><Clock className="w-5 h-5 md:w-6 md:h-6 mr-2 animate-pulse" /> PENDING</div>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="text-gray-400 text-xs md:text-sm font-medium mb-1">ID Order</p>
                      <span className="font-mono text-white bg-white/10 px-3 py-1.5 md:py-1 rounded-lg border border-white/10 text-sm md:text-base">INV-{orderData.id.substring(0,8)}</span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-4">
                    <div className="bg-darker/50 p-4 md:p-5 rounded-2xl border border-white/5 flex justify-between items-center gap-4">
                      <div className="overflow-hidden">
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Produk</p>
                        <p className="font-bold text-white text-base md:text-lg truncate">{orderData.productTitle}</p>
                      </div>
                      <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-brand-cyan opacity-50 flex-shrink-0" />
                    </div>
                  </div>

                  {/* 🔥 KOTAK LICENSE KEY */}
                  {orderData.status === 'Sukses' && orderData.licenseKey && (
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 border border-brand-blue/30 rounded-2xl p-5 md:p-6 mb-6 md:mb-8 text-center relative overflow-hidden shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]">
                      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-brand-cyan/20 blur-[40px] rounded-full pointer-events-none" />
                      <p className="text-brand-cyan text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 flex justify-center items-center"><ShieldCheck className="w-3 h-3 md:w-4 md:h-4 mr-1"/> License Key Resmi Anda</p>
                      
                      <div className="flex items-center justify-center py-2">
                        <code className="text-lg md:text-3xl font-black text-white tracking-widest select-all break-all">{orderData.licenseKey}</code>
                      </div>
                      
                      <Link href="/redeem" className="inline-block mt-3 md:mt-4 bg-brand-blue hover:bg-blue-600 text-white px-5 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-lg hover:-translate-y-1">
                        Redeem / Download Script
                      </Link>
                    </motion.div>
                  )}

                  {/* 🔥 FORM ULASAN BINTANG 5 */}
                  {orderData.status === 'Sukses' && (
                    <div className="border-t border-white/10 pt-6 md:pt-8 mt-2 md:mt-4">
                      {!hasReviewed ? (
                        <div className="bg-gradient-to-br from-brand-blue/10 to-transparent border border-brand-blue/20 rounded-2xl p-5 md:p-6 shadow-inner">
                          <h3 className="text-white font-bold text-sm md:text-base mb-3 md:mb-4 flex items-center"><Star className="w-4 h-4 md:w-5 md:h-5 mr-2 text-amber-400" /> Berikan Ulasan Produk</h3>
                          <form onSubmit={handleSubmitReview}>
                            <div className="flex gap-2 mb-4 justify-center sm:justify-start">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setRating(star)} className={`transition-all hover:scale-110 p-1 ${rating >= star ? 'text-amber-400' : 'text-gray-600'}`}>
                                  <Star className={`w-7 h-7 md:w-8 md:h-8 ${rating >= star ? 'fill-amber-400' : ''}`} />
                                </button>
                              ))}
                            </div>
                            <textarea required value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tulis pengalaman Anda menggunakan script ini..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 md:p-4 text-white text-xs md:text-sm outline-none focus:border-brand-blue mb-3 md:mb-4 min-h-[90px] md:min-h-[100px]" />
                            <button type="submit" disabled={isSubmittingReview} className="w-full bg-brand-blue hover:bg-blue-600 text-white py-3 rounded-xl text-sm md:text-base font-bold transition-all flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 mr-2" /> {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan Bintang 5"}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 md:p-6 text-center flex flex-col items-center">
                          <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400" />)}</div>
                          <p className="text-green-400 font-bold text-base md:text-lg">Ulasan Anda Telah Diterima!</p>
                          <p className="text-xs md:text-sm text-gray-400 mt-1">Terima kasih telah berbelanja di Natakenshi Developer.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Keterangan jika masih pending */}
                  {orderData.status === 'Pending' && (
                    <div className="text-center p-5 md:p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl mt-4">
                      <p className="text-amber-400 text-sm md:text-base font-medium mb-1">Menunggu Verifikasi Admin</p>
                      <p className="text-xs md:text-sm text-gray-400">Jika Anda sudah mentransfer, mohon tunggu admin mengonfirmasi pembayaran Anda.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}