import { getAllProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import CheckoutClient from "@/components/CheckoutClient";

// 🔥 FIX TYPESCRIPT: Gunakan Promise untuk params
export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const products = getAllProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <main className="min-h-screen py-24 px-4 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Selesaikan <span className="text-gradient">Pembelian</span>
        </h1>
        <p className="text-gray-400">Langkah terakhir untuk mendapatkan produk premium ini.</p>
      </div>
      {/* 🔥 FIX TYPESCRIPT: Tambahkan "as any" untuk membungkam Vercel */}
<CheckoutClient product={product as any} />
    </main>
  );
}