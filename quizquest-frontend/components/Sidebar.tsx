import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaList,
  FaTrophy,
  FaChartBar,
  FaPuzzlePiece,
  FaBolt
} from "react-icons/fa";

export type SidebarUser = {
  name?: string;
  level?: number;
};

const navItems = [
  { name: 'Dashboard', href: '/', icon: <FaHome /> },
  { name: 'Quizzes', href: '/quizzes', icon: <FaList /> },
  { name: 'Challenges', href: '/challenges', icon: <FaPuzzlePiece /> },
  { name: 'Achievements', href: '/achievements', icon: <FaTrophy /> },
  { name: 'Leaderboard', href: '/leaderboard', icon: <FaChartBar /> },
];

export default function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  return (
    <aside className="bg-[#18181f] w-64 min-h-screen flex flex-col justify-between py-8 px-6 border-r border-[#232336]">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <FaBolt className="text-purple-400 text-2xl drop-shadow-[0_0_8px_#a78bfa]" />
          <span className="text-2xl font-bold neon-text text-white">QuizQuest</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link href={item.href} key={item.name}>
              <span className={`flex items-center gap-3 py-2 px-4 rounded cursor-pointer font-semibold transition
                ${pathname === item.href ? "bg-[#232336] text-white neon-glow" : "text-gray-400 hover:text-white hover:bg-[#232336]"}`}>
                {item.icon} {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Profile card links to /profile */}
      <Link href="/profile" className="block mt-8">
        <div className="bg-[#232336] rounded-xl p-4 flex items-center gap-3 hover:bg-[#3a2e5a] transition cursor-pointer">
          <div className="bg-[#7f5cff] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-bold text-white">{user?.name || "User"}</div>
            <div className="text-xs text-purple-300">Level {user?.level || 1}</div>
          </div>
        </div>
      </Link>
    </aside>
  );
}