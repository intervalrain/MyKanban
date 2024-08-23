import React, { useState, useEffect } from 'react';
import ProjectManager from './components/ProjectManager';
import SidebarNavigation from './components/SidebarNavigation';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('Kanban');

  const handlePageChange = (page: string) => {
    setCurrentPage(page.toLowerCase());
  };

  return (
    <div className="flex h-screen">
    <SidebarNavigation onPageChange={handlePageChange} />
    <div className="flex-1 p-4">
      <ProjectManager currentView={currentPage as any}/>
    </div>
  </div>
  );
};

export default App;