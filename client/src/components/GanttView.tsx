import React, { useState, useMemo, useCallback } from 'react';
import { format, addDays, eachDayOfInterval, differenceInDays, isToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isSameMonth, isSameQuarter, isSameYear } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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

interface GanttViewProps {
  missions: Mission[];
  onUpdateMission: (id: string, updates: Partial<Mission>) => void;
}

type ScaleType = 'day' | 'week' | 'month' | 'quarter' | 'year';

const GanttView: React.FC<GanttViewProps> = ({ missions, onUpdateMission }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [scale, setScale] = useState<ScaleType>('week');
  const [draggingMission, setDraggingMission] = useState<string | null>(null);
  const [resizingMission, setResizingMission] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);

  const getScaleInfo = useCallback((scale: ScaleType, date: Date) => {
    switch (scale) {
      case 'day':
        return { start: startOfWeek(date), end: endOfWeek(date), format: 'dd' };
      case 'week':
        return { start: startOfWeek(date), end: addDays(endOfWeek(date), 21), format: 'MM/dd' };
      case 'month':
        return { start: startOfMonth(date), end: addDays(endOfMonth(date), 60), format: 'MM/yyyy' };
      case 'quarter':
        return { start: startOfQuarter(date), end: addDays(endOfQuarter(date), 90), format: 'QQ yyyy' };
      case 'year':
        return { start: startOfYear(date), end: endOfYear(date), format: 'yyyy' };
    }
  }, []);

  const { start, end, format: dateFormat } = getScaleInfo(scale, startDate);

  const dates = useMemo(() => {
    return eachDayOfInterval({ start, end });
  }, [start, end]);

  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
  }, [missions]);

  const getPositionAndWidth = useCallback((mission: Mission) => {
    const missionStart = new Date(mission.createdDate);
    const missionEnd = addDays(missionStart, mission.timeNeed);
    const startOffset = Math.max(0, differenceInDays(missionStart, start));
    const width = Math.min(dates.length - startOffset, differenceInDays(missionEnd, missionStart));
    return { 
      left: `${(startOffset / dates.length) * 100}%`, 
      width: `${(width / dates.length) * 100}%`
    };
  }, [dates, start]);

  const handleDragStart = (e: React.MouseEvent, missionId: string) => {
    setDraggingMission(missionId);
    setDragStartX(e.clientX);
  };

  const handleResizeStart = (e: React.MouseEvent, missionId: string) => {
    e.stopPropagation();
    setResizingMission(missionId);
    setDragStartX(e.clientX);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (draggingMission) {
      const dragDelta = e.clientX - dragStartX;
      const dayWidth = e.currentTarget.clientWidth / dates.length;
      const daysDelta = Math.round(dragDelta / dayWidth);

      if (daysDelta !== 0) {
        const mission = missions.find(m => m.id === draggingMission);
        if (mission) {
          const newStartDate = addDays(new Date(mission.createdDate), daysDelta);
          onUpdateMission(draggingMission, {
            createdDate: newStartDate.toISOString(),
            dueDate: addDays(newStartDate, mission.timeNeed).toISOString(),
          });
        }
        setDragStartX(e.clientX);
      }
    } else if (resizingMission) {
      const dragDelta = e.clientX - dragStartX;
      const dayWidth = e.currentTarget.clientWidth / dates.length;
      const daysDelta = Math.round(dragDelta / dayWidth);

      if (daysDelta !== 0) {
        const mission = missions.find(m => m.id === resizingMission);
        if (mission) {
          const newTimeNeed = Math.max(1, mission.timeNeed + daysDelta);
          onUpdateMission(resizingMission, {
            timeNeed: newTimeNeed,
            dueDate: addDays(new Date(mission.createdDate), newTimeNeed).toISOString(),
          });
        }
        setDragStartX(e.clientX);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggingMission(null);
    setResizingMission(null);
  };

  const moveLeft = () => {
    setStartDate(prevDate => addDays(prevDate, -7));
  };

  const moveRight = () => {
    setStartDate(prevDate => addDays(prevDate, 7));
  };

  const getUrgencyColor = (urgency: number) => {
    switch(urgency) {
      case 1: return 'bg-green-200 border-green-500';
      case 2: return 'bg-yellow-200 border-yellow-500';
      case 3: return 'bg-orange-200 border-orange-500';
      case 4: return 'bg-red-200 border-red-500';
      default: return 'bg-gray-200 border-gray-500';
    }
  };

  const getCurrentPeriodClass = useCallback((date: Date) => {
    const today = new Date();
    if (isToday(date)) return 'bg-blue-100 font-bold';
    switch(scale) {
      case 'day':
      case 'week':
        return isToday(date) ? 'bg-blue-100 font-bold' : '';
      case 'month':
        return isSameMonth(date, today) ? 'bg-blue-50' : '';
      case 'quarter':
        return isSameQuarter(date, today) ? 'bg-blue-50' : '';
      case 'year':
        return isSameYear(date, today) ? 'bg-blue-50' : '';
      default:
        return '';
    }
  }, [scale]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={moveLeft} className="p-2 rounded-full hover:bg-gray-200 mr-2">
            <FiChevronLeft size={24} />
          </button>
          <button onClick={moveRight} className="p-2 rounded-full hover:bg-gray-200">
            <FiChevronRight size={24} />
          </button>
        </div>
        <h2 className="text-2xl font-bold">
          {format(start, 'MMM d, yyyy')} - {format(end, 'MMM d, yyyy')}
        </h2>
        <div>
          {(['day', 'week', 'month', 'quarter', 'year'] as ScaleType[]).map(scaleType => (
            <button
              key={scaleType}
              onClick={() => setScale(scaleType)}
              className={`mx-1 px-2 py-1 rounded ${scale === scaleType ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex border-b">
            <div className="w-1/4 p-2 font-bold">Mission</div>
            <div className="w-3/4 flex">
              {dates.map(date => (
                <div
                  key={date.toISOString()}
                  className={`flex-1 p-2 text-center text-xs ${getCurrentPeriodClass(date)}`}
                >
                  {format(date, dateFormat)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div 
          className="relative" 
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {sortedMissions.map((mission, index) => {
            const { left, width } = getPositionAndWidth(mission);
            return (
              <div
                key={mission.id}
                className="flex border-b"
                style={{ height: '40px' }}
              >
                <div className="w-1/4 p-2 flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getUrgencyColor(mission.urgency)}`}>
                    {mission.urgency}
                  </span>
                  <span className="ml-2 truncate">{mission.title}</span>
                </div>
                <div className="w-3/4 relative">
                  <div
                    className={`absolute top-1 bottom-1 rounded ${getUrgencyColor(mission.urgency)} border cursor-move`}
                    style={{ left, width }}
                    onMouseDown={(e) => handleDragStart(e, mission.id)}
                  >
                    <div className="px-2 py-1 text-xs truncate">
                      {mission.title} ({format(new Date(mission.createdDate), 'MM/dd')}-{format(addDays(new Date(mission.createdDate), mission.timeNeed), 'MM/dd')})
                    </div>
                    <div 
                      className="absolute top-0 right-0 bottom-0 w-1 bg-gray-500 cursor-ew-resize"
                      onMouseDown={(e) => handleResizeStart(e, mission.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttView;