export default function AchievementsPanel() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold text-lg mb-2">Recent Achievements</h3>
      <ul className="text-gray-500">
        <li>Your latest badge: <span className="font-semibold text-black">Quiz Novice</span></li>
        <li>Completed 10 quizzes</li>
        <li>5 day streak!</li>
      </ul>
    </div>
  );
}