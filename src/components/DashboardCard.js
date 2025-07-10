export default function DashboardCard({ user = {}, meetingCount = 2 }) {
  const name = user?.name || 'Student';
  const photo = user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`;
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl shadow-lg p-6 flex flex-col items-start gap-3 border border-primary-100 dark:border-primary-800">
      <div className="flex items-center gap-3 mb-1">
        <img src={photo} alt="Profile" className="h-10 w-10 rounded-full border-2 border-blue-500 shadow" />
        <div>
          <h2 className="text-lg font-semibold text-primary-800 dark:text-neutral-100">
            {user?.name ? `Welcome, ${user.name}` : 'Welcome! Please complete your profile.'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.department} • {user?.year} • {user?.role}</p>
        </div>
      </div>
    </div>
  );
} 