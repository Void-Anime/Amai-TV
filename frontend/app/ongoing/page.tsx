import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import OngoingSeriesClient from "./OngoingSeriesClient";

export default function OngoingPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
  const page = Number(searchParams?.page || 1);
  const query = searchParams?.q || "";

  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Ongoing Series</h1>
          <p className="text-lg text-gray-300">Currently airing anime series and ongoing shows</p>
        </div>

        <OngoingSeriesClient initialPage={page} initialQuery={query} />
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}
