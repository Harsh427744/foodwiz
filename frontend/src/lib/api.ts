const API_BASE_URL = 'http://localhost:3001';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  return res.json() as Promise<{ access_token: string }>;
}

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  region: string;
};

export async function getRestaurants(token: string) {
  const res = await fetch(`${API_BASE_URL}/restaurants`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to load restaurants');
  }

  return res.json() as Promise<Restaurant[]>;
}

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  restaurantId: string;
};

export async function getMenuItems(token: string, restaurantId: string) {
  const res = await fetch(
    `${API_BASE_URL}/menu-items?restaurantId=${encodeURIComponent(restaurantId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to load menu items');
  }

  return res.json() as Promise<MenuItem[]>;
}
