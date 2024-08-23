import React, { useState, useEffect } from 'react';
import KanbanBoard from './KanbanBoard';
import ListView from './ListView';
import CalendarView from './CalendarView';
import GanttView from './GanttView';
import DashboardView from './DashboardView';
import { api } from '../api'

interface Mission {
  id: string;
  title: string;
  category: string;
  boardId: string;
  urgency: number;
  content: string;
  createdDate: string;
  dueDate: string;
  timeNeed: number;
}

interface Board {
  id: string;
  name: string;
}

type ViewType = 'kanban' | 'list' | 'calendar' | 'gantt' | 'dashboard';

interface ProjectManagerProps {
    currentView: ViewType;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ currentView }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    api.getBoards().then(setBoards);
    api.getMissions().then(setMissions);
  }, []);

  const handleAddBoard = (name: string) => {
    const newBoard: Board = { id: Date.now().toString(), name };
    setBoards([...boards, newBoard]);
  };

  const handleAddMission = (boardId: string, mission: Omit<Mission, 'id' | 'boardId' | 'createdDate' | 'dueDate'>) => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const newMission: Mission = {
      ...mission,
      id: Date.now().toString(),
      boardId,
      createdDate: new Date().toISOString(),
      dueDate: nextWeek.toISOString(),
    };
    setMissions([...missions, newMission]);
  };

  const handleMoveMission = (missionId: string, targetBoardId: string) => {
    setMissions(missions.map(mission =>
      mission.id === missionId ? { ...mission, boardId: targetBoardId } : mission
    ));
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoards(boards.filter(board => board.id !== boardId));
    setMissions(missions.filter(mission => mission.boardId !== boardId));
  };

  const handleDeleteMission = (missionId: string) => {
    setMissions(missions.filter(mission => mission.id !== missionId));
  };

  const handleUpdateMission = (missionId: string, updates: Partial<Mission>) => {
    setMissions(missions.map(mission =>
      mission.id === missionId ? { ...mission, ...updates } : mission
    ));
  };

  const handleReorderBoards = (newBoardOrder: string[]) => {
    const newBoards = newBoardOrder.map(boardId => boards.find(board => board.id === boardId)!);
    setBoards(newBoards);
  };

  const handleUpdateBoardName = (boardId: string, newName: string) => {
    setBoards(boards.map(board =>
      board.id === boardId ? { ...board, name: newName } : board
    ));
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return (
          <KanbanBoard
            missions={missions}
            boards={boards}
            onAddBoard={handleAddBoard}
            onAddCard={handleAddMission}
            onMoveCard={handleMoveMission}
            onDeleteBoard={handleDeleteBoard}
            onDeleteCard={handleDeleteMission}
            onUpdateCard={handleUpdateMission}
            onReorderBoards={handleReorderBoards}
            onUpdateBoardName={handleUpdateBoardName}
          />
        );
      case 'list':
        return <ListView missions={missions} onUpdateMission={handleUpdateMission} onDeleteMission={handleDeleteMission} />;
      case 'calendar':
        return <CalendarView missions={missions} onUpdateMission={handleUpdateMission} />;
      case 'gantt':
        return <GanttView missions={missions} onUpdateMission={handleUpdateMission} />;
      case 'dashboard':
        return <DashboardView missions={missions} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-grow overflow-hidden">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default ProjectManager;