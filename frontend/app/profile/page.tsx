export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 pb-24 pt-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold">Profile</h1>
        <p className="text-text-dim">Manage your account and preferences</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6 space-y-3">
          <div className="font-medium">Account</div>
          <div className="text-sm text-text-dim">Sign in to sync your watchlist and history across devices.</div>
          <div className="flex gap-2">
            <button className="btn btn-primary">Sign In</button>
            <button className="btn btn-outline">Create Account</button>
          </div>
        </div>
        <div className="card p-6 space-y-3">
          <div className="font-medium">Preferences</div>
          <div className="text-sm text-text-dim">Set language, subtitles, and autoplay options.</div>
          <div className="flex gap-2">
            <button className="btn btn-outline">Language</button>
            <button className="btn btn-outline">Subtitles</button>
          </div>
        </div>
      </section>
    </div>
  );
}


