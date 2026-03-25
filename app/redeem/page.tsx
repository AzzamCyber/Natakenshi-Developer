"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Unlock, ArrowLeft, Terminal, Loader2, Download, ShieldCheck, XCircle, Search } from "lucide-react";
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
    <div className="min-h-screen bg-darker selection:bg-brand-blue/30 relative flex flex-col">
      
      {/* 🌌 BACKGROUND GRID PATTERN */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 w-[600px] h-[400px] bg-brand-cyan/10 blur-[120px] rounded-full" />
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
          <Link href="/#home" className="hover:text-white transition-colors">Beranda</Link>
          <Link href="/#features" className="hover:text-white transition-colors">Fitur</Link>
          <Link href="/#products" className="hover:text-white transition-colors">Produk</Link>
          <Link href="/track" className="hover:text-brand-cyan transition-colors font-bold flex items-center">
            <Search className="w-4 h-4 mr-1"/> Lacak Pesanan
          </Link>
        </div>
        <a 
          href="https://github.com/natakenshi" 
          target="_blank"
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all"
        >
          GitHub
        </a>
      </motion.nav>

      {/* 🔑 MAIN CONTENT REDEEM AREA */}
      <main className="relative z-10 pt-36 px-4 flex-1 w-full flex flex-col items-center justify-center pb-20">
        
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-darker border border-brand-cyan/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-10px_rgba(34,211,238,0.4)] relative">
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-full animate-ping" />
              <Key className="w-10 h-10 text-brand-cyan relative z-10" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Redeem <span className="text-brand-cyan">Lisensi</span></h1>
            <p className="text-gray-400">Masukkan License Key resmi Anda untuk membuka akses download script.</p>
          </div>

          <AnimatePresence mode="wait">
            {!result?.success ? (
              <motion.div key="form" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/20 blur-[50px] rounded-full pointer-events-none" />
                
                <form onSubmit={handleRedeem} className="relative z-10">
                  <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider text-center">Format: NATA-XXXX-XXXX</label>
                  <div className="relative mb-6">
                    <input 
                      required type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                      className="w-full bg-black/50 border-2 border-white/10 rounded-2xl px-6 py-5 text-center text-xl md:text-2xl text-white font-black tracking-widest focus:border-brand-cyan focus:ring-0 outline-none transition-all placeholder:text-gray-700 uppercase" 
                      placeholder="NATA-ABCD-1234" 
                    />
                  </div>

                  {result?.error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center justify-center text-center">
                      <XCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {result.error}
                    </motion.div>
                  )}

                  <button type="submit" disabled={isProcessing || !licenseKey} className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all duration-300 shadow-lg ${isProcessing || !licenseKey ? "bg-gray-800 text-gray-500" : "bg-gradient-to-r from-brand-cyan to-brand-blue text-white hover:scale-[1.02]"}`}>
                    {isProcessing ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Memvalidasi...</> : <><Unlock className="w-5 h-5 mr-2" /> Buka Akses Download</>}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-10 rounded-3xl border border-green-500/30 shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0,transparent_100%)] pointer-events-none" />
                
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <Unlock className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Akses Terbuka!</h2>
                <p className="text-gray-400 mb-8">Lisensi valid. Anda sekarang memiliki akses penuh ke produk <b className="text-white">{result.productName}</b>.</p>
                
                <a href={result.download_link} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:-translate-y-1">
                  <Download className="w-6 h-6 mr-2" /> DOWNLOAD SCRIPT
                </a>
                
                <p className="mt-6 text-xs text-gray-500 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1"/> Tolong jangan sebar luaskan link ini.
                </p>

                <button onClick={() => {setResult(null); setLicenseKey("");}} className="mt-8 text-sm font-medium text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                  Redeem Lisensi Lain
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 🏁 FOOTER PROFESIONAL */}
      <footer className="border-t border-white/10 pt-20 pb-8 px-4 relative z-10 bg-darker/90 backdrop-blur-xl mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-4">
              <Terminal className="text-brand-cyan w-6 h-6" />
              <span>Nata<span className="text-brand-blue">kenshi.</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Marketplace digital penyedia script FiveM premium, UI/UX modern, dan tools developer tingkat tinggi. Dibangun dengan arsitektur Zero-Database untuk performa dan keamanan maksimal.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Navigasi</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/#home" className="hover:text-brand-cyan transition-colors">Beranda</Link></li>
              <li><Link href="/#features" className="hover:text-brand-cyan transition-colors">Fitur Sistem</Link></li>
              <li><Link href="/#products" className="hover:text-brand-cyan transition-colors">Katalog Script</Link></li>
              <li><Link href="/track" className="hover:text-brand-cyan transition-colors">Lacak Pesanan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Dukungan</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="https://discord.com" target="_blank" className="hover:text-brand-cyan transition-colors">Discord Server</a></li>
              <li><a href="https://wa.me/6285646021610" target="_blank" className="hover:text-brand-cyan transition-colors">WhatsApp Support</a></li>
              <li><a href="https://github.com/natakenshi" target="_blank" className="hover:text-brand-cyan transition-colors">GitHub Repository</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Natakenshi Developer. All rights reserved.</p>
          <p className="flex items-center">
            Designed & Engineered by <span className="text-white ml-1 font-bold">AZZAM CODEX</span>
          </p>
        </div>
      </footer>
    </div>
  );
}