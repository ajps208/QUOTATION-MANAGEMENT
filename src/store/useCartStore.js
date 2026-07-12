import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      businessId: null,
      generalNote: '',

      addItem: (product, quantity = 1, notes = '') => set((state) => {
        // If adding from a different business, clear the cart first
        let newItems = [...state.items];
        let newBusinessId = state.businessId;

        if (state.businessId && state.businessId !== product.businessId) {
          newItems = [];
        }
        
        newBusinessId = product.businessId;

        const existingItemIndex = newItems.findIndex((item) => item.productId === product.id);
        
        if (existingItemIndex >= 0) {
          newItems[existingItemIndex].quantity += quantity;
          if (notes) newItems[existingItemIndex].notes = notes;
        } else {
          newItems.push({
            productId: product.id,
            name: product.name,
            quantity,
            notes,
            unitPrice: product.basePrice, // helpful for reference
          });
        }

        return { items: newItems, businessId: newBusinessId };
      }),

      removeItem: (productId) => set((state) => {
        const newItems = state.items.filter((item) => item.productId !== productId);
        return { 
          items: newItems,
          businessId: newItems.length === 0 ? null : state.businessId 
        };
      }),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map((item) => 
          item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      updateItemNotes: (productId, notes) => set((state) => ({
        items: state.items.map((item) => 
          item.productId === productId ? { ...item, notes } : item
        )
      })),

      setGeneralNote: (note) => set({ generalNote: note }),

      clearCart: () => set({ items: [], businessId: null, generalNote: '' }),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: 'quotation-cart-storage',
    }
  )
);
