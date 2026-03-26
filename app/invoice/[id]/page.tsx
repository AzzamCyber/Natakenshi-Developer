import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import InvoiceClient from '@/components/InvoiceClient';

// ⚡ Paksa halaman ini selalu dirender secara dinamis (karena data order selalu baru)
export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    // 1. Baca Data Order
    const ordersPath = path.join(dataDir, 'orders.json');
    if (!fs.existsSync(ordersPath)) return notFound();
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    const order = orders.find((o: any) => o.id === id);
    if (!order) return notFound();

    // 2. Baca Data Payment Method (Untuk cari nomor rekening Admin)
    const paymentsPath = path.join(dataDir, 'payments.json');
    let paymentDetails = null;
    if (fs.existsSync(paymentsPath)) {
      const payments = JSON.parse(fs.readFileSync(paymentsPath, 'utf8'));
      paymentDetails = payments.find((p: any) => p.name === order.paymentMethod);
    }

    // 3. Render Client UI
    return (
      <main className="min-h-screen py-24 px-4 max-w-4xl mx-auto">
        <InvoiceClient order={order} payment={paymentDetails} />
      </main>
    );
  } catch (error) {
    return notFound();
  }
}