import React, { useMemo } from 'react';
import { format, isPast, isFuture, addDays } from 'date-fns';
import { FiAlertCircle, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

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

interface DashboardViewProps {
  missions: Mission[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ missions }) => {
  const {
    completedMissions,
    delayedMissions,
    ongoingMissions,
    upcomingMissions,
    projectHealth
  } = useMemo(() => {
    const now = new Date();
    const completed = missions.filter(m => isPast(new Date(m.dueDate)));
    const delayed = missions.filter(m => isPast(new Date(m.dueDate)) && isPast(addDays(new Date(m.createdDate), m.timeNeed)));
    const ongoing = missions.filter(m => !isPast(new Date(m.dueDate)) && !isFuture(new Date(m.createdDate)));
    const upcoming = missions.filter(m => isFuture(new Date(m.createdDate)));

    // Calculate project health (0-100)
    const totalMissions = missions.length;
    const delayedPercentage = (delayed.length / totalMissions) * 100;
    const completedPercentage = (completed.length / totalMissions) * 100;
    const health = Math.max(0, Math.min(100, 100 - delayedPercentage + completedPercentage / 2));

    return {
      completedMissions: completed,
      delayedMissions: delayed,
      ongoingMissions: ongoing,
      upcomingMissions: upcoming,
      projectHealth: Math.round(health)
    };
  }, [missions]);


  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-500';
    if (health >= 60) return 'text-yellow-500';
    if (health >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <FiCheckCircle className="text-green-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Completed Missions</h2>
          </div>
          <p className="text-3xl font-bold">{completedMissions.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <FiAlertCircle className="text-red-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Delayed Missions</h2>
          </div>
          <p className="text-3xl font-bold">{delayedMissions.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <FiClock className="text-blue-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Ongoing Missions</h2>
          </div>
          <p className="text-3xl font-bold">{ongoingMissions.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <FiActivity className="text-purple-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Project Health</h2>
          </div>
          <p className={`text-3xl font-bold ${getHealthColor(projectHealth)}`}>{projectHealth}%</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Deadlines</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Mission</th>
                <th className="p-2 text-left">Due Date</th>
                <th className="p-2 text-left">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {upcomingMissions.slice(0, 5).map(mission => (
                <tr key={mission.id} className="border-b">
                  <td className="p-2">{mission.title}</td>
                  <td className="p-2">{format(new Date(mission.dueDate), 'MMM dd, yyyy')}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      mission.urgency === 1 ? 'bg-green-200 text-green-800' :
                      mission.urgency === 2 ? 'bg-yellow-200 text-yellow-800' :
                      mission.urgency === 3 ? 'bg-orange-200 text-orange-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {mission.urgency === 1 ? 'Low' :
                       mission.urgency === 2 ? 'Medium' :
                       mission.urgency === 3 ? 'High' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Project Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Missions by Status</h3>
            <div className="flex items-center mb-2">
              <div className="w-24 bg-gray-200 rounded-full mr-2">
                <div
                  className="bg-green-500 text-xs leading-none py-1 text-center text-white rounded-full"
                  style={{ width: `${(completedMissions.length / missions.length) * 100}%` }}
                >
                  {Math.round((completedMissions.length / missions.length) * 100)}%
                </div>
              </div>
              <span>Completed</span>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-24 bg-gray-200 rounded-full mr-2">
                <div
                  className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
                  style={{ width: `${(ongoingMissions.length / missions.length) * 100}%` }}
                >
                  {Math.round((ongoingMissions.length / missions.length) * 100)}%
                </div>
              </div>
              <span>Ongoing</span>
            </div>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full mr-2">
                <div
                  className="bg-red-500 text-xs leading-none py-1 text-center text-white rounded-full"
                  style={{ width: `${(delayedMissions.length / missions.length) * 100}%` }}
                >
                  {Math.round((delayedMissions.length / missions.length) * 100)}%
                </div>
              </div>
              <span>Delayed</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Missions by Urgency</h3>
            {[1, 2, 3, 4].map(urgency => {
              const count = missions.filter(m => m.urgency === urgency).length;
              return (
                <div key={urgency} className="flex items-center mb-2">
                  <div className="w-24 bg-gray-200 rounded-full mr-2">
                    <div
                      className={`text-xs leading-none py-1 text-center text-white rounded-full ${
                        urgency === 1 ? 'bg-green-500' :
                        urgency === 2 ? 'bg-yellow-500' :
                        urgency === 3 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(count / missions.length) * 100}%` }}
                    >
                      {Math.round((count / missions.length) * 100)}%
                    </div>
                  </div>
                  <span>
                    {urgency === 1 ? 'Low' :
                     urgency === 2 ? 'Medium' :
                     urgency === 3 ? 'High' : 'Critical'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;