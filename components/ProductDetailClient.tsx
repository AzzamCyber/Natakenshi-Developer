"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ShieldCheck, Zap, Terminal, CheckCircle2, Code, Search, Quote, History } from "lucide-react"; // 🔥 Tambah History
import ReactMarkdown from "react-markdown";

interface Product {
  slug: string;
  title: string;
  price: number | string;
  category: string;
  description: string;
  content?: string;
  image?: string;
  [key: string]: any;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const safeDescription = product.content || product.description || "Deskripsi belum tersedia untuk produk ini.";
  
  // 🔥 STATE & EFFECT UNTUK CHANGELOG
  const [changelogs, setChangelogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const res = await fetch("/api/system?type=changelogs");
        const data = await res.json();
        if (data.data) setChangelogs(data.data);
      } catch (e) {}
    };
    fetchChangelogs();
  }, []);

  // Filter Changelog hanya untuk produk ini dan urutkan dari yang terbaru
  const productChangelogs = changelogs
    .filter((c: any) => c.productSlug === product.slug)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-darker selection:bg-brand-blue/30 relative flex flex-col">
      
      {/* 🌌 BACKGROUND GRID PATTERN */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 w-[600px] h-[400px] bg-brand-cyan/10 blur-[120px] rounded-full" />
      </div>

      {/* 🛸 FLOATING NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl glass rounded-full px-6 py-4 flex justify-between items-center backdrop-blur-md"
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Terminal className="text-brand-cyan w-6 h-6" /><span>Nata<span className="text-brand-blue">kenshi.</span></span>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="/#home" className="hover:text-white transition-colors">Beranda</Link>
          <Link href="/#features" className="hover:text-white transition-colors">Fitur</Link>
          <Link href="/#products" className="hover:text-white transition-colors">Produk</Link>
          <Link href="/track" className="hover:text-brand-cyan transition-colors font-bold flex items-center"><Search className="w-4 h-4 mr-1"/> Lacak Pesanan</Link>
        </div>
        <a href="https://github.com/natakenshi" target="_blank" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all">GitHub</a>
      </motion.nav>

      {/* 📦 KONTEN UTAMA PRODUK */}
      <main className="relative z-10 pt-36 px-4 max-w-6xl mx-auto flex-1 w-full pb-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/#products" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand-cyan transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md hover:border-brand-cyan/30">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI (Gambar & Deskripsi & Changelog) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-8">
            
            <div className="glass rounded-3xl p-2 border border-white/10 overflow-hidden group shadow-2xl relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-cyan/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-dark to-darker rounded-2xl overflow-hidden relative border border-white/5 flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-0" />
                {product.image ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-darker/80 via-transparent to-transparent z-10 pointer-events-none" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out relative z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </>
                ) : (
                  <div className="text-gray-500 font-bold text-2xl group-hover:scale-105 transition-transform duration-700 ease-out z-10 flex flex-col items-center">
                    <Terminal className="w-16 h-16 text-white/20 mb-4" /><span>{product.title}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-[50px] rounded-full pointer-events-none" />
              <h2 className="text-2xl font-bold mb-8 text-white border-b border-white/10 pb-4 flex items-center"><Code className="w-6 h-6 mr-2 text-brand-cyan" /> Informasi Produk</h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-black text-white mt-10 mb-6 pb-2 border-b border-white/5" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-8 mb-4 flex items-center" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-brand-cyan mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="mb-6 text-base md:text-lg leading-loose" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white bg-white/5 px-1 rounded" {...props} />,
                    a: ({node, ...props}) => <a className="text-brand-blue hover:text-brand-cyan underline decoration-brand-blue/30 underline-offset-4 transition-colors font-medium" {...props} />,
                    ul: ({node, ...props}) => <ul className="space-y-3 mb-8" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-brand-cyan mr-3 mt-1 flex-shrink-0" /><span className="text-gray-300">{props.children}</span></li>
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-brand-cyan bg-gradient-to-r from-brand-cyan/10 to-transparent p-5 rounded-r-2xl my-8 relative overflow-hidden group">
                        <Quote className="absolute -right-4 -bottom-4 w-20 h-20 text-brand-cyan/10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 italic text-gray-400">{props.children}</div>
                      </blockquote>
                    ),
                    code: ({node, inline, className, children, ...props}: any) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <div className="relative my-8 group">
                          <div className="absolute top-0 left-0 w-full h-10 bg-[#0f1423] rounded-t-xl border border-white/10 border-b-0 flex items-center px-4 gap-2 z-10">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-yellow-500/80"></div><div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            <span className="ml-auto text-xs text-gray-500 font-mono font-medium">{match ? match[1] : 'terminal'}</span>
                          </div>
                          <pre className="bg-[#050811] p-6 pt-14 rounded-xl border border-white/10 overflow-x-auto text-sm text-gray-300 font-mono shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)]"><code className={className} {...props}>{children}</code></pre>
                        </div>
                      ) : (
                        <code className="bg-brand-blue/10 text-brand-cyan px-2 py-0.5 rounded-md font-mono text-sm border border-brand-blue/20" {...props}>{children}</code>
                      )
                    }
                  }}
                >
                  {safeDescription}
                </ReactMarkdown>
              </div>
            </div>

            {/* 🔥 TIMELINE CHANGELOG 🔥 */}
            {productChangelogs.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-brand-cyan/10 blur-[60px] rounded-full pointer-events-none" />
                <h2 className="text-2xl font-bold mb-10 text-white border-b border-white/10 pb-4 flex items-center">
                  <History className="w-6 h-6 mr-2 text-brand-blue" /> Riwayat Update
                </h2>
                
                <div className="space-y-8 border-l-2 border-brand-blue/20 pl-8 relative ml-2">
                  {productChangelogs.map((c: any, i: number) => (
                    <div key={i} className="relative group">
                      {/* Titik Timeline */}
                      <div className="absolute -left-[41px] top-1 w-5 h-5 bg-brand-blue rounded-full border-4 border-[#0a0f1c] shadow-[0_0_15px_rgba(37,99,235,0.6)] group-hover:scale-125 transition-transform duration-300"></div>
                      
                      <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-black text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded border border-brand-cyan/20">{c.version}</span>
                          <span className="text-xs text-gray-500 font-mono bg-darker px-2 py-1 rounded-md">{new Date(c.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</span>
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mt-3 border-l-2 border-white/10 pl-3">
                          {c.changes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>

          {/* KOLOM KANAN (Harga, Checkout, & Fitur Sticky) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 lg:sticky lg:top-32 space-y-6">
            <div className="glass p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_-15px_rgba(37,99,235,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[50px] rounded-full pointer-events-none" />
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-brand-cyan bg-brand-cyan/10 rounded-full border border-brand-cyan/20">{product.category || "FiveM"}</span>
              <h1 className="text-3xl font-extrabold text-white mb-2 leading-tight">{product.title}</h1>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mt-6 mb-8">Rp {Number(product.price).toLocaleString("id-ID")}</div>
              <Link href={`/checkout/${product.slug}`} className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-lg hover:-translate-y-1 group"><ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />Checkout Sekarang</Link>
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-400" />Transaksi Terenkripsi & Aman</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Yang Anda Dapatkan</h3>
              <ul className="space-y-4">
                {[{ icon: Code, text: "Full Source Code Lengkap" }, { icon: Zap, text: "Instan Download via G-Drive" }, { icon: CheckCircle2, text: "Bebas Backdoor / Terenkripsi" }].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300 font-medium text-sm"><div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/10 flex-shrink-0"><item.icon className="w-4 h-4 text-brand-cyan" /></div>{item.text}</li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </main>

      {/* 🏁 FOOTER PROFESIONAL */}
      <footer className="border-t border-white/10 pt-20 pb-8 px-4 relative z-10 bg-darker/90 backdrop-blur-xl mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-4"><Terminal className="text-brand-cyan w-6 h-6" /><span>Nata<span className="text-brand-blue">kenshi.</span></span></div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">Marketplace digital penyedia script FiveM premium, UI/UX modern, dan tools developer tingkat tinggi. Dibangun dengan arsitektur Zero-Database untuk performa dan keamanan maksimal.</p>
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
          <p className="flex items-center">Designed & Engineered by <span className="text-white ml-1 font-bold">AZZAM CODEX</span></p>
        </div>
      </footer>
      
    </div>
  );
}