import React, { useState, useEffect, useRef } from 'react';
import Sidebar, { SidebarOverlay } from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardCard from './components/DashboardCard';
import SchedulePanel, { MiniSchedulePanel } from './components/SchedulePanel';
import Login from './components/Login';
import Resources from './components/Resources';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
// import { io } from 'socket.io-client';
import Posts from './components/Posts';

const cardClass = "bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => setIsDark((d) => !d);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async ({ email, token }) => {
    localStorage.setItem('token', token);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  // Fetch events from backend on login/app load
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/schedule`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.meetings || []);
        }
      } catch (err) {
        // handle error
      }
    };
    if (isAuthenticated) fetchEvents();
  }, [isAuthenticated]);

  // Real-time sync with Socket.IO - Disabled for performance
  // useEffect(() => {
  //   if (!isAuthenticated || !user) return;
  //   const socket = io('http://localhost:8000', { transports: ['websocket'] });
  //   socket.emit('join-user', user.id || user._id);
  //   socket.on('event-added', (event) => {
  //     setEvents(evts => evts.some(ev => ev._id === event._id) ? evts : [...evts, event]);
  //   });
  //   socket.on('event-updated', (event) => {
  //     setEvents(evts => evts.map(ev => ev._id === event._id ? event : ev));
  //   });
  //   socket.on('event-deleted', ({ _id }) => {
  //     setEvents(evts => evts.filter(ev => ev._id !== _id));
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/users/me`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Global authentication guard: Only logged-in users can access the app
  if (!isAuthenticated) {
    // Not authenticated: show only the Login page
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const todayStr = new Date().toDateString();
  const todaysEventsCount = events.filter(ev => new Date(ev.start).toDateString() === todayStr && !ev.completed).length;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar for desktop and mobile */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />
      <SidebarOverlay open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Topbar onLogout={handleLogout} user={user} onOpenSidebar={() => setSidebarOpen(true)} onToggleTheme={handleToggleTheme} isDark={isDark} />
        <main className={`flex-1 p-4 md:p-8 ml-0 sm:ml-64 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 min-h-[calc(100vh-64px)]`}>
          <div className="w-full px-2 sm:px-8">
            {activeSection === 'dashboard' && (
              <>
          <section className="lg:col-span-2 flex flex-col gap-6">
                  <div className={cardClass}>
                    <DashboardCard user={user} meetingCount={todaysEventsCount} />
                  </div>
                  <div className={cardClass}>
                    <MiniSchedulePanel events={events} />
              </div>
                  <div className={cardClass}>
                    {/* Announcements section removed */}
            </div>
          </section>
              </>
            )}
            {activeSection === 'resources' && <Resources />}
            {activeSection === 'schedule' && <SchedulePanel events={events} setEvents={setEvents} />}
            {activeSection === 'posts' && <Posts />}
            {activeSection === 'profile' && <Profile user={user} setUser={setUser} />}
            </div>
        </main>
      </div>
    </div>
  );
}

const defaultProfile = {
  name: 'Prasad Bharath',
  email: 'prasad@example.com',
  department: 'Computer Science',
  year: '2nd Year',
  role: 'Student',
  skills: ['Web Dev', 'DSA'],
  photo: '',
};
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const roles = ['Student', 'Admin', 'Mentor', 'Faculty'];
const departments = ['Computer Science', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotech', 'Aerospace'];

const Profile = ({ user, setUser }) => {
  const [profile, setProfile] = useState({ ...defaultProfile, ...user });
  const [newSkill, setNewSkill] = useState('');
  const [emailError, setEmailError] = useState('');
  const [toast, setToast] = useState(null);
  const fileInput = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
    if (name === 'email') {
      setEmailError(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? '' : 'Invalid email');
    }
  };
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfile((p) => ({ ...p, photo: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };
  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };
  const handleRemoveSkill = (skill) => {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (emailError) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToast({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setToast({ type: 'error', message: data.detail || 'Update failed.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Network error.' });
    }
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-2xl border border-primary-100 dark:border-primary-900 p-8 md:p-12">
      <h2 className="text-3xl font-bold px-2 pt-2 pb-6 text-primary-700 dark:text-primary-200">PROFILE SETTINGS</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12" onSubmit={handleSave}>
        {/* Left: Photo and personal info */}
        <div className="flex flex-col items-center md:items-start gap-8 md:gap-6 pt-2">
          <div className="relative mb-4">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg"
              />
            ) : (
              <div className="w-36 h-36 rounded-full flex items-center justify-center bg-blue-500 text-white text-6xl font-bold border-4 border-blue-200 shadow-lg select-none">
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <button
              type="button"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-blue-600 font-semibold text-xs hover:underline bg-white bg-opacity-80 px-2 py-1 rounded"
              onClick={() => fileInput.current.click()}
            >
              Change Picture
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInput}
              className="hidden"
              onChange={handlePhoto}
            />
          </div>
          <div className="w-full flex flex-col gap-4">
            <label className="font-medium text-gray-700 dark:text-gray-200">Full Name</label>
            <input name="name" value={profile.name} onChange={handleChange} className="w-full p-3 text-lg rounded border dark:bg-gray-800 dark:text-gray-100" />
            <label className="font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input name="email" value={profile.email} onChange={handleChange} className={`w-full p-3 text-lg rounded border dark:bg-gray-800 dark:text-gray-100 ${emailError ? 'border-red-500' : ''}`} />
            {emailError && <span className="text-xs text-red-500 flex items-center gap-1"><ExclamationCircleIcon className="h-4 w-4" />{emailError}</span>}
            <label className="font-medium text-gray-700 dark:text-gray-200">Role</label>
            <select name="role" value={profile.role} onChange={handleChange} className="w-full p-3 text-lg rounded border dark:bg-gray-800 dark:text-gray-100">
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        {/* Right: Academic info and skills */}
        <div className="flex flex-col gap-6 pt-2">
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">Department</label>
            <input name="department" value={profile.department} onChange={handleChange} className="w-full p-3 text-lg rounded border dark:bg-gray-800 dark:text-gray-100" list="departments" />
            <datalist id="departments">
              {departments.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">Year</label>
            <select name="year" value={profile.year} onChange={handleChange} className="w-full p-3 text-lg rounded border dark:bg-gray-800 dark:text-gray-100">
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">Skills / Interests</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {profile.skills.map((skill) => (
                <span key={skill} className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-full flex items-center gap-2 text-base">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAddSkill()) : null)}
                placeholder="Add skill"
                className="p-2 px-3 text-base rounded border dark:bg-gray-800 dark:text-gray-100 w-32"
              />
              <button type="button" onClick={handleAddSkill} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-lg font-bold">+</button>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg text-xl transition-all mt-2 flex items-center justify-center gap-2">
            Save Changes
          </button>
          {toast && (
            <div className={`mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              <CheckCircleIcon className="h-5 w-5" />
              {toast.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;
