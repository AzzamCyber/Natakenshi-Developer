import TrackClient from "@/components/TrackClient";

export const metadata = {
  title: "Lacak Pesanan | Natakenshi Developer",
  description: "Cek status pesanan dan invoice Anda.",
};

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-darker selection:bg-brand-blue/30 relative">
      <TrackClient />
    </main>
  );
}