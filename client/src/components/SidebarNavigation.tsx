import React, { useState } from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  d: string;
}

const Icon: React.FC<IconProps> = ({ d, ...props }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d={d} />
  </svg>
);

interface NavigationItem {
  name: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Kanban', icon: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" },
  { name: 'Gantt', icon: "M8 7v15m8-15v15M3 7h18M3 11h18M3 15h18M3 19h18" },
  { name: 'Calendar', icon: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18" },
  { name: 'Dashboard', icon: "M3 3h18v18H3zM3 9h18M9 21V9" },
  { name: 'List', icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
];

interface SidebarNavigationProps {
  onPageChange: (pageName: string) => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ onPageChange }) => {
  const [activePage, setActivePage] = useState<string>('Kanban');

  const handlePageChange = (pageName: string) => {
    setActivePage(pageName);
    onPageChange(pageName);
  };

  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 text-white w-16 flex flex-col items-center py-4">
        <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" className="w-8 h-8 mb-8" />
        {navigationItems.map((item) => (
          <button
            key={item.name}
            className={`w-full py-3 flex justify-center items-center relative ${
              activePage === item.name ? 'text-blue-500' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => handlePageChange(item.name)}
          >
            {activePage === item.name && (
              <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-md"></div>
            )}
            <Icon d={item.icon} className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SidebarNavigation;