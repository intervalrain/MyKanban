import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import SidebarNavigation from './components/SidebarNavigation';
import { Mission, Board } from './types';
import { api } from './api';

const App: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('Kanban');

  // 初始化
  useEffect(() => {
    api.getBoards().then(setBoards);
    api.getMissions().then(setMissions);
  }, []);

  // 新增看板
  const handleAddBoard = async (name: string) => {
    const newBoard = await api.addBoard(name);
    setBoards([...boards, newBoard]);
  };

  // 新增卡片
  const handleAddCard = async (boardId: string, card: Omit<Mission, 'id' | 'boardId' | 'createdDate' | 'dueDate'>) => {
    const newMission = await api.addCard(boardId, card);
    setMissions([...missions, newMission]);
  };

  // 移動卡片
  const handleMoveCard = async (cardId: string, targetBoardId: string) => {
    await api.moveCard(cardId, targetBoardId);
    setMissions(missions.map(mission =>
      mission.id === cardId ? { ...mission, boardId: targetBoardId } : mission
    ));
  };

  // 刪除看版
  const handleDeleteBoard = async (boardId: string) => {
    await api.deleteBoard(boardId);
    setBoards(boards.filter(board => board.id !== boardId));
    setMissions(missions.filter(mission => mission.boardId !== boardId));
  };

  // 刪除卡片
  const handleDeleteCard = async (cardId: string) => {
    await api.deleteCard(cardId);
    setMissions(missions.filter(mission => mission.id !== cardId));
  };

  // 更新卡片
  const handleUpdateCard = async (cardId: string, updates: Partial<Mission>) => {
    await api.updateCard(cardId, updates);
    setMissions(missions.map(mission =>
      mission.id === cardId ? { ...mission, ...updates } : mission
    ));
  };

  // 更新看版
  const handleUpdateBoardName = async (boardId: string, newName: string) => {
    await api.updateBoard(boardId, newName);
    setBoards(boards.map(b => b.id === boardId ? { ...b, name: newName } : b));
  };

  // 重排看版
  const handleReorderBoards = async (boardIds: string[]) => {
    await api.reorderBoards(boardIds);
    const reorderedBoards = boardIds.map(id => boards.find(board => board.id === id)!);
    setBoards(reorderedBoards);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen">
    <SidebarNavigation onPageChange={handlePageChange} />
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-4">{currentPage}</h1>
      {currentPage === 'Kanban' && (
        <KanbanBoard
          missions={missions}
          boards={boards}
          onAddBoard={handleAddBoard}
          onAddCard={handleAddCard}
          onMoveCard={handleMoveCard}
          onDeleteBoard={handleDeleteBoard}
          onDeleteCard={handleDeleteCard}
          onUpdateCard={handleUpdateCard}
          onUpdateBoardName={handleUpdateBoardName}
          onReorderBoards={handleReorderBoards}
        />
      )}
      {/* Add conditional rendering for other pages here */}
    </div>
  </div>
  );
};

export default App;