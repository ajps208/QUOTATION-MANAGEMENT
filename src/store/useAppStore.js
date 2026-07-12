import { create } from 'zustand';

export const useAppStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  
  // Active business context (if user manages multiple businesses)
  currentBusinessId: null,
  setCurrentBusinessId: (id) => set({ currentBusinessId: id }),
}));
