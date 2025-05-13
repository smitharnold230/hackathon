'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar, { SidebarUser } from '../components/Sidebar';
import QuizCard from '../components/QuizCard';
import CategorySection from '../components/CategorySection';
import { FaFire, FaCrown, FaSearch } from "react-icons/fa";
import { OpenTDBQuestion, Category } from '../types/quiz';

interface QuizResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [quizzes, setQuizzes] = useState<OpenTDBQuestion[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Only fetch quizzes when selectedCategory changes
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const fetchQuizzes = async () => {
      try {
        const baseUrl = "https://opentdb.com/api.php";
        const params = new URLSearchParams({
          amount: '12',
          type: 'multiple',
          ...(selectedCategory && { category: selectedCategory.id.toString() })
        });

        const response = await fetch(`${baseUrl}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: QuizResponse = await response.json();
        if (data.response_code !== 0) throw new Error(`API Error: ${data.response_code}`);
        if (!ignore) setQuizzes(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        if (!ignore) setQuizzes([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchQuizzes();
    return () => { ignore = true; };
  }, [selectedCategory]);

  // Always return an array for filtered
  const filtered: OpenTDBQuestion[] = useMemo(() => {
    if (!Array.isArray(quizzes)) return [];
    const searchTerm = search.toLowerCase();
    return quizzes.filter(q =>
      q.category.toLowerCase().includes(searchTerm) ||
      q.question.toLowerCase().includes(searchTerm)
    );
  }, [quizzes, search]);

  function handleStartQuiz(quiz: OpenTDBQuestion) {
    router.push(`/quizzes/play?question=${encodeURIComponent(quiz.question)}`);
  }

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#101014] text-white">
      <Sidebar user={user as SidebarUser} />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user.name}! Continue your learning journey.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex items-center gap-2 neon-badge">
              <FaFire className="text-yellow-400 drop-shadow-[0_0_6px_#ffb300]" />
              {user.streak} day streak!
            </span>
            <span className="flex items-center gap-2 neon-xp">
              <FaCrown className="text-violet-400 drop-shadow-[0_0_6px_#7f5cff]" />
              {user.xp} XP
            </span>
          </div>
        </div>

        {/* Search and Category Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
            <input
              className="neon-input w-full pl-10"
              type="text"
              placeholder="Search quizzes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CategorySection onSelect={cat => {
          // Only update if changed
          setSelectedCategory(prev => prev?.id !== cat?.id ? cat : prev);
        }} />

        {/* Quiz Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-purple-300">Loading quizzes...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filtered?.length ?? 0) === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400 text-lg mb-2">
                  No quizzes found matching your search criteria.
                </p>
                {selectedCategory === null && quizzes.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    Showing a random sample of quizzes from all categories.
                  </p>
                )}
              </div>
            ) : (
              filtered.map((question, idx) => (
                <QuizCard
                  key={`quiz-${question.category}-${idx}`}
                  tags={[
                    question.category,
                    question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)
                  ]}
                  title={question.question}
                  description={`A ${question.difficulty} quiz about ${question.category}`}
                  onStart={() => handleStartQuiz(question)}
                  progress={0}
                  completed={0}
                  total={1}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}