"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { Terminal, Zap, ShieldCheck, Search, Code, Cpu, Filter, ChevronDown } from "lucide-react"; // 🔥 Tambah ChevronDown
import Link from "next/link";

// FIX TYPESCRIPT
interface Product {
  slug: string;
  title: string;
  price: number | string;
  category: string;
  description: string;
  image?: string;
  [key: string]: any; 
}

export default function HomeClient({ products }: { products: Product[] }) {
  // --- STATES ---
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all"); // "all", "free", "paid"
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false); // 🔥 STATE DROPDOWN CUSTOM
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Ambil list kategori unik
  const categories = ["Semua", ...Array.from(new Set(products.map(p => p.category)))];

  const priceOptions = [
    { value: "all", label: "Semua Harga" },
    { value: "free", label: "Gratis (Rp 0)" },
    { value: "paid", label: "Premium Berbayar" }
  ];

  // Fetch reviews saat beranda dibuka untuk ditampilkan bintangnya
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.reviews) setReviews(data.reviews);
      } catch (e) {
        console.error("Gagal memuat ulasan");
      }
    };
    fetchReviews();
  }, []);

  // --- LOGIC FILTERING MULTIGANDA ---
  const filteredProducts = products.filter(p => {
    // 1. Filter Kategori
    const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
    
    // 2. Filter Search Engine (Berdasarkan Judul)
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 3. Filter Harga
    const priceNum = Number(p.price) || 0;
    const matchPrice = 
      priceFilter === "all" ? true : 
      priceFilter === "free" ? priceNum === 0 : 
      priceNum > 0;

    return matchCategory && matchSearch && matchPrice;
  });

  return (
    <div className="min-h-screen bg-darker selection:bg-brand-blue/30 relative">
      
      {/* 🌌 BACKGROUND GRID PATTERN */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 w-[800px] h-[500px] bg-brand-blue/15 blur-[120px] rounded-full" />
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
          <a href="#home" className="hover:text-white transition-colors">Beranda</a>
          <a href="#features" className="hover:text-white transition-colors">Fitur</a>
          <a href="#products" className="hover:text-white transition-colors">Produk</a>
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

      {/* 🚀 HERO SECTION BENTO STYLE */}
      <section id="home" className="relative pt-48 pb-20 px-4 flex flex-col items-center justify-center z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            V1.0 LIVE: ZERO LATENCY MARKETPLACE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, type: "spring" }}
            className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tighter leading-[1.05]"
          >
            Developer System <br />
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">Tanpa Batas.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-medium"
          >
            Marketplace digital super cepat. Temukan script FiveM premium, UI/UX modern, dan tools developer tingkat tinggi.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a href="#products" className="bg-brand-blue hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.8)] flex items-center justify-center gap-2 hover:-translate-y-1">
              <Search className="w-5 h-5" /> Jelajahi Koleksi
            </a>
            <a href="#features" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:-translate-y-1">
              Pelajari Fitur
            </a>
          </motion.div>
        </div>
      </section>

      {/* ✨ BENTO GRID FEATURES SECTION */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[60px] rounded-full group-hover:bg-brand-blue/20 transition-colors" />
              <Zap className="w-10 h-10 text-brand-cyan mb-6" />
              <h3 className="text-3xl font-bold mb-3">0ms Latency Engine</h3>
              <p className="text-gray-400 text-lg max-w-md">Arsitektur Flat-File SSG tanpa database memastikan website memuat halaman secara instan, memberikan pengalaman belanja terbaik.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-brand-blue/30 transition-colors">
              <Code className="w-10 h-10 text-brand-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Clean Architecture</h3>
              <p className="text-gray-400">Semua script ditulis dengan standar tinggi, modular, dan mudah di kustomisasi.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-brand-blue/30 transition-colors">
              <ShieldCheck className="w-10 h-10 text-brand-blue mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3">Keamanan Ekstra</h3>
              <p className="text-gray-400">File bersih dari backdoor. Sistem transaksi direct yang transparan.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-brand-blue/10 to-transparent border border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Siap untuk Server Anda?</h3>
                <p className="text-gray-400">Tingkatkan roleplay server Anda hari ini.</p>
              </div>
              <div className="hidden sm:flex w-16 h-16 rounded-full bg-brand-blue/20 items-center justify-center border border-brand-blue/30 animate-pulse">
                <Cpu className="w-8 h-8 text-brand-cyan" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🛍️ PRODUCT SECTION WITH ADVANCED FILTERING */}
      <section id="products" className="py-24 px-4 max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col gap-6 mb-10">
          {/* HEADER & TOP CONTROLS */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Koleksi <span className="text-gradient">Premium</span></h2>
              <p className="text-gray-400 text-lg">Eksplorasi script dan template terbaik kami.</p>
            </div>
            
            {/* Search & Custom Price Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto z-20">
              
              {/* Kotak Pencarian */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Cari script..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-darker/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none focus:border-brand-blue transition-all placeholder:text-gray-600"
                />
              </div>

              {/* 🔥 CUSTOM DROPDOWN FILTER HARGA MEWAH 🔥 */}
              <div className="relative w-full sm:w-56">
                <button 
                  onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                  className="w-full flex items-center justify-between bg-darker/60 border border-white/10 hover:border-brand-blue/50 rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all shadow-sm"
                >
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 text-brand-cyan mr-2" />
                    <span className="font-medium text-gray-300">
                      {priceOptions.find(opt => opt.value === priceFilter)?.label}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isPriceDropdownOpen ? "rotate-180 text-brand-cyan" : ""}`} />
                </button>

                <AnimatePresence>
                  {isPriceDropdownOpen && (
                    <>
                      {/* Invisible overlay untuk menutup dropdown jika klik di luar */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsPriceDropdownOpen(false)}></div>
                      
                      {/* Kotak Menu Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-full bg-[#0a0f1c] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl"
                      >
                        {priceOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setPriceFilter(opt.value);
                              setIsPriceDropdownOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3.5 text-sm transition-all flex items-center border-b border-white/5 last:border-0
                              ${priceFilter === opt.value 
                                ? "text-brand-cyan bg-brand-blue/10 font-bold" 
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* HORIZONTAL CATEGORY SCROLL (NO WRAP) */}
          <div className="relative w-full overflow-hidden flex items-center pt-2">
            <div className="flex w-full overflow-x-auto gap-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat 
                      ? "bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-lg border border-transparent" 
                      : "text-gray-400 bg-darker/50 border border-white/5 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GRID PRODUK DENGAN ANIMASI */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} reviews={reviews} />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="col-span-full flex flex-col items-center justify-center text-gray-500 py-32 bg-white/5 rounded-3xl border border-white/5 border-dashed"
              >
                <Terminal className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-xl font-medium text-white mb-2">Tidak ada script yang cocok.</p>
                <p className="text-sm">Coba sesuaikan pencarian atau filter harga Anda.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 🏁 FOOTER PROFESIONAL */}
      <footer className="border-t border-white/10 pt-20 pb-8 px-4 relative z-10 bg-darker/90 backdrop-blur-xl mt-20">
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
              <li><a href="#home" className="hover:text-brand-cyan transition-colors">Beranda</a></li>
              <li><a href="#features" className="hover:text-brand-cyan transition-colors">Fitur Sistem</a></li>
              <li><a href="#products" className="hover:text-brand-cyan transition-colors">Katalog Script</a></li>
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