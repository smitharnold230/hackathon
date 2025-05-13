export default function ChallengesPage() {
  return (
    <main className="flex-1 p-10">
      <h1 className="text-4xl font-bold text-white mb-2">Challenges</h1>
      <p className="text-gray-400 mt-1 mb-8">
        Take on special or time-limited quiz challenges!
      </p>
      {/* Add your challenges list or components here */}
      <div className="bg-[#232336] rounded-xl p-8 text-center text-purple-300">
        No challenges available at the moment.
      </div>
    </main>
  );
}