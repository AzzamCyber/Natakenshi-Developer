import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const productsDirectory = path.join(process.cwd(), 'content/products');

// 🟢 GET: Mengambil semua produk untuk ditampilkan di tabel Admin
export async function GET() {
  try {
    if (!fs.existsSync(productsDirectory)) {
      return NextResponse.json({ products: [] });
    }
    const fileNames = fs.readdirSync(productsDirectory);
    const products = fileNames.filter(name => name.endsWith('.md')).map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(productsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      return { slug, ...matterResult.data };
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// 🔵 POST: Menambah produk baru (Generate .md file)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, price, category, image, download_link, description, password } = data;

    if (password !== process.env.ADMIN_PASSWORD && password !== "supersecretnatakenshi") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fileContent = matter.stringify(description || "No description", {
      title, price: Number(price), category, image, download_link
    });

    if (!fs.existsSync(productsDirectory)) fs.mkdirSync(productsDirectory, { recursive: true });
    
    fs.writeFileSync(path.join(productsDirectory, `${slug}.md`), fileContent);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan produk' }, { status: 500 });
  }
}

// 🔴 DELETE: Menghapus produk (.md file)
export async function DELETE(request: Request) {
  try {
    const { slug, password } = await request.json();
    
    if (password !== process.env.ADMIN_PASSWORD && password !== "supersecretnatakenshi") {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filePath = path.join(productsDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 });
  }
}