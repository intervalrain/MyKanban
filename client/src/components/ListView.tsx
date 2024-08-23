import React, { useState, useMemo } from 'react';
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

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

interface ListViewProps {
  missions: Mission[];
  onUpdateMission: (id: string, updates: Partial<Mission>) => void;
  onDeleteMission: (id: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ missions, onUpdateMission, onDeleteMission }) => {
  const [sortField, setSortField] = useState<keyof Mission>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');
  const [editingMission, setEditingMission] = useState<string | null>(null);

  const sortedAndFilteredMissions = useMemo(() => {
    return missions
      .filter(mission => 
        mission.title.toLowerCase().includes(filter.toLowerCase()) ||
        mission.category.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [missions, sortField, sortDirection, filter]);

  const handleSort = (field: keyof Mission) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field: keyof Mission) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiChevronUp className="inline" /> : <FiChevronDown className="inline" />;
  };

  const handleEdit = (mission: Mission) => {
    setEditingMission(mission.id);
  };

  const handleSave = (mission: Mission) => {
    onUpdateMission(mission.id, mission);
    setEditingMission(null);
  };

  const handleCancel = () => {
    setEditingMission(null);
  };

  const getUrgencyColor = (urgency: number) => {
    switch(urgency) {
      case 1: return 'bg-green-200 text-green-800';
      case 2: return 'bg-yellow-200 text-yellow-800';
      case 3: return 'bg-orange-200 text-orange-800';
      case 4: return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter missions..."
          className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 cursor-pointer" onClick={() => handleSort('title')}>
                Title {renderSortIcon('title')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('category')}>
                Category {renderSortIcon('category')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('urgency')}>
                Urgency {renderSortIcon('urgency')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('dueDate')}>
                Due Date {renderSortIcon('dueDate')}
              </th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredMissions.map(mission => (
              <tr key={mission.id} className="border-b hover:bg-gray-50">
                {editingMission === mission.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        value={mission.title}
                        onChange={(e) => onUpdateMission(mission.id, { ...mission, title: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={mission.category}
                        onChange={(e) => onUpdateMission(mission.id, { ...mission, category: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={mission.urgency}
                        onChange={(e) => onUpdateMission(mission.id, { ...mission, urgency: parseInt(e.target.value) })}
                        className="w-full p-1 border rounded"
                      >
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                        <option value={4}>Critical</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        value={mission.dueDate.split('T')[0]}
                        onChange={(e) => onUpdateMission(mission.id, { ...mission, dueDate: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-3">
                      <button className="mr-2 text-green-500 hover:text-green-700" onClick={() => handleSave(mission)}>Save</button>
                      <button className="text-gray-500 hover:text-gray-700" onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{mission.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full bg-blue-200 text-blue-800 text-sm">
                        {mission.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${getUrgencyColor(mission.urgency)}`}>
                        {mission.urgency === 1 ? 'Low' : mission.urgency === 2 ? 'Medium' : mission.urgency === 3 ? 'High' : 'Critical'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {format(new Date(mission.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </td>
                    <td className="p-3">
                      <button className="mr-2 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(mission)}>
                        <FiEdit2 />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => onDeleteMission(mission.id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;