import React, { useState } from 'react';
import Card from './Card';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Mission, Board } from '../types';

interface KanbanBoardProps {
  missions: Mission[];
  boards: Board[];
  onAddBoard: (name: string) => void;
  onAddCard: (boardId: string, card: Omit<Mission, 'id' | 'boardId' | 'createdDate'>) => void;
  onMoveCard: (cardId: string, targetBoardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Mission>) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  missions, 
  boards, 
  onAddBoard, 
  onAddCard, 
  onMoveCard,
  onDeleteBoard,
  onDeleteCard,
  onUpdateCard
}) => {
  const [draggedItem, setDraggedItem] = useState<{ type: 'card' | 'board', id: string } | null>(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      onAddBoard(newBoardName.trim());
      setNewBoardName('');
      setIsAddingBoard(false);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    onDeleteBoard(boardId);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: 'card' | 'board', id: string) => {
    setDraggedItem({ type, id });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetBoardId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'card') {
      onMoveCard(draggedItem.id, targetBoardId);
    }
    setDraggedItem(null);
  };

  const handleDeleteDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem) {
      if (draggedItem.type === 'card') {
        onDeleteCard(draggedItem.id);
      } else if (draggedItem.type === 'board') {
        onDeleteBoard(draggedItem.id);
      }
    }
    setDraggedItem(null);
  };

  const handleAddCard = (boardId: string) => {
    const newCard: Omit<Mission, 'id' | 'boardId' | 'createdDate'> = {
      title: 'New Card',
      category: 'Default Category',
      urgency: 3,
      content: 'New Content',
      dueDate: new Date(),
      timeNeed: 1
    };
    onAddCard(boardId, newCard);
  };

  return (
    <div className="relative">
      <div className="flex overflow-x-auto p-4">
        {boards.map(board => (
          <div 
            key={board.id} 
            className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4 mr-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, board.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{board.name}</h3>
              <button 
                onClick={() => handleDeleteBoard(board.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
            {missions
              .filter(mission => mission.boardId === board.id)
              .map(mission => (
                <Card 
                  key={mission.id}
                  {...mission}
                  onDragStart={(e) => handleDragStart(e, 'card', mission.id)}
                  onUpdate={onUpdateCard}
                />
              ))}
            <button 
              onClick={() => handleAddCard(board.id)}
              className="mt-2 bg-green-500 text-white p-2 rounded w-full flex items-center justify-center"
            >
              <FiPlus size={20} />
            </button>
          </div>
        ))}
        <div 
          className={`flex-shrink-0 h-full flex items-center justify-center transition-all duration-300 ease-in-out ${isAddingBoard ? 'w-72' : 'w-16'}`}
          onMouseEnter={() => !isAddingBoard && setIsAddingBoard(true)}
          onMouseLeave={() => !newBoardName && setIsAddingBoard(false)}
        >
          {isAddingBoard ? (
            <div className="w-full bg-gray-100 rounded-lg p-4">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name"
                className="w-full p-2 border rounded mb-2"
                autoFocus
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setIsAddingBoard(false);
                    setNewBoardName('');
                  }}
                  className="mr-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBoard}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="p-4 bg-gray-200 rounded-lg text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition-colors duration-200"
            >
              <FiPlus size={24} />
            </button>
          )}
        </div>
      </div>
      <div 
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 p-4 bg-red-500 rounded-full cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDeleteDrop}
      >
        <FiTrash2 size={24} color="white" />
      </div>
    </div>
  );
};

export default KanbanBoard;