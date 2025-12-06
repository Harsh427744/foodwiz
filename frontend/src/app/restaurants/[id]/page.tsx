'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMenuItems, MenuItem } from '@/lib/api';

type LocalCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function RestaurantMenuPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const restaurantId = params.id;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, LocalCartItem>>({});

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
      } catch {
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurantId, router]);

  function increment(item: MenuItem) {
    setCart((prev) => {
      const existing = prev[item.id];
      const price = Number(item.price);
      if (!existing) {
        return {
          ...prev,
          [item.id]: {
            id: item.id,
            name: item.name,
            price,
            quantity: 1,
          },
        };
      }
      return {
        ...prev,
        [item.id]: {
          ...existing,
          quantity: existing.quantity + 1,
        },
      };
    });
  }

  function decrement(itemId: string) {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  }

  function goToCart() {
    const entries = Object.values(cart);
    if (entries.length === 0) return;

    const payload = {
      restaurantId,
      items: entries.map((i) => ({
        menuItemId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    };

    const encoded = encodeURIComponent(JSON.stringify(payload));
    router.push(`/cart?data=${encoded}`);
  }

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

  const totalQty = Object.values(cart).reduce(
    (sum, i) => sum + i.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">Menu</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {items.map((item) => {
          const inCart = cart[item.id];
          return (
            <div
              key={item.id}
              className="border border-slate-700 rounded-lg p-4 bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">{item.name}</h2>
                {item.description && (
                  <p className="text-sm text-slate-300">{item.description}</p>
                )}
                <p className="mt-2 text-emerald-400 font-medium">
                  ₹{' '}
                  {typeof item.price === 'string'
                    ? item.price
                    : item.price.toFixed(2)}
                </p>
              </div>

              {!inCart ? (
                <button
                  className="mt-4 w-full py-2 rounded bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400"
                  onClick={() => increment(item)}
                >
                  Add to cart
                </button>
              ) : (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="px-3 py-1 rounded bg-red-500 text-black text-sm font-medium hover:bg-red-400"
                    onClick={() => decrement(item.id)}
                  >
                    −
                  </button>
                  <span className="text-sm">{inCart.quantity}</span>
                  <button
                    className="px-3 py-1 rounded bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400"
                    onClick={() => increment(item)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalQty > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-full px-6 py-3 flex items-center gap-4 shadow-lg">
          <span className="text-sm text-slate-200">
            Items in cart: {totalQty}
          </span>
          <button
            className="px-4 py-2 rounded-full bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400"
            onClick={goToCart}
          >
            Go to cart
          </button>
        </div>
      )}
    </main>
  );
}
