import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark relative">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
           {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;