// api.tsx
import { Board, Mission } from './types';

const API_URL = 'https://localhost:7118/api/Kanban'; 

export const api = {
  getBoards: async (): Promise<Board[]> => {
    const response = await fetch(`${API_URL}/boards`);
    return response.json();
  },

  getMissions: async (): Promise<Mission[]> => {
    const response = await fetch(`${API_URL}/missions`);
    return response.json();
  },

  addBoard: async (name: string): Promise<Board> => {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  addCard: async (boardId: string, card: Omit<Mission, 'id' | 'boardId' | 'createdDate' | 'dueDate'>): Promise<Mission> => {
    const response = await fetch(`${API_URL}/missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...card, boardId }),
    });
    return response.json();
  },

  moveCard: async (cardId: string, targetBoardId: string): Promise<void> => {
    await fetch(`${API_URL}/missions/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: targetBoardId }),
    });
  },

  deleteBoard: async (boardId: string): Promise<void> => {
    await fetch(`${API_URL}/boards/${boardId}`, { method: 'DELETE' });
  },

  deleteCard: async (cardId: string): Promise<void> => {
    await fetch(`${API_URL}/missions/${cardId}`, { method: 'DELETE' });
  },

  updateCard: async (cardId: string, updates: Partial<Mission>): Promise<void> => {
    await fetch(`${API_URL}/missions/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  updateBoard: async (boardId: string, newName: string): Promise<void> => {
    await fetch(`${API_URL}/boards/${boardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
  },

  reorderBoards: async (boardIds: string[]): Promise<void> => {
    await fetch(`${API_URL}/boards/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boardIds),
    });
  },
};