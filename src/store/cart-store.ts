import { create } from "zustand"; //zustand store
import { persist } from "zustand/middleware"; //zustand middleware
import debounce from "lodash.debounce"; //prevents sync() from firing too frequently

//define the shape of cartItem stored locally
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

//define actions store can take
interface CartStore {
  items: CartItem[];
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  syncWithServer: () => Promise<void>; //server call
}

export const useCartStore = create<CartStore>()(
  persist( //wraps the state so it is saved to localStorage
    (set, get) => ({ //set -> update the store; get -> read current store
      items: [], //initial state
      isSyncing: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id); //find item by stripe productId
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }; //increase qty by 1 if exists
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })), //reduce qty by 1 , if found

      clearCart: () => set({ items: [] }), 

      syncWithServer: async () => {
        const { items, isSyncing } = get(); //read current cart
        if (isSyncing || items.length === 0) return; //if already syncing -> abort to prevent duplication

       // console.log("ZUSTAND → SYNCING CART:", items);   // ← THIS MUST APPEAR

        set({ isSyncing: true }); //prevent multiple syncs
        try { //send POST req
          await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }), //contains entire cart array
          });
        } catch (err) {
          console.error("Sync failed:", err);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "cart", //localStorage key
      onRehydrateStorage: () => (state) => { //runs after localStorage loads AND before store is available
        if (!state) return; //no prev storage

        const sync = debounce(() => { //if user modifies cart repeatedly -> sync runs only once per sec ; saves server load
         // console.log("AUTO SYNC TRIGGERED");
          state.syncWithServer();
        }, 1000); 

        // Sync on load
        sync();

        // Sync on every change ; Auto sync on cart change
        const unsubscribe = useCartStore.subscribe(() => {
          sync();
        });

        //cancel pending debounce
        window.addEventListener("beforeunload", () => {
          sync.cancel();
          unsubscribe();
        });
      },
    }
  )
);



//creates shopping cart using Zustand with persist middleware to save cart in localStorage

//Zustand is a lightweight, fast, and scalable state management library for React applications.
// It provides a simple and intuitive way to manage global state in your application,
// similar to other state management solutions like Redux but with less boilerplate code.

//The Lodash _.debounce() method is a utility function that delays the execution of a given function until a specified wait time has passed since the last invocation. 