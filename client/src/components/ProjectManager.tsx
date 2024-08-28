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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [fetchedBoards, fetchedMissions] = await Promise.all(([
                api.getBoards(),
                api.getMissions()
            ]));
            setBoards(fetchedBoards);
            setMissions(fetchedMissions);
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Error fetching data', err);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
  }, []);

  const handleAddBoard = async (name: string) => {
    try {
      const newBoard = await api.addBoard(name);
      setBoards([...boards, newBoard]);
    } catch (err) {
      console.error('Error adding board:', err);
      setError('Failed to add board. Please try again.');
    }
  };

  const handleAddMission = async (boardId: string, mission: Omit<Mission, 'id' | 'boardId' | 'createdDate' | 'dueDate'>) => {
    try {
      const newMission = await api.addCard(boardId, mission);
      setMissions([...missions, newMission]);
    } catch (err) {
      console.error('Error adding mission:', err);
      setError('Failed to add mission. Please try again.');
    }
  };

  const handleMoveMission = async (missionId: string, targetBoardId: string) => {
    try {
      await api.moveCard(missionId, targetBoardId);
      setMissions(missions.map(mission =>
        mission.id === missionId ? { ...mission, boardId: targetBoardId } : mission
      ));
    } catch (err) {
      console.error('Error moving mission:', err);
      setError('Failed to move mission. Please try again.');
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await api.deleteBoard(boardId);
      setBoards(boards.filter(board => board.id !== boardId));
      setMissions(missions.filter(mission => mission.boardId !== boardId));
    } catch (err) {
      console.error('Error deleting board:', err);
      setError('Failed to delete board. Please try again.');
    }
  };

  const handleDeleteMission = async (missionId: string) => {
    try {
      await api.deleteCard(missionId);
      setMissions(missions.filter(mission => mission.id !== missionId));
    } catch (err) {
      console.error('Error deleting mission:', err);
      setError('Failed to delete mission. Please try again.');
    }
  };


  const handleUpdateMission = async (missionId: string, updates: Partial<Mission>) => {
    try {
      await api.updateCard(missionId, updates);
      setMissions(missions.map(mission =>
        mission.id === missionId ? { ...mission, ...updates } : mission
      ));
    } catch (err) {
      console.error('Error updating mission:', err);
      setError('Failed to update mission. Please try again.');
    }
  };

  const handleReorderBoards = async (newBoardOrder: string[]) => {
    try {
      await api.reorderBoards(newBoardOrder);
      const newBoards = newBoardOrder.map(boardId => boards.find(board => board.id === boardId)!);
      setBoards(newBoards);
    } catch (err) {
      console.error('Error reordering boards:', err);
      setError('Failed to reorder boards. Please try again.');
    }
  };

  const handleUpdateBoardName = async (boardId: string, newName: string) => {
    try {
      await api.updateBoard(boardId, newName);
      setBoards(boards.map(board =>
        board.id === boardId ? { ...board, name: newName } : board
      ));
    } catch (err) {
      console.error('Error updating board name:', err);
      setError('Failed to update board name. Please try again.');
    }
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

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