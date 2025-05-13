'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaArrowLeft } from "react-icons/fa";

// You may want to use your AuthContext or similar for real user data
export default function ProfilePage() {
  // Example: Replace with real user data from context or API
  const [name, setName] = useState('Alex Johnson');
  const [level, setLevel] = useState(12);
  const router = useRouter();

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save user data to backend or context
    alert('Profile updated!');
    router.push('/'); // Go back to dashboard
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181f] text-white">
      <div className="bg-[#232336] rounded-xl p-8 w-full max-w-md shadow-lg">
        <button
          className="mb-6 flex items-center gap-2 text-purple-300 hover:text-purple-400"
          onClick={() => router.back()}
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSave}>
          <label className="block mb-4">
            <span className="block mb-1 text-purple-300">Name</span>
            <div className="flex items-center gap-2">
              <FaUser className="text-purple-400" />
              <input
                className="w-full px-4 py-2 rounded bg-[#18181f] border border-[#7f5cff] text-white focus:outline-none focus:ring-2 focus:ring-[#7f5cff]"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </label>
          <label className="block mb-6">
            <span className="block mb-1 text-purple-300">Level</span>
            <input
              type="number"
              min={1}
              className="w-full px-4 py-2 rounded bg-[#18181f] border border-[#7f5cff] text-white focus:outline-none focus:ring-2 focus:ring-[#7f5cff]"
              value={level}
              onChange={e => setLevel(Number(e.target.value))}
            />
          </label>
          <button
            type="submit"
            className="w-full bg-[#7f5cff] text-white py-2 rounded font-bold hover:bg-[#a78bfa] transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}