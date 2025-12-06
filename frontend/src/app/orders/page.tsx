'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:3001';

type OrderItem = {
  id: string;
  menuItemId: string;
  quantity: number;
};

type Order = {
  id: string;
  restaurantId: string;
  status: string;
  total: string | number;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
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
        const res = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to load orders');
        }

        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading orders...</p>
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

  if (orders.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">You have no orders yet</p>
          <button
            className="px-6 py-2 rounded bg-emerald-500 text-black font-medium hover:bg-emerald-400"
            onClick={() => router.push('/restaurants')}
          >
            Browse restaurants
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-slate-700 rounded-lg p-4 bg-slate-900"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">
                Order #{order.id.slice(0, 8)}
              </h2>
              <span className="text-xs px-2 py-1 rounded bg-slate-800 uppercase">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-1">
              Placed at: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-slate-300 mb-1">
              Items:{' '}
              {order.items.reduce((sum, i) => sum + i.quantity, 0)}
            </p>
            <p className="text-emerald-400 font-semibold">
              Total:{' '}
              ₹
              {typeof order.total === 'string'
                ? order.total
                : order.total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
