import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1486043026987028654/I4wc_2xaNSvMZYRskk0HmLW8eOkAR4Pnm0_zejC0QlCio9v28QFIxw0zgSsghDn7m2DN";

// Fungsi Pembuat License Key Acak (Misal: NATA-8F9A-2B3C)
const generateLicenseKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'NATA-';
  for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
  key += '-';
  for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
  return key;
};

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const filePath = path.join(dataDir, 'orders.json');
    
    let orders = [];
    if (fs.existsSync(filePath)) orders = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const orderId = Date.now().toString();
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'Pending',
      licenseKey: generateLicenseKey(), // 🔥 AUTO GENERATE LISENSI
      date: new Date().toISOString()
    };

    orders.push(newOrder);
    
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

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
    } catch (e) {}

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memproses pesanan' }, { status: 500 });
  }
}