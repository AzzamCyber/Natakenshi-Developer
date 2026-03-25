import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllProducts } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const { licenseKey } = await request.json();
    if (!licenseKey) return NextResponse.json({ error: 'License Key wajib diisi' }, { status: 400 });

    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    if (!fs.existsSync(ordersPath)) return NextResponse.json({ error: 'Sistem sedang maintenance' }, { status: 404 });

    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    
    // Cari order yang lisensinya cocok DAN statusnya sudah SUKSES
    const order = orders.find((o: any) => o.licenseKey === licenseKey && o.status === 'Sukses');

    if (!order) {
      return NextResponse.json({ error: 'License Key tidak valid atau pembayaran belum diverifikasi.' }, { status: 404 });
    }

    // Cari produk untuk mengambil link download dari .md
    const products = getAllProducts();
    const product = products.find(p => p.title === order.productTitle);

    if (!product || !product.download_link) {
      return NextResponse.json({ error: 'Link download belum disetting oleh Admin' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      download_link: product.download_link, 
      productName: product.title 
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}