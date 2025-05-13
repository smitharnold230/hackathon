export default function ProfileCard({ name, level }: { name: string; level: number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
      <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
        {name[0].toUpperCase()}
      </div>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-xs text-gray-500">Level {level}</div>
      </div>
    </div>
  );
}