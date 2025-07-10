import React from 'react';
import { HomeIcon, FolderIcon, CalendarIcon, MegaphoneIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, key: 'dashboard' },
  { name: 'Resources', icon: FolderIcon, key: 'resources' },
  { name: 'Schedule', icon: CalendarIcon, key: 'schedule' },
  { name: 'Posts', icon: MegaphoneIcon, key: 'posts' },
  { name: 'Profile', icon: UserCircleIcon, key: 'profile' },
];

export function SidebarOverlay({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />
  );
}

export default function Sidebar({ activeSection, onSectionChange, mobileOpen = false, onCloseMobile }) {
  return (
    <aside
      className={`fixed left-0 bottom-0 top-0 w-64 z-40 bg-gradient-to-b from-primary-100 via-accent-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 shadow-2xl flex flex-col border-r border-primary-200 dark:border-neutral-800 transition-transform duration-200
        sm:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ minHeight: '100vh', boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
    >
      <div className="flex flex-col items-center md:items-start py-8 px-2 md:px-6 gap-8 h-full">
        <div className="hidden md:block text-2xl font-bold text-primary-700 mb-8 tracking-tight">SCHub</div>
        <nav className="flex flex-col gap-2 w-full">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer transition-all font-semibold text-primary-700 dark:text-primary-200 ${activeSection === item.key ? 'bg-primary-200/80 dark:bg-primary-900 text-primary-900 dark:text-primary-100' : 'hover:bg-accent-100 dark:hover:bg-neutral-800'}`}
              onClick={() => {
                onSectionChange(item.key);
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <item.icon className="h-6 w-6 shrink-0" />
              <span className="hidden md:inline-block">{item.name}</span>
              </button>
          ))}
      </nav>
      </div>
    </aside>
  );
} 