'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRestaurants, Restaurant } from '@/lib/api';

export default function RestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function load() {
      try {
        const data = await getRestaurants(token as string);
        setRestaurants(data);
      } catch (err) {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading restaurants...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-red-400">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Restaurants</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map(r => (
          <div
            key={r.id}
            className="border border-slate-700 rounded-lg p-4 bg-slate-900"
          >
            <h2 className="font-semibold text-lg">{r.name}</h2>
            <p className="text-sm text-slate-300">{r.address}</p>
            <p className="text-xs text-slate-400 mt-1">Region: {r.region}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
