import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { UXEnhancements } from '../components/UXEnhancements';
import { Toaster } from '../components/ui/sonner';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="size-full flex bg-gray-50">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-6 lg:p-8">
            <UXEnhancements />
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
