"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, ShieldCheck, CheckCircle2, ArrowRight, Loader2, User, Mail, CreditCard } from "lucide-react";
import { toast } from "sonner"; // 🔥 IMPORT TOAST DARI SONNER

// FIX TYPESCRIPT: Tambahkan [key: string]: any; agar kebal error
interface Product {
  slug: string;
  title: string;
  price: number | string;
  category: string;
  [key: string]: any; 
}

interface PaymentMethod {
  id: string;
  name: string;
  number: string;
  owner: string;
}

// Komponen Pembantu untuk Render Logo Payment Berdasarkan Nama
const PaymentLogo = ({ name }: { name: string }) => {
  const brand = name.toUpperCase();
  if (brand.includes("DANA")) return <span className="font-extrabold text-blue-500 italic text-lg tracking-tighter">DANA</span>;
  if (brand.includes("GOPAY")) return <span className="font-bold text-green-500 text-lg tracking-tighter">gopay</span>;
  if (brand.includes("OVO")) return <span className="font-black text-purple-600 italic text-lg tracking-tighter">OVO</span>;
  if (brand.includes("QRIS")) return <span className="font-black text-red-500 text-lg flex items-center gap-0.5">QR<span className="text-white bg-red-500 px-1 rounded-sm text-xs">IS</span></span>;
  if (brand.includes("BCA")) return <span className="font-black text-blue-800 italic text-lg">BCA</span>;
  if (brand.includes("MANDIRI")) return <span className="font-bold text-yellow-500 italic text-lg tracking-tighter">mandiri</span>;
  return <span className="font-bold text-gray-300 text-sm">{name}</span>;
};

export default function CheckoutClient({ product }: { product: Product }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [activePayment, setActivePayment] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ambil data metode pembayaran dinamis dari Admin Panel
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/system?type=payments");
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setPaymentMethods(data.data);
          if (data.data.length > 0) setActivePayment(data.data[0]);
        }
      } catch (e) {
        console.error("Gagal memuat metode pembayaran");
      }
    };
    fetchPayments();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔥 MENGGUNAKAN TOAST BUKAN ALERT
    if (!activePayment) {
      toast.error("Pilih metode pembayaran terlebih dahulu!");
      return;
    }
    if (!formData.name || !formData.email) {
      toast.error("Lengkapi data kontak Anda!");
      return;
    }
    
    setIsProcessing(true);
    
    // Munculkan toast loading elegan
    const loadingToastId = toast.loading("Mengamankan pesanan Anda...");

    const orderPayload = {
      customerName: formData.name,
      customerEmail: formData.email,
      productTitle: product.title,
      price: product.price,
      paymentMethod: activePayment.name,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      
      const data = await res.json();

      if (data.success) {
        // Hapus loading, ubah jadi sukses
        toast.success("Pesanan berhasil dicatat!", { id: loadingToastId });
        router.push(`/invoice/${data.orderId}`);
      } else {
        toast.error("Gagal memproses pesanan. Silakan coba lagi.", { id: loadingToastId });
        setIsProcessing(false);
      }
    } catch (e) {
      toast.error("Terjadi kesalahan koneksi ke server.", { id: loadingToastId });
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* 📝 KOLOM KIRI: FORM & PEMBAYARAN */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-7 space-y-8">
        
        {/* Step 1: Informasi Kontak */}
        <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan font-bold text-xl">1</div>
            <h2 className="text-2xl font-bold text-white">Informasi Kontak</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 pl-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input required type="text" className="w-full bg-darker/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all" placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 pl-1">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input required type="email" className="w-full bg-darker/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all" placeholder="john@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Metode Pembayaran */}
        <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xl">2</div>
            <h2 className="text-2xl font-bold text-white">Pilih Metode Pembayaran</h2>
          </div>
          
          {paymentMethods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  onClick={() => setActivePayment(method)}
                  className={`cursor-pointer border rounded-2xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col justify-center min-h-[110px] ${
                    activePayment?.id === method.id 
                      ? "border-brand-blue bg-brand-blue/10 shadow-[0_0_25px_-5px_rgba(37,99,235,0.4)]" 
                      : "border-white/5 bg-darker/40 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  {/* Ceklis Biru jika aktif */}
                  {activePayment?.id === method.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-brand-cyan z-10">
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-2.5 relative z-10">
                    <div className="w-14 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 p-1">
                      <PaymentLogo name={method.name} />
                    </div>
                    <span className="font-bold text-white text-lg leading-tight">{method.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium pl-1">Verifikasi instan setelah konfirmasi</p>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center p-12 border border-white/5 rounded-2xl border-dashed bg-darker/20">
               <Loader2 className="w-10 h-10 text-brand-blue animate-spin mx-auto mb-4 opacity-50" />
               <p className="text-gray-400 font-medium">Memuat metode pembayaran yang diatur Admin...</p>
             </div>
          )}
        </div>
      </motion.div>

      {/* 💰 KOLOM KANAN: RINGKASAN ORDER (STICKY) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5 relative lg:sticky lg:top-32">
        <div className="space-y-6">
          
          <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-blue to-brand-cyan" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-[60px] rounded-full pointer-events-none" />
            
            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-4">Ringkasan Pesanan</h3>
            
            <div className="flex gap-5 mb-6 pb-6 border-b border-white/5">
              <div className="w-20 h-20 rounded-2xl bg-darker border border-white/5 flex items-center justify-center flex-shrink-0 shadow-inner">
                 <CreditCard className="w-9 h-9 text-gray-700" />
              </div>
              <div className="flex flex-col justify-center flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 mb-1.5 self-start">
                  {product.category || "FiveM"}
                </span>
                <p className="font-extrabold text-white text-lg leading-tight line-clamp-2">{product.title}</p>
              </div>
            </div>

            <div className="space-y-3.5 mb-8 text-sm">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Harga Produk</span>
                <span className="text-white">Rp {Number(product.price).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Biaya Layanan & Admin</span>
                <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded text-xs">GRATIS</span>
              </div>
              
              {activePayment && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center py-2.5 px-4 bg-white/[0.03] rounded-xl border border-white/5 mt-3">
                  <span className="text-gray-400 text-xs font-medium">Metode Terpilih:</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-white px-2 py-0.5 rounded shadow-sm scale-90 origin-right"><PaymentLogo name={activePayment.name} /></div>
                    <span className="text-white font-bold text-xs">{activePayment.name}</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-between items-center pt-5 border-t border-white/5 mb-8">
              <p className="text-gray-400 font-semibold">Total Pembayaran</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={isProcessing || !formData.name || !formData.email || !activePayment}
              className={`w-full py-4.5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-lg ${
                isProcessing || !formData.name || !formData.email || !activePayment
                  ? "bg-gray-700 cursor-not-allowed text-gray-400 border border-white/5"
                  : "bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 text-white hover:-translate-y-1 shadow-brand-blue/30"
              }`}
            >
              {isProcessing ? (
                <><Loader2 className="w-6 h-6 mr-2.5 animate-spin" /> Memproses Pesanan...</>
              ) : (
                <>Lanjut ke Pembayaran <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>

          <div className="glass p-6 rounded-3xl flex items-start gap-4 text-sm text-gray-400 border border-white/5 bg-darker/20 backdrop-blur-sm">
            <ShieldCheck className="w-10 h-10 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">Checkout Aman & Terenkripsi</p>
              <p className="leading-relaxed">Data Anda terlindungi. Setelah klik tombol, Anda akan dialihkan ke halaman Invoice untuk detail transfer dan konfirmasi.</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}