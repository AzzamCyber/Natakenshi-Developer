import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

const readJSON = (fileName: string) => {
  try {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
};

const writeJSON = (fileName: string, data: any) => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, fileName), JSON.stringify(data, null, 2));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'orders') return NextResponse.json({ data: readJSON('orders.json') });
  if (type === 'payments') return NextResponse.json({ data: readJSON('payments.json') });
  if (type === 'reviews') return NextResponse.json({ data: readJSON('reviews.json') });
  if (type === 'changelogs') return NextResponse.json({ data: readJSON('changelogs.json') }); // 🔥 BARU: Changelog

  return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { type, data, password } = payload;

    // By-pass password khusus untuk user yang submit review
    if (type !== 'reviews' && password !== process.env.ADMIN_PASSWORD && password !== "supersecretnatakenshi") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (type === 'orders') { writeJSON('orders.json', data); return NextResponse.json({ success: true }); }
    if (type === 'payments') { writeJSON('payments.json', data); return NextResponse.json({ success: true }); }
    if (type === 'reviews') { writeJSON('reviews.json', data); return NextResponse.json({ success: true }); }
    if (type === 'changelogs') { writeJSON('changelogs.json', data); return NextResponse.json({ success: true }); } // 🔥 BARU: Changelog

    return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}