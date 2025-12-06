export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
};

let cart: CartItem[] = [];

export function getCart() {
  return cart;
}

export function clearCart() {
  cart = [];
}

export function addToCart(item: CartItem) {
  const existing = cart.find(
    c => c.menuItemId === item.menuItemId && c.restaurantId === item.restaurantId,
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
}
