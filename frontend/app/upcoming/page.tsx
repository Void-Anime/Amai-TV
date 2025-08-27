import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";
import DesktopNav from "@/components/DesktopNav";
import UpcomingEpisodesClient from "./UpcomingEpisodesClient";

export default function UpcomingPage() {
  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Upcoming Episodes</h1>
          <p className="text-lg text-gray-300">New episodes coming soon with countdown timers</p>
        </div>

        <UpcomingEpisodesClient />
      </main>

      <NewBottomNav />
      <DesktopNav />
    </div>
  );
}
