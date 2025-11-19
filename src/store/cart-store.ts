import { create } from "zustand"; //make Zustand store
import { persist } from "zustand/middleware"; //store persist inside localStorage

//defines what each cart must contain
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

//global store will contain
interface CartStore {
  items: CartItem[]; //array of cart items
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void; //() -> add item to cart
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      //persist -> saves cart even after page refresh
      items: [],
      addItem: (item) =>
        set((state) => {
          //state -> to manipulate
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, item] }; //rest operator -> collect existimg items + add new item
        }),

      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

          return { items: updatedItems };
        }),

      clearCart: () => set(() => ({ items: [] })),
    }),
    { name: "cart" } // key -> cart
  )
);

//creates shopping cart using Zustand with persist middleware to save cart in localStorage

//Zustand is a lightweight, fast, and scalable state management library for React applications.
// It provides a simple and intuitive way to manage global state in your application,
// similar to other state management solutions like Redux but with less boilerplate code.
