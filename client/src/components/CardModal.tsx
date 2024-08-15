import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FiStar } from 'react-icons/fi';
import { Mission } from '../types';

interface CardModalProps {
  card: Mission;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Mission>) => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);

  useEffect(() => {
    setEditedCard(card);
  }, [card]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedCard(prev => ({ ...prev, [name]: value }));
  };

  const handleUrgencyChange = (urgency: number) => {
    setEditedCard(prev => ({ ...prev, urgency }));
  };

  const handleSave = () => {
    onUpdate(card.id, editedCard);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-2/3 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedCard.title}
              onChange={handleInputChange}
              className="text-2xl font-bold w-full"
            />
          ) : (
            <h2 className="text-2xl font-bold">{card.title}</h2>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                onClick={() => handleUrgencyChange(star)}
                className={`cursor-pointer ${
                  star <= editedCard.urgency ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                size={24}
              />
            ))}
          </div>
        </div>
        {isEditing ? (
          <textarea
            name="content"
            value={editedCard.content}
            onChange={handleInputChange}
            className="w-full h-64 p-2 border rounded"
          />
        ) : (
          <div onClick={() => setIsEditing(true)} className="cursor-text">
            <ReactMarkdown>{card.content}</ReactMarkdown>
          </div>
        )}
        {isEditing && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardModal;