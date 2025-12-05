'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMenuItems, MenuItem } from '@/lib/api';

export default function RestaurantMenuPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const restaurantId = params.id;

  const [items, setItems] = useState<MenuItem[]>([]);
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
        const data = await getMenuItems(token as string, restaurantId);
        setItems(data);
      } catch (_) {
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurantId, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading menu...</p>
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
      <h1 className="text-2xl font-semibold mb-6">Menu</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div
            key={item.id}
            className="border border-slate-700 rounded-lg p-4 bg-slate-900"
          >
            <h2 className="font-semibold text-lg">{item.name}</h2>
            {item.description && (
              <p className="text-sm text-slate-300">{item.description}</p>
            )}
            <p className="mt-2 text-emerald-400 font-medium">
              ₹ {typeof item.price === 'string' ? item.price : item.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
