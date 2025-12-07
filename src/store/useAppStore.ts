import { create } from 'zustand';
import type { Node } from '@xyflow/react';

interface AppState {
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    isTestPanelOpen: boolean;
    setTestPanelOpen: (isOpen: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    isTestPanelOpen: false,
    setTestPanelOpen: (isOpen) => set({ isTestPanelOpen: isOpen }),
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
