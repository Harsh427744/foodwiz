'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('fury@shield.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      // store token in localStorage
      localStorage.setItem('access_token', data.access_token);
      // go to restaurants page (we'll build next)
      router.push('/restaurants');
    } catch (err) {
      setError('Login failed. Check email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-slate-900 p-6 rounded-lg border border-slate-700"
      >
        <h1 className="text-xl font-semibold text-center">FoodWiz Login</h1>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input
            className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-sm"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-emerald-500 text-black font-medium hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
