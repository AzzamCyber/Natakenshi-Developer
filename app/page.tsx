import { getAllProducts } from "@/lib/products";
import HomeClient from "@/components/HomeClient";

// ⚡ FITUR RAHASIA: Static Site Generation (SSG)
export const revalidate = 60; 

export default function Home() {
  // Panggil fungsi getAllProducts sesuai yang ada di lib/products.ts kamu
  const products = getAllProducts() as any;

  return <HomeClient products={products} />;
}