"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Terminal, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-darker selection:bg-brand-blue/30 relative flex flex-col justify-between overflow-hidden">
      
      {/* 🌌 BACKGROUND GRID PATTERN (Sama persis dengan HomeClient) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 w-[800px] h-[500px] bg-brand-blue/15 blur-[120px] rounded-full" />
      </div>

      {/* 🛸 FLOATING NAVBAR (Sama persis dengan HomeClient) */}
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
          {/* Ditambah '/' agar kembali ke halaman utama dari halaman 404 */}
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

      {/* 🎯 KONTEN TENGAH (404 ERROR) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full max-w-2xl px-4 mx-auto mt-40 mb-20">
        
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
          className="relative text-center"
        >
          <h1 className="text-[7rem] md:text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-cyan drop-shadow-[0_0_40px_rgba(37,99,235,0.3)]">
            404
          </h1>
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.05, 0.9] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-blue/20 blur-[50px] -z-10 rounded-full"
          />
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 mt-6 shadow-2xl w-full text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4 text-brand-cyan">
            <Terminal className="w-6 h-6 md:w-8 md:h-8" />
            <h2 className="text-lg md:text-2xl font-black tracking-widest uppercase">System Error</h2>
          </div>
          
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed max-w-lg mx-auto">
            Nampaknya Anda tersesat ke dimensi lain. Halaman atau Invoice yang Anda cari sudah menguap dari server <strong className="text-white">NATAKENSHI</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold transition-all hover:-translate-y-1 group text-sm md:text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>
            <Link
              href="/"
              className="flex items-center justify-center px-6 py-4 rounded-full bg-brand-blue hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:-translate-y-1 text-sm md:text-base"
            >
              <Home className="w-5 h-5 mr-2" />
              Beranda Utama
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 🏁 FOOTER PROFESIONAL (Sama persis dengan HomeClient) */}
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