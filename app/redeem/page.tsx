"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Unlock, ArrowLeft, Terminal, Loader2, Download, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";

export default function RedeemPage() {
  const [licenseKey, setLicenseKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{success: boolean, download_link?: string, productName?: string, error?: string} | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey) return;
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim().toUpperCase() })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ success: false, error: "Koneksi ke server terputus." });
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-darker selection:bg-brand-blue/30 relative flex flex-col items-center pt-32 pb-20 px-4 overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-1/4 w-[600px] h-[400px] bg-brand-cyan/10 blur-[120px] rounded-full" />
      </div>

      <Link href="/" className="absolute top-8 left-8 inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md z-50">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
      </Link>

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-darker border border-brand-cyan/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)]">
            <Key className="w-10 h-10 text-brand-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Redeem <span className="text-brand-cyan">Lisensi</span></h1>
          <p className="text-gray-400">Masukkan License Key resmi Anda untuk membuka akses download script.</p>
        </div>

        <AnimatePresence mode="wait">
          {!result?.success ? (
            <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
              <form onSubmit={handleRedeem}>
                <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider text-center">Format: NATA-XXXX-XXXX</label>
                <div className="relative mb-6">
                  <input 
                    required type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    className="w-full bg-black/50 border-2 border-white/10 rounded-2xl px-6 py-5 text-center text-2xl text-white font-black tracking-widest focus:border-brand-cyan focus:ring-0 outline-none transition-all placeholder:text-gray-700 uppercase" 
                    placeholder="NATA-ABCD-1234" 
                  />
                </div>

                {result?.error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center text-center">
                    <XCircle className="w-5 h-5 mr-2" /> {result.error}
                  </motion.div>
                )}

                <button type="submit" disabled={isProcessing || !licenseKey} className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-lg ${isProcessing || !licenseKey ? "bg-gray-800 text-gray-500" : "bg-gradient-to-r from-brand-cyan to-brand-blue text-white hover:scale-[1.02]"}`}>
                  {isProcessing ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Memvalidasi...</> : <><Unlock className="w-5 h-5 mr-2" /> Buka Akses Download</>}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 rounded-3xl border border-green-500/30 shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)] text-center relative overflow-hidden">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <Unlock className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Akses Terbuka!</h2>
              <p className="text-gray-400 mb-8">Lisensi valid. Anda sekarang memiliki akses penuh ke produk <b className="text-white">{result.productName}</b>.</p>
              
              <a href={result.download_link} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:-translate-y-1">
                <Download className="w-6 h-6 mr-2" /> DOWNLOAD SCRIPT
              </a>
              
              <p className="mt-6 text-xs text-gray-500 flex items-center justify-center"><ShieldCheck className="w-4 h-4 mr-1"/> Tolong jangan sebar luaskan link ini.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}