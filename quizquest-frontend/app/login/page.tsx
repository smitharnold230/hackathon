'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaBolt, FaEnvelope, FaLock } from "react-icons/fa6";

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const { login } = useAuth();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    login({
      name: 'User',
      email: form.email,
      level: 1,
      streak: 0,
      xp: 0,
    });
    router.push('/');
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate passwords match
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Registration failed");
        return;
      }

      // On successful registration, log the user in
      login({
        name: form.name,
        email: form.email,
        level: 1,
        streak: 0,
        xp: 0,
      });
      
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      alert("Registration failed. Please try again.");
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top left, #232336 0%, #101014 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="neon-card">
        <div className="neon-title">
          <FaBolt style={{ color: "#fff", filter: "drop-shadow(0 0 8px #7f5cff)" }} />
          QuizQuest
        </div>
        <div className="neon-tabs">
          <button
            className={`neon-tab${tab === 'login' ? ' active' : ''}`}
            onClick={() => setTab('login')}
            type="button"
          >Login</button>
          <button
            className={`neon-tab${tab === 'register' ? ' active' : ''}`}
            onClick={() => setTab('register')}
            type="button"
          >Register</button>
        </div>
        {tab === 'login' ? (
          <form className="w-full flex flex-col gap-3" onSubmit={handleLogin}>
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a084ff'
              }} />
              <input
                className="neon-input"
                style={{ paddingLeft: 40 }}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ position: 'relative' }}>
              <FaLock style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a084ff'
              }} />
              <input
                className="neon-input"
                style={{ paddingLeft: 40 }}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="neon-helper" style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
              <span className="neon-link" tabIndex={0}>Forgot password?</span>
            </div>
            <button className="neon-btn" type="submit">Login</button>
            <div className="neon-helper">
              Don't have an account?{' '}
              <span className="neon-link" onClick={() => setTab('register')}>Register</span>
            </div>
          </form>
        ) : (
          <form className="w-full flex flex-col gap-3" onSubmit={handleRegister}>
            <input
              className="neon-input"
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <div style={{ position: 'relative' }}>
              <FaEnvelope style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a084ff'
              }} />
              <input
                className="neon-input"
                style={{ paddingLeft: 40 }}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ position: 'relative' }}>
              <FaLock style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a084ff'
              }} />
              <input
                className="neon-input"
                style={{ paddingLeft: 40 }}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <input
              className="neon-input"
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
            <button className="neon-btn" type="submit">Register</button>
            <div className="neon-helper">
              Already have an account?{' '}
              <span className="neon-link" onClick={() => setTab('login')}>Login</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}