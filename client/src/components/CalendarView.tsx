import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

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

interface CalendarViewProps {
  missions: Mission[];
  onUpdateMission: (id: string, updates: Partial<Mission>) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ missions, onUpdateMission }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getUrgencyColor = (urgency: number) => {
    switch(urgency) {
      case 1: return 'bg-green-200 border-green-500';
      case 2: return 'bg-yellow-200 border-yellow-500';
      case 3: return 'bg-orange-200 border-orange-500';
      case 4: return 'bg-red-200 border-red-500';
      default: return 'bg-gray-200 border-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <FiChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <FiChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold p-2">
            {day}
          </div>
        ))}
        {calendarDays.map(day => {
          const dayMissions = missions.filter(mission => isSameDay(new Date(mission.dueDate), day));
          return (
            <div
              key={day.toISOString()}
              className={`p-2 border rounded-lg ${
                isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-100'
              } min-h-[100px]`}
            >
              <div className={`font-semibold mb-1 ${
                isSameMonth(day, currentDate) ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayMissions.map(mission => (
                  <div
                    key={mission.id}
                    className={`p-1 rounded text-xs truncate ${getUrgencyColor(mission.urgency)} border-l-4`}
                    title={mission.title}
                  >
                    {mission.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;