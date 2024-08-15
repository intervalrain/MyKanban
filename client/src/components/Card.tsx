import React, { useState, useRef, useEffect } from 'react';
import { FiEdit3, FiSave, FiX, FiCalendar, FiClock, FiTag, FiAlertCircle, FiStar } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

interface MissionProps {
  id: string;
  title: string;
  category: string;
  boardId: string;
  urgency: number;
  content: string;
  createdDate: Date;
  dueDate: Date;
  timeNeed: number; // Assuming this is in days
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onUpdate: (id: string, updates: Partial<MissionProps>) => void;
}

const Card: React.FC<MissionProps> = ({
  id,
  title,
  category,
  boardId,
  urgency,
  content,
  createdDate,
  dueDate,
  timeNeed,
  onDragStart,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [editData, setEditData] = useState({ title, category, urgency, content, dueDate, timeNeed });
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    if (isEditing || isDetailView) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, isDetailView]);

  const handleSave = () => {
    onUpdate(id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, category, urgency, content, dueDate, timeNeed });
    setIsEditing(false);
    setIsDetailView(false);
  };

  const handleCardClick = () => {
    if (!isEditing) {
      setIsDetailView(true);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} cursor-pointer`}
            onClick={() => setEditData({ ...editData, urgency: star })}
          />
        ))}
      </div>
    );
  };

  const renderEditView = () => (
    <div ref={editRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Card</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            id="category"
            type="text"
            value={editData.category}
            onChange={(e) => setEditData({...editData, category: e.target.value})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
          {renderStars(editData.urgency)}
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported)</label>
          <textarea
            id="content"
            value={editData.content}
            onChange={(e) => setEditData({...editData, content: e.target.value})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={5}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={editData.dueDate.toISOString().split('T')[0]}
            onChange={(e) => setEditData({...editData, dueDate: new Date(e.target.value)})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeNeed" className="block text-sm font-medium text-gray-700 mb-1">Time Needed (days)</label>
          <input
            id="timeNeed"
            type="number"
            value={editData.timeNeed}
            onChange={(e) => setEditData({...editData, timeNeed: parseInt(e.target.value)})}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={handleCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  const renderDetailView = () => (
    <div ref={editRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-2"><FiTag className="inline mr-2" />{category}</div>
        <div className="mb-2 flex items-center">
          <FiAlertCircle className="inline mr-2" />
          Urgency: {renderStars(urgency)}
        </div>
        {/* <div className="mb-2"><FiCalendar className="inline mr-2" />Due: {dueDate.toLocaleDateString()}</div> */}
        <div className="mb-2"><FiClock className="inline mr-2" />Time Needed: {timeNeed} days</div>
        {/* <div className="mb-2">Created: {createdDate.toLocaleDateString()}</div> */}
        <div className="mt-4 prose max-w-full">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button 
            onClick={() => setIsDetailView(false)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </button>
          <button 
            onClick={() => { setIsDetailView(false); setIsEditing(true); }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onClick={handleCardClick}
        className="bg-white p-4 mb-4 rounded-lg shadow-md cursor-move transform transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-lg text-gray-800">{title}</h4>
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="text-gray-500 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
          >
            <FiEdit3 />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">{content.length > 50 ? content.substring(0, 50) + '...' : content}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <FiCalendar className="mr-1" />
            {/* Due: {dueDate.toLocaleDateString()} */}
          </div>
          <div className="flex">
            {renderStars(urgency)}
          </div>
        </div>
      </div>
      {isEditing && renderEditView()}
      {isDetailView && renderDetailView()}
    </>
  );
};

export default Card;