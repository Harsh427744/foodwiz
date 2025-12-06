'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const API_BASE_URL = 'http://localhost:3001';

type CartPayload = {
  restaurantId: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
};

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const data: CartPayload | null = useMemo(() => {
    const raw = searchParams.get('data');
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw)) as CartPayload;
    } catch {
      return null;
    }
  }, [searchParams]);

  if (!data || data.items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <button
            className="px-6 py-2 rounded bg-emerald-500 text-black font-medium hover:bg-emerald-400"
            onClick={() => router.push('/restaurants')}
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  const total = data.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  async function handlePlaceOrder() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId: data?.restaurantId ?? '',
          items: data?.items?.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })) ?? [],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      const order = await res.json();
      alert(`Order placed successfully! Order ID: ${order.id}`);
      router.push('/orders');
    } catch {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="space-y-4 mb-6">
        {data.items.map((item) => (
          <div
            key={item.menuItemId}
            className="border border-slate-700 rounded-lg p-4 bg-slate-900 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-slate-400">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p className="text-emerald-400 font-medium">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-4 mb-6">
        <div className="flex justify-between text-xl font-semibold">
          <span>Total:</span>
          <span className="text-emerald-400">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="w-full py-3 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-50"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? 'Placing order...' : 'Place Order'}
      </button>
    </main>
  );
}
