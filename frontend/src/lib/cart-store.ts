import { create } from 'zustand';

console.log('cart-store loaded'); 

type CartItem = {
  menuItemId: string;
  restaurantId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.menuItemId === item.menuItemId,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItemId === item.menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }),
  removeItem: (menuItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.menuItemId !== menuItemId),
    })),
  clear: () => set({ items: [] }),
}));
