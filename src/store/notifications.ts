import { create } from 'zustand';
import { notifications as seed } from '@/data/notifications';
import type { Notification } from '@/types';

interface NotifState {
  items: Notification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  unreadCount: () => number;
}

export const useNotifications = create<NotifState>((set, get) => ({
  items: seed,
  markAllRead: () => set({ items: get().items.map((n) => ({ ...n, read: true })) }),
  markRead: (id) => set({ items: get().items.map((n) => (n.id === id ? { ...n, read: true } : n)) }),
  unreadCount: () => get().items.filter((n) => !n.read).length,
}));
