export default function DailyChallengesPanel() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold text-lg mb-2">Daily Challenges</h3>
      <ul className="text-gray-500">
        <li>Complete 3 quizzes for bonus XP</li>
        <li>Answer 5 questions correctly in a row</li>
      </ul>
    </div>
  );
}