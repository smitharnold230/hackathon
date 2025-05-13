export default function DashboardHeader({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {name}! Continue your learning journey.</p>
      </div>
      <div className="flex gap-2">
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
          <span role="img" aria-label="streak" className="mr-1">🔥</span> 5 day streak!
        </span>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
          <span role="img" aria-label="xp" className="mr-1">👑</span> 2450 XP
        </span>
      </div>
    </div>
  );
}