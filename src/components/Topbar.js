import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Topbar({ user, onLogout, onOpenSidebar, onToggleTheme, isDark }) {
  return (
    <header className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 px-4 md:px-8 py-4 shadow-md border-b border-primary-100 dark:border-neutral-800 ml-64 sm:ml-64">
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button className="sm:hidden p-2 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-400" onClick={onOpenSidebar} aria-label="Open sidebar">
          <Bars3Icon className="h-7 w-7 text-primary-700" />
        </button>
        <h1 className="text-2xl font-bold text-primary-700 dark:text-neutral-100 tracking-tight">Student Collaboration Hub</h1>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme toggle */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-primary-100 dark:hover:bg-primary-900 transition focus:outline-none focus:ring-2 focus:ring-primary-400"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-primary-700" />}
          </button>
          <span className="hidden md:inline text-xs font-medium text-neutral-500 dark:text-neutral-300 select-none">
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
        {/* User dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition">
            <img 
              src={user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`} 
              alt="User Avatar" 
              className="h-9 w-9 rounded-full border-2 border-blue-500 shadow" 
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                {user?.name ? user.name : 'Please complete your profile'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {user?.department} • {user?.year}
              </p>
            </div>
          </div>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 min-w-[220px] w-max bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 break-words">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 