import { create } from "zustand";

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    imageUrl?: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalAmount: () => number;
}

const stored: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
const persist = (items: CartItem[]) => localStorage.setItem('cart', JSON.stringify(items));

export const useCartStore = create<CartStore>()((set, get) => ({
    items: stored,

    addItem: (item, quantity = 1) => {
        const items = [...get().items];
        const idx = items.findIndex(i => i.productId === item.productId);
        if (idx >= 0) {
            const nuevaCantidad = Math.min(items[idx].quantity + quantity, item.stock);
            items[idx] = { ...items[idx], quantity: nuevaCantidad, stock: item.stock, price: item.price };
        } else {
            items.push({ ...item, quantity: Math.min(quantity, item.stock) });
        }
        persist(items);
        set({ items });
    },

    removeItem: (productId) => {
        const items = get().items.filter(i => i.productId !== productId);
        persist(items);
        set({ items });
    },

    updateQuantity: (productId, quantity) => {
        const items = get().items.map(i =>
            i.productId === productId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i
        );
        persist(items);
        set({ items });
    },

    clearCart: () => {
        persist([]);
        set({ items: [] });
    },

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    totalAmount: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
