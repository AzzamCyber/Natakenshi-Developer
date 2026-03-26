import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1486043026987028654/I4wc_2xaNSvMZYRskk0HmLW8eOkAR4Pnm0_zejC0QlCio9v28QFIxw0zgSsghDn7m2DN";

const generateLicenseKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'NATA-';
  for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
  key += '-';
  for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
  return key;
};

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const orderId = Date.now().toString();
    
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'Pending',
      licenseKey: generateLicenseKey(), 
      date: new Date().toISOString()
    };

    // 💾 1. SIMPAN KE ORDERS.JSON (Dibungkus pelindung agar Vercel tidak 500)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'orders.json');
      
      let orders = [];
      if (fs.existsSync(filePath)) {
        orders = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      
      orders.push(newOrder);
      
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
      console.log("✅ [SUCCESS] Data order berhasil masuk ke orders.json");
    } catch (fileError) {
      console.error("⚠️ [WARNING] Gagal menulis ke orders.json. Ini normal jika terjadi di Vercel (Read-Only).");
    }

    // 🚀 2. KIRIM NOTIFIKASI KE DISCORD
    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: "Natakenshi System",
          embeds: [{
            title: "🚨 ORDER BARU MASUK!",
            color: 3447003,
            fields: [
              { name: "🧾 Order ID", value: `\`INV-${orderId.substring(0,8)}\``, inline: true },
              { name: "📦 Produk", value: `**${orderData.productTitle}**`, inline: true },
              { name: "💰 Total", value: `Rp ${Number(orderData.price).toLocaleString('id-ID')}`, inline: true },
              { name: "🔑 License", value: `||${newOrder.licenseKey}||`, inline: true },
            ],
            footer: { text: "Natakenshi Auto-Notification" }
          }]
        })
      });
    } catch (discordError) {
      console.error("Gagal kirim Webhook:", discordError);
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error("Fatal Error:", error);
    return NextResponse.json({ error: 'Gagal memproses pesanan' }, { status: 500 });
  }
}