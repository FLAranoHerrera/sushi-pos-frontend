export type Product = { id: string; name: string; category: string; price: number; stock: number; emoji: string };
export type CartLine = { productId: string; quantity: number };
export type DemoOrder = { id: number; items: { name: string; productId: string; quantity: number; price: number }[]; total: number; status: 'pending' | 'paid' | 'cancelled' };
export type DemoState = { products: Product[]; cart: CartLine[]; orders: DemoOrder[] };
export function initialState(): DemoState {
  return { products: [
    { id: 'ramen', name: 'Ramen miso', category: 'Cocina', price: 16500, stock: 8, emoji: '🍜' },
    { id: 'roll', name: 'Rollo de salmón', category: 'Sushi', price: 14500, stock: 6, emoji: '🍣' },
    { id: 'gyoza', name: 'Gyozas de vegetales', category: 'Cocina', price: 8500, stock: 4, emoji: '🥟' },
    { id: 'tea', name: 'Té frío de jazmín', category: 'Bebidas', price: 4500, stock: 12, emoji: '🍵' },
    { id: 'mochi', name: 'Mochi de fresa', category: 'Postres', price: 6500, stock: 2, emoji: '🍡' },
    { id: 'tuna', name: 'Nigiri de atún', category: 'Sushi', price: 9500, stock: 0, emoji: '🍱' },
  ], cart: [], orders: [] };
}
export function cartTotal(state: DemoState) {
  return state.cart.reduce((total, line) => total + state.products.find(p => p.id === line.productId)!.price * line.quantity, 0);
}
export function changeQuantity(state: DemoState, productId: string, delta: number): DemoState {
  const product = state.products.find(p => p.id === productId);
  if (!product || !Number.isInteger(delta)) throw new Error('Producto o cantidad inválida.');
  const quantity = (state.cart.find(line => line.productId === productId)?.quantity || 0) + delta;
  if (quantity > product.stock) throw new Error('No hay más existencias de este producto.');
  const cart = state.cart.filter(line => line.productId !== productId);
  if (quantity > 0) cart.push({ productId, quantity });
  return { ...state, cart };
}
export function placeOrder(state: DemoState): DemoState {
  if (!state.cart.length) throw new Error('Añade al menos un producto antes de crear la orden.');
  for (const line of state.cart) {
    const product = state.products.find(p => p.id === line.productId);
    if (!product || !Number.isInteger(line.quantity) || line.quantity <= 0 || line.quantity > product.stock) throw new Error('Revisa las cantidades disponibles.');
  }
  const order: DemoOrder = {
    id: (state.orders[0]?.id || 1000) + 1, total: cartTotal(state), status: 'pending',
    items: state.cart.map(line => { const product = state.products.find(p => p.id === line.productId)!; return { ...line, name: product.name, price: product.price }; }),
  };
  return {
    products: state.products.map(product => ({ ...product, stock: product.stock - (state.cart.find(line => line.productId === product.id)?.quantity || 0) })),
    orders: [order, ...state.orders], cart: [],
  };
}
export function closeOrder(state: DemoState, id: number, status: 'paid' | 'cancelled'): DemoState {
  const order = state.orders.find(o => o.id === id);
  if (!order) throw new Error('Orden no encontrada.');
  if (order.status === status) return state;
  if (order.status !== 'pending') throw new Error('La orden ya está cerrada.');
  return {
    ...state,
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o),
    products: status === 'cancelled' ? state.products.map(p => ({ ...p, stock: p.stock + (order.items.find(line => line.productId === p.id)?.quantity || 0) })) : state.products,
  };
}
