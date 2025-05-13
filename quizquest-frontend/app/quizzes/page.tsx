export default function QuizzesPage() {
  return (
    <main className="flex-1 p-10">
      <h1 className="text-4xl font-bold text-white mb-2">Quizzes</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Browse and start new quizzes. More features coming soon!
      </p>
      {/* Add your quizzes list or components here */}
      <div className="bg-[#232336] rounded-xl p-8 text-center text-purple-300">
        No quizzes to display yet.
      </div>
    </main>
  );
}