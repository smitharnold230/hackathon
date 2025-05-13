export default function LeaderboardPanel() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold text-lg mb-2">Leaderboard</h3>
      <ol className="list-decimal list-inside text-gray-700">
        <li>Alex Johnson - 2450 XP</li>
        <li>Jane Doe - 2100 XP</li>
        <li>Sam Smith - 1800 XP</li>
      </ol>
    </div>
  );
}