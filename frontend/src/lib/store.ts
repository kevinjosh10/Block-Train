import { create } from 'zustand';
import { Train } from './types';

export interface Block {
  id: string; 
  department: string;
  date: string;
  fromTime: string;
  toTime: string;
  urgency?: string;
}

interface MaintenanceStore {
  activeBlocks: Block[];
  trains: Train[];
  dispatchAudioUrl: string | null;
  setTrains: (trains: Train[]) => void;
  setDispatchAudioUrl: (url: string | null) => void;
  fetchBlocks: () => Promise<void>;
  addBlock: (block: Block) => Promise<void>;
  removeBlock: (id: string) => Promise<void>;
  applyAISchedule: (blocks: Block[]) => void;
  clearAllBlocks: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'block_train_active_blocks';

const loadSavedBlocks = (): Block[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveBlocks = (blocks: Block[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch (e) {
      console.error('Failed to save blocks to localStorage:', e);
    }
  }
};

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = `${backendUrl}/api/active_blocks`;

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  activeBlocks: [],
  trains: [],
  dispatchAudioUrl: null,
  setTrains: (trains) => set({ trains }),
  setDispatchAudioUrl: (url) => set({ dispatchAudioUrl: url }),
  
  hydrate: () => {
    const local = loadSavedBlocks();
    if (local.length > 0) {
      set({ activeBlocks: local });
    }
  },
  
  fetchBlocks: async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      if (data.success && Array.isArray(data.blocks)) {
        // Merge server blocks with locally preserved active blocks
        set((state) => {
          const current = [...state.activeBlocks];
          let changed = false;
          for (const sb of data.blocks) {
            if (!current.some((b) => b.id === sb.id)) {
              current.push(sb);
              changed = true;
            }
          }
          if (!changed) return state; // Don't trigger a re-render if nothing changed!
          saveBlocks(current);
          return { activeBlocks: current };
        });
      }
    } catch {
      // If server unreachable, preserve local activeBlocks
      const local = loadSavedBlocks();
      if (local.length > 0 && get().activeBlocks.length === 0) {
        set({ activeBlocks: local });
      }
    }
  },

  addBlock: async (block) => {
    // Immediately add and persist block so it reflects on map in real time!
    set((state) => {
      const updated = [...state.activeBlocks.filter((b) => b.id !== block.id), block];
      saveBlocks(updated);
      return { activeBlocks: updated };
    });

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(block)
      });
    } catch {
      // Backend optional
    }
  },

  removeBlock: async (id) => {
    set((state) => {
      const updated = state.activeBlocks.filter((b) => b.id !== id);
      saveBlocks(updated);
      return { activeBlocks: updated };
    });

    try {
      await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch {
      // Backend optional
    }
  },

  applyAISchedule: (blocks) => {
    set((state) => {
      const existingMap = new Map(state.activeBlocks.map((b) => [b.id, b]));
      for (const b of blocks) {
        existingMap.set(b.id, b);
      }
      const combined = Array.from(existingMap.values());
      saveBlocks(combined);
      return { activeBlocks: combined };
    });
  },

  clearAllBlocks: () => {
    saveBlocks([]);
    set({ activeBlocks: [] });
  }
}));

// Client-side auto-hydration on page load
if (typeof window !== 'undefined') {
  const initial = loadSavedBlocks();
  if (initial.length > 0) {
    useMaintenanceStore.setState({ activeBlocks: initial });
  }
}
