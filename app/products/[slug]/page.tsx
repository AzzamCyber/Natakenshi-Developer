import { getAllProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

// ⚡ FITUR RAHASIA: Static Site Generation (SSG)
export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // Ambil data produk langsung dari file Markdown
  const products = getAllProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) return notFound();

  // Lempar datanya ke UI Client yang penuh animasi
  return <ProductDetailClient product={product} />;
}