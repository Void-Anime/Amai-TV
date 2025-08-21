export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-text-dim text-sm">The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary">Back to Home</a>
    </div>
  );
}


