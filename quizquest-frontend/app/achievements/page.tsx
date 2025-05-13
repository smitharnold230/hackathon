export default function AchievementsPage() {
  return (
    <main className="flex-1 p-10">
      <h1 className="text-4xl font-bold text-white mb-2">Achievements</h1>
      <p className="text-gray-400 mt-1 mb-8">
        View your badges, trophies, and milestones.
      </p>
      {/* Add your achievements list or components here */}
      <div className="bg-[#232336] rounded-xl p-8 text-center text-purple-300">
        You haven't earned any achievements yet.
      </div>
    </main>
  );
}