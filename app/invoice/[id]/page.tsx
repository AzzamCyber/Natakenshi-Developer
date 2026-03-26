import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import InvoiceClient from '@/components/InvoiceClient';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    const ordersPath = path.join(dataDir, 'orders.json');
    
    // LOGING UNTUK DEBUGGING DI TERMINAL VS CODE
    console.log(`Mencari Invoice ID: ${id}`);
    
    if (!fs.existsSync(ordersPath)) {
      console.error("❌ File orders.json tidak ditemukan!");
      return notFound();
    }
    
    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    const order = orders.find((o: any) => o.id === id);
    
    if (!order) {
      console.error(`❌ Order dengan ID ${id} tidak ada di dalam orders.json!`);
      return notFound();
    }

    const paymentsPath = path.join(dataDir, 'payments.json');
    let paymentDetails = null;
    if (fs.existsSync(paymentsPath)) {
      const payments = JSON.parse(fs.readFileSync(paymentsPath, 'utf8'));
      paymentDetails = payments.find((p: any) => p.name === order.paymentMethod);
    }

    console.log("✅ Data Order Ditemukan, merender UI...");
    return (
      <main className="min-h-screen py-24 px-4 max-w-4xl mx-auto">
        <InvoiceClient order={order} payment={paymentDetails} />
      </main>
    );
  } catch (error) {
    console.error("❌ Terjadi Error Fatal:", error);
    return notFound(); // Tetap 404 jika kode rusak
  }
}