"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, ArrowRight, Terminal, Receipt, Loader2, ShieldCheck, CheckCircle2, XCircle, Clock, Star, MessageSquare } from "lucide-react";
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
    
    // Bersihkan input (jika pembeli mengetik "INV-123", kita ambil "123" nya saja)
    const cleanId = invoiceId.replace(/INV-/i, "").trim();
    
    try {
      // 1. Ambil data orders dari API
      const resOrders = await fetch("/api/system?type=orders");
      const dataOrders = await resOrders.json();
      
      if (dataOrders.data) {
        // 🔥 SMART SEARCH: Cek exact match ATAU awalan ID-nya (startsWith)
        const foundOrder = dataOrders.data.find((o: any) => o.id === cleanId || o.id.startsWith(cleanId));
        
        if (foundOrder) {
          setOrderData(foundOrder);
          
          // 2. Jika ketemu, cek apakah sudah pernah di-review
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
    <div className="flex flex-col items-center min-h-screen pb-20 relative overflow-hidden">
      
      {/* 🌌 BACKGROUND GRID PATTERN */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 w-[600px] h-[400px] bg-brand-blue/10 blur-[120px] rounded-full" />
      </div>

      {/* 🛸 FLOATING NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl glass rounded-full px-6 py-4 flex justify-between items-center backdrop-blur-md"
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Terminal className="text-brand-cyan w-6 h-6" />
          <span>Nata<span className="text-brand-blue">kenshi.</span></span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
          <Link href="/#products" className="hover:text-white transition-colors">Produk</Link>
        </div>
        <button 
          onClick={() => { setOrderData(null); setInvoiceId(""); setErrorMsg(""); }}
          className="bg-brand-blue/20 text-brand-cyan border border-brand-blue/30 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-brand-blue hover:text-white"
        >
          Cari Ulang
        </button>
      </motion.nav>

      <div className="w-full max-w-2xl px-4 pt-48 relative z-10 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!orderData ? (
            /* 🎯 FORM PENCARIAN (Tampil jika belum ada data order yang dicari) */
            <motion.div key="search" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-darker border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)]">
                  <Receipt className="w-10 h-10 text-brand-blue" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                  Lacak <span className="text-gradient">Pesanan</span>
                </h1>
                <p className="text-gray-400 text-lg">Masukkan Nomor Invoice (Order ID) Anda untuk melihat status.</p>
              </div>

              <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/20 blur-[50px] rounded-full" />

                <form onSubmit={handleTrack} className="relative z-10">
                  <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider pl-1">
                    Nomor Invoice
                  </label>
                  
                  <div className="relative mb-6 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-brand-cyan transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={invoiceId}
                      onChange={(e) => setInvoiceId(e.target.value)}
                      className={`w-full bg-darker/80 border-2 rounded-2xl pl-14 pr-6 py-5 text-lg text-white font-mono focus:ring-0 outline-none transition-all placeholder:font-sans placeholder:text-gray-600 ${errorMsg ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-blue'}`} 
                      placeholder="Contoh: INV-17112345678" 
                    />
                  </div>

                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-start">
                      <XCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {errorMsg}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isProcessing || !invoiceId}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isProcessing || !invoiceId
                        ? "bg-gray-700 cursor-not-allowed text-gray-400 border border-white/5"
                        : "bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 text-white hover:-translate-y-1 shadow-brand-blue/30"
                    }`}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Mencari Data...</>
                    ) : (
                      <>Cek Status <ArrowRight className="w-5 h-5 ml-2" /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* 📄 HASIL PENCARIAN (Tampil jika order ditemukan) */
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              
              <button onClick={() => setOrderData(null)} className="mb-6 inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali Pencarian
              </button>

              <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Efek Warna Berdasarkan Status */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none opacity-50 ${orderData.status === 'Sukses' ? 'bg-green-500/20' : orderData.status === 'Batal' ? 'bg-red-500/20' : 'bg-amber-500/20'}`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                    <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Status Pembayaran</p>
                      {orderData.status === 'Sukses' ? (
                        <div className="flex items-center text-2xl font-black text-green-400"><CheckCircle2 className="w-6 h-6 mr-2" /> BERHASIL</div>
                      ) : orderData.status === 'Batal' ? (
                        <div className="flex items-center text-2xl font-black text-red-400"><XCircle className="w-6 h-6 mr-2" /> DIBATALKAN</div>
                      ) : (
                        <div className="flex items-center text-2xl font-black text-amber-400"><Clock className="w-6 h-6 mr-2 animate-pulse" /> PENDING</div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm font-medium mb-1">ID Order</p>
                      <span className="font-mono text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">INV-{orderData.id.substring(0,8)}</span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-4">
                    <div className="bg-darker/50 p-5 rounded-2xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Produk</p>
                        <p className="font-bold text-white text-lg">{orderData.productTitle}</p>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-brand-cyan opacity-50" />
                    </div>
                  </div>

                  {/* 🔥 KOTAK LICENSE KEY (BARU & MEWAH) 🔥 */}
                  {orderData.status === 'Sukses' && orderData.licenseKey && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 border border-brand-blue/30 rounded-2xl p-6 mb-8 text-center relative overflow-hidden shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 blur-[40px] rounded-full pointer-events-none" />
                      <p className="text-brand-cyan text-xs font-bold uppercase tracking-widest mb-2 flex justify-center items-center"><ShieldCheck className="w-4 h-4 mr-1"/> License Key Resmi Anda</p>
                      
                      <div className="flex items-center justify-center gap-3">
                        <code className="text-3xl font-black text-white tracking-widest select-all">{orderData.licenseKey}</code>
                      </div>
                      
                      <Link href="/redeem" className="inline-block mt-4 bg-brand-blue hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:-translate-y-1">
                        Redeem / Download Script
                      </Link>
                    </motion.div>
                  )}

                  {/* 🔥 FORM ULASAN BINTANG 5 (Hanya Muncul Jika Sukses) */}
                  {orderData.status === 'Sukses' && (
                    <div className="border-t border-white/10 pt-8 mt-4">
                      {!hasReviewed ? (
                        <div className="bg-gradient-to-br from-brand-blue/10 to-transparent border border-brand-blue/20 rounded-2xl p-6 shadow-inner">
                          <h3 className="text-white font-bold mb-4 flex items-center"><Star className="w-5 h-5 mr-2 text-amber-400" /> Berikan Ulasan Produk</h3>
                          <form onSubmit={handleSubmitReview}>
                            <div className="flex gap-2 mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" onClick={() => setRating(star)} className={`transition-all hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-gray-600'}`}>
                                  <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400' : ''}`} />
                                </button>
                              ))}
                            </div>
                            <textarea required value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tulis pengalaman Anda menggunakan script ini..." className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-brand-blue mb-4 min-h-[100px]" />
                            <button type="submit" disabled={isSubmittingReview} className="w-full bg-brand-blue hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 mr-2" /> {isSubmittingReview ? "Mengirim..." : "Kirim Ulasan Bintang 5"}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center flex flex-col items-center">
                          <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}</div>
                          <p className="text-green-400 font-bold text-lg">Ulasan Anda Telah Diterima!</p>
                          <p className="text-sm text-gray-400 mt-1">Terima kasih telah berbelanja di Natakenshi Developer.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Keterangan jika masih pending */}
                  {orderData.status === 'Pending' && (
                    <div className="text-center p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                      <p className="text-amber-400 font-medium mb-1">Menunggu Verifikasi Admin</p>
                      <p className="text-sm text-gray-400">Jika Anda sudah mentransfer, mohon tunggu admin mengonfirmasi pembayaran Anda.</p>
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