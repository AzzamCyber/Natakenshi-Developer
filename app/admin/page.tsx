"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { 
  Lock, PlusCircle, Package, Link as LinkIcon, Image as ImageIcon, 
  LayoutDashboard, LogOut, Menu, X, Terminal, Trash2, Search, AlertTriangle, 
  TrendingUp, DollarSign, CheckCircle2, ShoppingCart, CreditCard, Edit3, XCircle, Eye, History
} from "lucide-react"; // 🔥 Tambah History
import { toast } from "sonner";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [changelogs, setChangelogs] = useState<any[]>([]); // 🔥 STATE CHANGELOG
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: "", identifier: "", title: "" });

  // Form States
  const [formProduct, setFormProduct] = useState({ title: "", price: "", category: "FiveM Script", image: "", download_link: "", description: "" });
  const [formPayment, setFormPayment] = useState({ name: "DANA", number: "", owner: "" });
  const [formChangelog, setFormChangelog] = useState({ productSlug: "", version: "", changes: "", date: new Date().toISOString().split('T')[0] }); // 🔥 FORM CHANGELOG

  // Edit States
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingSlug, setEditingSlug] = useState("");

  // --- LOGIC: SESSION & FETCH DATA ---
  useEffect(() => {
    const savedSession = sessionStorage.getItem("nata_admin_session");
    if (savedSession) {
      setPassword(savedSession);
      setIsLoggedIn(true);
      fetchAllData();
    }
    setIsCheckingSession(false);
  }, []);

  const fetchAllData = async () => {
    try {
      const resProd = await fetch("/api/products");
      const dataProd = await resProd.json();
      if (dataProd.products) setProducts(dataProd.products);

      const resOrders = await fetch("/api/system?type=orders");
      const dataOrders = await resOrders.json();
      if (dataOrders.data) setOrders(dataOrders.data);

      const resPayments = await fetch("/api/system?type=payments");
      const dataPayments = await resPayments.json();
      if (dataPayments.data) setPayments(dataPayments.data);

      // 🔥 Fetch Changelogs
      const resChangelogs = await fetch("/api/system?type=changelogs");
      const dataChangelogs = await resChangelogs.json();
      if (dataChangelogs.data) setChangelogs(dataChangelogs.data);
    } catch (err) {
      toast.error("Gagal memuat data dari server");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "supersecretnatakenshi") { 
      sessionStorage.setItem("nata_admin_session", password);
      setIsLoggedIn(true);
      fetchAllData();
      toast.success("Login Berhasil!");
    } else {
      toast.error("Password Salah!");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("nata_admin_session");
    setIsLoggedIn(false);
    setPassword("");
    toast.info("Anda telah keluar sistem");
  };

  // --- LOGIC: MANAGE PRODUK (ADD & EDIT) ---
  const handleEditClick = (p: any) => {
    setFormProduct({
      title: p.title,
      price: p.price,
      category: p.category || "FiveM Script",
      image: p.image || "",
      download_link: p.download_link || "",
      description: p.content || p.description || ""
    });
    setIsEditingProduct(true);
    setEditingSlug(p.slug);
    setActiveTab("manage");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditingProduct(false);
    setEditingSlug("");
    setFormProduct({ title: "", price: "", category: "FiveM Script", image: "", download_link: "", description: "" });
  };

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(isEditingProduct ? "Memperbarui script..." : "Mempublish script...");

    try {
      const newSlug = formProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (isEditingProduct && editingSlug !== newSlug) {
        await fetch("/api/products", {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: editingSlug, password })
        });
      }

      const res = await fetch("/api/products", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formProduct, password })
      });

      if (res.ok) {
        toast.success(isEditingProduct ? "Script berhasil diupdate!" : "Script berhasil dipublish!", { id: toastId });
        handleCancelEdit();
        fetchAllData();
      } else {
        toast.error("Gagal menyimpan script.", { id: toastId });
      }
    } catch (error) { 
      toast.error("Server error.", { id: toastId }); 
    }
    setIsLoading(false);
  };

  // --- LOGIC: PAYMENTS & CHANGELOGS ---
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const safePayments = Array.isArray(payments) ? payments : [];
    const newPayments = [...safePayments, { id: Date.now().toString(), ...formPayment }];
    await updateSystemData('payments', newPayments);
    setFormPayment({ name: "DANA", number: "", owner: "" });
    toast.success("Metode pembayaran ditambahkan");
  };

  const handleAddChangelog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChangelog.productSlug) return toast.error("Pilih produk terlebih dahulu!");
    const safeChangelogs = Array.isArray(changelogs) ? changelogs : [];
    // Masukkan changelog baru di urutan paling atas
    const newChangelogs = [{ id: Date.now().toString(), ...formChangelog }, ...safeChangelogs];
    await updateSystemData('changelogs', newChangelogs);
    setFormChangelog({ ...formChangelog, version: "", changes: "" }); // Reset sebagian form
    toast.success("Riwayat Update berhasil ditambahkan!");
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    await updateSystemData('orders', updatedOrders);
    toast.success(`Status order diubah menjadi ${newStatus}`);
  };

  const updateSystemData = async (type: string, data: any) => {
    try {
      const res = await fetch("/api/system", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data, password })
      });
      if (res.ok) fetchAllData();
    } catch (error) { toast.error("Gagal update data sistem."); }
  };

  // --- LOGIC: DELETE GLOBAL ---
  const confirmDelete = async () => {
    const toastId = toast.loading("Menghapus data...");
    try {
      if (deleteModal.type === 'product') {
        await fetch("/api/products", {
          method: "DELETE", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: deleteModal.identifier, password })
        });
        if (isEditingProduct && editingSlug === deleteModal.identifier) handleCancelEdit();
      } else if (deleteModal.type === 'payment') {
        const newPayments = payments.filter(p => p.id !== deleteModal.identifier);
        await updateSystemData('payments', newPayments);
      } else if (deleteModal.type === 'order') {
        const newOrders = orders.filter(o => o.id !== deleteModal.identifier);
        await updateSystemData('orders', newOrders);
      } else if (deleteModal.type === 'changelog') {
        const newChangelogs = changelogs.filter(c => c.id !== deleteModal.identifier);
        await updateSystemData('changelogs', newChangelogs);
      }
      toast.success("Data berhasil dihapus", { id: toastId });
      fetchAllData();
    } catch (e) {
      toast.error("Gagal menghapus data", { id: toastId });
    }
    setDeleteModal({ isOpen: false, type: "", identifier: "", title: "" });
  };

  // --- ANALYTICS ---
  const safeOrders = Array.isArray(orders) ? orders : [];
  const totalRevenue = safeOrders.filter(o => o.status === 'Sukses').reduce((acc, curr) => acc + Number(curr.price), 0);
  const totalSuccessOrders = safeOrders.filter(o => o.status === 'Sukses').length;
  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- UI: RENDER AWAL ---
  if (isCheckingSession) return <div className="min-h-screen bg-darker flex items-center justify-center text-brand-cyan">Memuat Sistem...</div>;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-darker">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass border border-white/10 p-10 rounded-3xl max-w-md w-full text-center relative z-10">
          <Terminal className="text-brand-cyan w-10 h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-8">Nata<span className="text-brand-blue">kenshi.</span> ADMIN</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" required placeholder="System Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-darker/50 border border-white/10 rounded-xl px-4 py-4 text-center text-white focus:border-brand-blue outline-none transition-all" />
            <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg">Login Access</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker flex relative text-sm md:text-base">
      
      {/* DELETE MODAL POPUP */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass p-8 rounded-3xl max-w-md w-full border border-red-500/30 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Hapus Data?</h3>
              <p className="text-gray-400 mb-8">Tindakan menghapus <b>{deleteModal.title}</b> tidak dapat dikembalikan.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteModal({ isOpen: false, type: "", identifier: "", title: "" })} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold">Batal</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-bold text-white shadow-lg">Ya, Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 glass border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center"><Terminal className="text-brand-cyan w-6 h-6 mr-2" />Nata<span className="text-brand-blue">kenshi.</span></div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X className="w-6 h-6 text-gray-400" /></button>
        </div>
        <div className="px-6 pb-6 flex-1">
          <nav className="space-y-2">
            {[
              { id: "dashboard", label: "Analitik Data", icon: LayoutDashboard },
              { id: "orders", label: "Kelola Pesanan", icon: ShoppingCart },
              { id: "manage", label: "Kelola Script/Produk", icon: Package },
              { id: "changelogs", label: "Riwayat Update", icon: History }, // 🔥 MENU BARU
              { id: "payments", label: "Metode Pembayaran", icon: CreditCard },
            ].map((item) => (
               <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id ? "bg-brand-blue/20 text-brand-cyan border border-brand-blue/30" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold"><LogOut className="w-4 h-4" /> Keluar</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full h-screen overflow-y-auto p-4 md:p-8">
        <div className="md:hidden flex justify-between mb-8 glass px-4 py-3 rounded-2xl">
          <span className="font-bold text-brand-cyan">Menu Admin</span>
          <button onClick={() => setIsSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="text-3xl font-extrabold text-white mb-8">Real-time Analitik Penjualan</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-3xl border border-green-500/20 relative overflow-hidden">
                  <DollarSign className="w-8 h-8 text-green-400 mb-2" />
                  <p className="text-gray-400 text-sm">Total Pendapatan Sukses</p>
                  <p className="text-3xl font-black text-white">Rp {totalRevenue.toLocaleString("id-ID")}</p>
                </div>
                <div className="glass p-6 rounded-3xl border border-brand-blue/20 relative overflow-hidden">
                  <ShoppingCart className="w-8 h-8 text-brand-blue mb-2" />
                  <p className="text-gray-400 text-sm">Pesanan Selesai</p>
                  <p className="text-3xl font-black text-white">{totalSuccessOrders}</p>
                </div>
                <div className="glass p-6 rounded-3xl border border-purple-500/20 relative overflow-hidden">
                  <Package className="w-8 h-8 text-purple-400 mb-2" />
                  <p className="text-gray-400 text-sm">Script Aktif</p>
                  <p className="text-3xl font-black text-white">{products.length}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: KELOLA PESANAN */}
          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass p-8 rounded-3xl border border-white/5">
                <h2 className="text-2xl font-bold mb-6 flex items-center"><ShoppingCart className="mr-2 text-brand-blue" /> Daftar Semua Pesanan</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 uppercase">
                        <th className="p-4 rounded-tl-xl">ID Order</th>
                        <th className="p-4">Pembeli</th>
                        <th className="p-4">Produk</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 rounded-tr-xl">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeOrders.slice().reverse().map((o, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4 font-mono text-xs text-gray-500">#{o.id?.substring(0,6)}</td>
                          <td className="p-4"><p className="font-bold text-white">{o.customerName}</p><p className="text-xs text-brand-cyan">{o.paymentMethod}</p></td>
                          <td className="p-4 text-gray-300">{o.productTitle}</td>
                          <td className="p-4">
                            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className={`bg-darker border outline-none text-xs font-bold rounded px-2 py-1 ${o.status === 'Sukses' ? 'text-green-400 border-green-400/30' : o.status === 'Batal' ? 'text-red-400 border-red-400/30' : 'text-amber-400 border-amber-400/30'}`}>
                              <option value="Pending">PENDING</option><option value="Sukses">SUKSES</option><option value="Batal">BATAL</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button onClick={() => setDeleteModal({ isOpen: true, type: 'order', identifier: o.id, title: `Order ${o.customerName}` })} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* 🔥 TAB 3: CHANGELOG (BARU) 🔥 */}
          {activeTab === "changelogs" && (
            <motion.div key="changelogs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-8">
                <div className="glass p-8 rounded-3xl border border-white/5">
                  <h2 className="text-xl font-bold mb-6 flex items-center"><History className="mr-2 text-brand-cyan" /> Tambah Update Script</h2>
                  <form onSubmit={handleAddChangelog} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 font-bold uppercase">Pilih Produk</label>
                      <select required value={formChangelog.productSlug} onChange={e => setFormChangelog({...formChangelog, productSlug: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-white mt-1 appearance-none">
                        <option value="" disabled>-- Pilih Script --</option>
                        {products.map(p => <option key={p.slug} value={p.slug}>{p.title}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-bold uppercase">Versi Update</label>
                        <input required type="text" placeholder="e.g. v2.1.0" value={formChangelog.version} onChange={e => setFormChangelog({...formChangelog, version: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-bold uppercase">Tanggal Rilis</label>
                        <input required type="date" value={formChangelog.date} onChange={e => setFormChangelog({...formChangelog, date: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-gray-300 mt-1 [color-scheme:dark]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-bold uppercase">Catatan Perubahan (Changes)</label>
                      <textarea required placeholder="- Fix bug inventory&#10;- Optimize FPS" value={formChangelog.changes} onChange={e => setFormChangelog({...formChangelog, changes: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-white mt-1 min-h-[100px]" />
                    </div>
                    <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center"><PlusCircle className="w-5 h-5 mr-2" /> Publish Changelog</button>
                  </form>
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="glass p-8 rounded-3xl border border-white/5 h-full">
                  <h2 className="text-xl font-bold mb-6 flex items-center"><Terminal className="mr-2 text-brand-blue" /> Riwayat Update Terpublikasi</h2>
                  <div className="space-y-4">
                    {changelogs.length > 0 ? changelogs.map((c, i) => (
                      <div key={i} className="bg-darker/50 border border-white/10 rounded-xl p-5 relative group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded border border-brand-cyan/20">{products.find(p => p.slug === c.productSlug)?.title || c.productSlug}</span>
                            <span className="ml-2 text-lg font-bold text-white">{c.version}</span>
                          </div>
                          <button onClick={() => setDeleteModal({ isOpen: true, type: 'changelog', identifier: c.id, title: `Update ${c.version}` })} className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mb-3">{c.date}</p>
                        <p className="text-gray-300 text-sm whitespace-pre-line">{c.changes}</p>
                      </div>
                    )) : (
                      <div className="text-center py-10 text-gray-500"><History className="w-10 h-10 mx-auto mb-3 opacity-30" />Belum ada riwayat update.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: KELOLA SCRIPT */}
          {activeTab === "manage" && (
            <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className={`glass p-8 rounded-3xl border ${isEditingProduct ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    {isEditingProduct ? <><Edit3 className="mr-2 text-amber-500" /> Edit Script</> : <><PlusCircle className="mr-2 text-brand-blue" /> Tambah Script Baru</>}
                  </h2>
                  {isEditingProduct && (
                    <button onClick={handleCancelEdit} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg flex items-center hover:bg-red-500 hover:text-white transition-all">
                      <XCircle className="w-4 h-4 mr-1" /> Batal Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase">Nama Produk</label>
                     <input required type="text" value={formProduct.title} onChange={e => setFormProduct({...formProduct, title: e.target.value})} className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-blue" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase">Harga (Rp)</label>
                     <input required type="number" value={formProduct.price} onChange={e => setFormProduct({...formProduct, price: e.target.value})} className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-blue" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase">Kategori</label>
                     <select value={formProduct.category} onChange={e => setFormProduct({...formProduct, category: e.target.value})} className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-blue appearance-none">
                       <option value="FiveM Script">FiveM Script</option>
                       <option value="FiveM Map/MLO">FiveM Map/MLO</option>
                       <option value="Website Template">Website Template</option>
                       <option value="Discord Bot">Discord Bot</option>
                     </select>
                   </div>
                   
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase flex items-center"><ImageIcon className="w-3 h-3 mr-1 text-brand-blue"/> URL Gambar (Link)</label>
                     <div className="flex gap-3">
                       <input type="text" value={formProduct.image} onChange={e => setFormProduct({...formProduct, image: e.target.value})} className="flex-1 bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-blue" />
                       {formProduct.image && (
                         <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden flex-shrink-0 bg-darker relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formProduct.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150?text=Error'} />
                         </div>
                       )}
                     </div>
                   </div>

                   <div className="space-y-1 md:col-span-2">
                     <label className="text-xs font-bold text-gray-400 uppercase flex items-center"><LinkIcon className="w-3 h-3 mr-1 text-green-400"/> Link Download</label>
                     <input required type="text" value={formProduct.download_link} onChange={e => setFormProduct({...formProduct, download_link: e.target.value})} className="w-full bg-darker/80 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-blue" />
                   </div>
                   
                   {/* LIVE MARKDOWN PREVIEW AREA */}
                   <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                     <div className="space-y-2 flex flex-col h-full">
                       <label className="text-xs font-bold text-brand-blue uppercase flex items-center"><Terminal className="w-3 h-3 mr-1"/> Editor Markdown</label>
                       <textarea required value={formProduct.description} onChange={e => setFormProduct({...formProduct, description: e.target.value})} className="w-full flex-1 bg-darker/80 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-brand-blue min-h-[200px]" placeholder="**Fitur Utama:**\n- Sistem A\n- Sistem B" />
                     </div>
                     <div className="space-y-2 flex flex-col h-full">
                       <label className="text-xs font-bold text-green-400 uppercase flex items-center"><Eye className="w-3 h-3 mr-1"/> Live Preview</label>
                       <div className="w-full flex-1 bg-black/30 border border-white/5 rounded-xl px-5 py-4 text-gray-300 overflow-y-auto min-h-[200px] max-h-[300px]">
                         <div className="prose prose-invert prose-sm max-w-none">
                           {formProduct.description ? <ReactMarkdown>{formProduct.description}</ReactMarkdown> : <p className="text-gray-600 italic mt-0">Preview akan muncul di sini...</p>}
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="md:col-span-2 pt-4">
                     <button type="submit" disabled={isLoading} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg text-white ${isEditingProduct ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-brand-blue hover:bg-blue-600 shadow-brand-blue/30'}`}>
                       {isLoading ? "Memproses..." : isEditingProduct ? <><Edit3 className="mr-2 w-5 h-5" /> Update Script (.md)</> : <><PlusCircle className="mr-2 w-5 h-5" /> Publish Script (.md)</>}
                     </button>
                   </div>
                </form>
              </div>

              {/* Tabel List Produk */}
              <div className="glass p-8 rounded-3xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center"><Package className="mr-2 text-brand-blue" /> Daftar Produk Aktif</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Cari script..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-darker/50 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-blue" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-white/5 text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                        <th className="p-4">Thumbnail</th>
                        <th className="p-4">Nama Produk</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p, i) => (
                        <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${editingSlug === p.slug ? 'bg-amber-500/5' : ''}`}>
                          <td className="p-4"><div className="w-12 h-12 bg-darker rounded-lg border border-white/10 overflow-hidden flex items-center justify-center text-xs text-gray-600">{p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4" />}</div></td>
                          <td className="p-4 font-bold text-white">{p.title}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-white/10 rounded text-xs text-brand-cyan">{p.category || 'FiveM'}</span></td>
                          <td className="p-4 text-green-400 font-medium">Rp {Number(p.price).toLocaleString("id-ID")}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditClick(p)} className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all border border-amber-500/20"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteModal({ isOpen: true, type: 'product', identifier: p.slug, title: p.title })} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: PENGATURAN PAYMENT */}
          {activeTab === "payments" && (
            <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid md:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center"><PlusCircle className="mr-2 text-brand-cyan" /> Tambah Rekening/E-Wallet</h2>
                <form onSubmit={handleAddPayment} className="space-y-4">
                  <div><label className="text-xs text-gray-400">Pilih Provider</label>
                    <select value={formPayment.name} onChange={e => setFormPayment({...formPayment, name: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-white mt-1"><option value="DANA">DANA</option><option value="GOPAY">GOPAY</option><option value="OVO">OVO</option><option value="QRIS">QRIS</option><option value="BCA">Bank BCA</option><option value="MANDIRI">Bank Mandiri</option></select>
                  </div>
                  <div><label className="text-xs text-gray-400">Nomor Rekening / HP</label><input required type="text" value={formPayment.number} onChange={e => setFormPayment({...formPayment, number: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-white mt-1" /></div>
                  <div><label className="text-xs text-gray-400">Atas Nama</label><input required type="text" value={formPayment.owner} onChange={e => setFormPayment({...formPayment, owner: e.target.value})} className="w-full bg-darker border border-white/10 rounded-xl px-4 py-3 outline-none text-white mt-1" /></div>
                  <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold mt-4 shadow-lg">Simpan Payment</button>
                </form>
              </div>

              <div className="glass p-8 rounded-3xl border border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center"><CreditCard className="mr-2 text-brand-blue" /> Metode Aktif</h2>
                <div className="space-y-3">
                  {(Array.isArray(payments) ? payments : []).map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-darker/50 border border-white/10 rounded-xl">
                      <div><p className="font-bold text-brand-cyan">{p.name}</p><p className="text-lg text-white font-mono my-1">{p.number}</p><p className="text-xs text-gray-400">a/n {p.owner}</p></div>
                      <button onClick={() => setDeleteModal({ isOpen: true, type: 'payment', identifier: p.id, title: `${p.name} - ${p.number}` })} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}