import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
// Gunakan Webhook yang sama dengan notifikasi pesanan
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1486043026987028654/I4wc_2xaNSvMZYRskk0HmLW8eOkAR4Pnm0_zejC0QlCio9v28QFIxw0zgSsghDn7m2DN";

export async function GET() {
  try {
    const filePath = path.join(dataDir, 'reviews.json');
    if (!fs.existsSync(filePath)) return NextResponse.json({ reviews: [] });
    const reviews = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const reviewData = await request.json();
    const filePath = path.join(dataDir, 'reviews.json');
    
    let reviews = [];
    if (fs.existsSync(filePath)) {
      reviews = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      date: new Date().toISOString()
    };

    reviews.push(newReview);
    
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));

    // 🔥 KIRIM KE DISCORD WEBHOOK JIKA BINTANG 4 ATAU 5
    if (reviewData.rating >= 4) { 
      try {
        const stars = "⭐".repeat(reviewData.rating);
        await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: "Natakenshi Reviews",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/5610/5610944.png", // Ikon Bintang Emas
            embeds: [{
              title: "🎉 Ulasan Baru Masuk!",
              color: 16766720, // Warna Emas
              description: `**${reviewData.customerName}** baru saja memberikan ulasan mantap untuk script **${reviewData.productSlug.replace(/-/g, ' ').toUpperCase()}**`,
              fields: [
                { name: "Rating", value: stars, inline: true },
                { name: "Komentar", value: `"${reviewData.text}"`, inline: false }
              ],
              footer: { text: "Natakenshi Auto-Forward System" }
            }]
          })
        });
      } catch (e) {
        // Abaikan error webhook agar tidak mengganggu UI pembeli
      }
    }

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan ulasan' }, { status: 500 });
  }
}