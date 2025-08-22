import NewNavbar from "@/components/NewNavbar";
import NewBottomNav from "@/components/NewBottomNav";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black">
      <NewNavbar />
      
      <main className="mx-auto max-w-4xl px-4 md:px-6 py-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <p className="text-lg text-gray-300">Manage your account and preferences</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-2xl">U</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">User Profile</h2>
              <p className="text-gray-400">user@example.com</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left">
                Edit Profile
              </button>
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left">
                Notification Settings
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left">
                Language Settings
              </button>
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left">
                Video Quality
              </button>
              <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-left">
                Autoplay Settings
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-sm text-gray-400">Watched Episodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-sm text-gray-400">Completed Series</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-sm text-gray-400">Watch Time</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Sign Out
          </button>
        </div>
      </main>

      <NewBottomNav />
    </div>
  );
}


