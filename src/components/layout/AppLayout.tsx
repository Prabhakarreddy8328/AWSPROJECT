import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
