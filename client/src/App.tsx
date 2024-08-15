import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import { Mission, Board } from './types';
import { API_URL } from './config';

const App: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  // 初始化
  useEffect(() => {
    fetch(`${API_URL}/boards`)
      .then(response => response.json())
      .then(data => setBoards(data));

    fetch(`${API_URL}/missions`)
      .then(response => response.json())
      .then(data => setMissions(data));
  }, []);

  // 新增看版
  const handleAddBoard = (name: string) => {
    fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then(response => response.json())
      .then(newBoard => setBoards([...boards, newBoard]));
  };

  const handleAddCard = (boardId: string, card: Omit<Mission, 'id' | 'boardId' | 'createdDate'>) => {
    fetch(`${API_URL}/missions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...card,
        boardId,
      }),
    })
      .then(response => response.json())
      .then(newMission => setMissions([...missions, newMission]));
  };

  const handleMoveCard = (cardId: string, targetBoardId: string) => {
    fetch(`${API_URL}/missions/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ boardId: targetBoardId }),
    })
      .then(() => {
        setMissions(missions.map(mission => 
          mission.id === cardId ? { ...mission, boardId: targetBoardId } : mission
        ));
      });
  };

  const handleDeleteBoard = (boardId: string) => {
    fetch(`${API_URL}/boards/${boardId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBoards(boards.filter(board => board.id !== boardId));
        setMissions(missions.filter(mission => mission.boardId !== boardId));
      });
  };

  const handleDeleteCard = (cardId: string) => {
    fetch(`${API_URL}/missions/${cardId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMissions(missions.filter(mission => mission.id !== cardId));
      });
  };

  const handleUpdateCard = (cardId: string, updates: Partial<Mission>) => {
    fetch(`${API_URL}/missions/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
      .then(() => {
        setMissions(missions.map(mission => 
          mission.id === cardId ? { ...mission, ...updates } : mission
        ));
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <KanbanBoard 
        missions={missions} 
        boards={boards} 
        onAddBoard={handleAddBoard}
        onAddCard={handleAddCard}
        onMoveCard={handleMoveCard}
        onDeleteBoard={handleDeleteBoard}
        onDeleteCard={handleDeleteCard}
        onUpdateCard={handleUpdateCard}
      />
    </div>
  );
};

export default App;