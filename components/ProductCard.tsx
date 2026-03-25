"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";

interface ProductProps {
  product: {
    slug: string;
    title: string;
    price: number | string;
    category: string;
    description?: string;
    content?: string; // 🔥 Tambahkan content untuk membaca isi Markdown
    image?: string;
    [key: string]: any; 
  };
  index: number;
  reviews?: any[];
}

export default function ProductCard({ product, index, reviews = [] }: ProductProps) {
  
  // 🔥 KALKULASI RATING
  const productReviews = reviews.filter(r => r.productSlug === product.slug);
  const totalReviews = productReviews.length;
  const averageRating = totalReviews > 0 
    ? (productReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  // 🔥 SMART DETECT DESKRIPSI & BERSIHKAN KARAKTER MARKDOWN
  const rawText = product.content || product.description || "Deskripsi belum tersedia.";
  // Menghilangkan karakter Markdown seperti #, *, `, >, dan - agar rapi di Card
  const cleanDescription = rawText.replace(/[#_*~`>-]/g, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="group relative rounded-3xl bg-darker/40 border border-white/5 hover:border-brand-blue/40 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-15px_rgba(37,99,235,0.4)] flex flex-col h-full backdrop-blur-sm"
    >
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-dark to-darker overflow-hidden border-b border-white/5 flex items-center justify-center">
        
        {/* Kategori Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
            {product.category || "FiveM"}
          </span>
        </div>

        {/* 🔥 RATING BADGE (MUNCUL JIKA ADA ULASAN) */}
        {totalReviews > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{averageRating}</span>
              <span className="text-gray-400 font-medium">({totalReviews})</span>
            </div>
          </div>
        )}

        {product.image ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-darker/80 via-transparent to-black/30 z-10 pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out relative z-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-darker">
            <ShoppingCart className="w-8 h-8 text-white/10" />
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1 z-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-blue/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-brand-cyan transition-colors line-clamp-1">
          {product.title}
        </h2>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {cleanDescription}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5 relative z-10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Harga Script</span>
            <span className="text-lg md:text-xl font-extrabold text-white">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </span>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}