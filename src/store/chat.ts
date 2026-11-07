import { create } from 'zustand';
import type { ChatMessage } from '@/types';
import { generateAiReply } from '@/data/ai';

let counter = 0;
const id = () => `m${Date.now()}_${counter++}`;

interface ChatState {
  messages: ChatMessage[];
  thinking: boolean;
  send: (text: string) => void;
  reset: () => void;
}

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  thinking: false,
  send: (text) => {
    const trimmed = text.trim();
    if (!trimmed || get().thinking) return;

    const userMsg: ChatMessage = { id: id(), role: 'user', text: trimmed };
    const pendingId = id();
    set({
      messages: [
        ...get().messages,
        userMsg,
        { id: pendingId, role: 'assistant', text: '', pending: true },
      ],
      thinking: true,
    });

    // Simulate streaming latency for a realistic feel.
    setTimeout(() => {
      const reply = generateAiReply(trimmed);
      set({
        thinking: false,
        messages: get().messages.map((m) =>
          m.id === pendingId ? { ...m, text: reply, pending: false } : m,
        ),
      });
    }, 900);
  },
  reset: () => set({ messages: [], thinking: false }),
}));
