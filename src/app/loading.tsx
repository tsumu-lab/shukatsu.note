export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto p-6 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
      <div className="h-20 bg-gray-100 rounded-lg mb-3" />
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 rounded-lg" />
        <div className="h-20 bg-gray-100 rounded-lg" />
        <div className="h-20 bg-gray-100 rounded-lg" />
      </div>
    </main>
  );
}