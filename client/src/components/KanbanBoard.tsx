import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import { FiPlus, FiTrash2, FiEdit2, FiRepeat } from 'react-icons/fi';

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

interface KanbanBoardProps {
  missions: Mission[];
  boards: Board[];
  onAddBoard: (name: string) => void;
  onAddCard: (boardId: string, card: Omit<Mission, 'id' | 'boardId' | 'createdDate' | 'dueDate'>) => void;
  onMoveCard: (cardId: string, targetBoardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, updates: Partial<Mission>) => void;
  onUpdateBoardName: (boardId: string, newName: string) => void;
  onReorderBoards: (boardIds: string[]) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  missions, 
  boards, 
  onAddBoard, 
  onAddCard, 
  onMoveCard,
  onDeleteBoard,
  onDeleteCard,
  onUpdateCard,
  onUpdateBoardName,
  onReorderBoards
}) => {
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const addBoardRef = useRef<HTMLDivElement>(null);
  const editBoardInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBoardId) {
      editBoardInputRef.current?.focus();
    }
  }, [editingBoardId]);

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      onAddBoard(newBoardName.trim());
      setNewBoardName('');
      setIsAddingBoard(false);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    const boardMissions = missions.filter(mission => mission.boardId === boardId);
    boardMissions.forEach(mission => onDeleteCard(mission.id));
    onDeleteBoard(boardId);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, cardId: string) => {
    if (editingCardId === cardId) return;
    setDraggedCard(cardId);
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetBoardId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId && draggedCard) {
      onMoveCard(cardId, targetBoardId);
    }
    setDraggedCard(null);
  };

  const handleDeleteDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId && draggedCard) {
      onDeleteCard(cardId);
    }
    setDraggedCard(null);
  };

  const handleAddCard = (boardId: string) => {
    const newCard: Omit<Mission, 'id' | 'boardId' | 'createdDate' | 'dueDate'> = {
      title: 'New Card',
      category: 'Default Category',
      urgency: 3,
      content: 'New Content',
      timeNeed: 1
    };
    onAddCard(boardId, newCard);
  };

  const handleBoardNameEdit = (boardId: string, newName: string) => {
    onUpdateBoardName(boardId, newName);
    setEditingBoardId(null);
  };

  const handleSwapBoards = (boardId: string) => {
    const currentIndex = boards.findIndex(board => board.id === boardId);
    if (currentIndex < boards.length - 1) {
      const newBoards = [...boards];
      [newBoards[currentIndex], newBoards[currentIndex + 1]] = [newBoards[currentIndex + 1], newBoards[currentIndex]];
      onReorderBoards(newBoards.map(board => board.id));
    }
  };

  return (
    <div className="relative">
      <div className="flex overflow-x-auto p-4">
        {boards.map((board, index) => (
          <div 
            key={board.id} 
            className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-4 mr-4 relative"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, board.id)}
          >
            {index < boards.length - 1 && (
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                onClick={() => handleSwapBoards(board.id)}
              >
                <FiRepeat size={20} />
              </button>
            )}
            <div className="flex justify-between items-center mb-2">
              {editingBoardId === board.id ? (
                <input 
                  ref={editBoardInputRef}
                  type="text"
                  value={board.name}
                  onChange={(e) => onUpdateBoardName(board.id, e.target.value)}
                  onBlur={() => setEditingBoardId(null)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBoardNameEdit(board.id, (e.target as HTMLInputElement).value)}
                  className="font-bold bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h3 
                  className="font-bold cursor-pointer"
                  onClick={() => setEditingBoardId(board.id)}
                >
                  {board.name}
                </h3>
              )}
              <div className="flex">
                <button 
                  onClick={() => setEditingBoardId(board.id)}
                  className="text-gray-500 hover:text-gray-700 mr-2"
                >
                  <FiEdit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteBoard(board.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            {missions
              .filter(mission => mission.boardId === board.id)
              .map(mission => (
                <Card 
                  key={mission.id}
                  {...mission}
                  onDragStart={(e) => handleDragStart(e, mission.id)}
                  onUpdate={onUpdateCard}
                  isEditing={editingCardId === mission.id}
                  setEditing={(isEditing) => setEditingCardId(isEditing ? mission.id : null)}
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
          ref={addBoardRef}
          className={`flex-shrink-0 h-full flex items-center justify-center transition-all duration-500 ease-in-out ${isAddingBoard ? 'w-72' : 'w-16'}`}
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