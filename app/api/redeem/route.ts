import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllProducts } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const { licenseKey } = await request.json();
    if (!licenseKey) return NextResponse.json({ error: 'License Key wajib diisi!' }, { status: 400 });

    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    if (!fs.existsSync(ordersPath)) return NextResponse.json({ error: 'Database pesanan belum siap.' }, { status: 404 });

    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    
    // Cari order berdasarkan lisensi
    const order = orders.find((o: any) => o.licenseKey === licenseKey);

    if (!order) {
      return NextResponse.json({ error: 'License Key tidak ditemukan.' }, { status: 404 });
    }

    // Validasi apakah statusnya SUKSES
    if (order.status !== 'Sukses') {
      return NextResponse.json({ error: `Akses ditolak. Pesanan Anda masih berstatus: ${order.status.toUpperCase()}` }, { status: 403 });
    }

    // Cari produk di file .md untuk mengambil link download
    let products = [];
    try {
      products = getAllProducts();
    } catch (e) {
      return NextResponse.json({ error: 'Gagal membaca katalog produk.' }, { status: 500 });
    }

    // 🔥 FIX TYPESCRIPT VERCEL: Tambahkan (p: any) agar Vercel tidak bingung
    const product = products.find((p: any) => p.title === order.productTitle);

    if (!product || !product.download_link) {
      return NextResponse.json({ error: 'Link download belum disetting oleh Admin di file produk.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      download_link: product.download_link, 
      productName: product.title 
    });
  } catch (e) {
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}