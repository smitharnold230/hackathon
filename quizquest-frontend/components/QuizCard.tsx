import { useRouter } from 'next/navigation';

type QuizCardProps = {
  tags?: string[];
  title: string;
  description: string;
  progress?: number;
  completed?: number;
  total?: number;
  onStart?: () => void;
};

export default function QuizCard({
  tags = [],
  title,
  description,
  progress,
  completed,
  total,
  onStart,
}: QuizCardProps) {
  const router = useRouter();

  const handleQuizStart = () => {
    if (onStart) {
      onStart();
      return;
    }

    const [category, difficulty] = tags;
    const params = new URLSearchParams({
      question: title,
      ...(category && { category }),
      ...(difficulty && { difficulty: difficulty.toLowerCase() })
    });

    router.push(`/quizzes/play?${params.toString()}`);
  };

  return (
    <div className="bg-[#18181f] rounded-2xl p-6 shadow-lg border border-[#7f5cff33] text-white flex flex-col min-h-[260px]">
      <div>
        <div className="flex gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#232336] text-purple-300 px-2 py-1 rounded text-xs font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="font-bold text-lg mb-1" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      {typeof progress === "number" && typeof completed === "number" && typeof total === "number" && (
        <div className="mb-2">
          <div className="h-2 bg-[#232336] rounded">
            <div
              className="h-2 bg-gradient-to-r from-[#7f5cff] to-[#6247ea] rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {completed} of {total} questions completed
          </div>
        </div>
      )}
      <button
        className="mt-auto neon-btn w-full"
        onClick={handleQuizStart}
      >
        Continue Quiz
      </button>
    </div>
  );
}
