import React, { useEffect, useState } from 'react';

const Profile = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
        setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        year: user.year || '',
        preferences: user.preferences || { emailNotifications: true, pushNotifications: true, theme: 'light' }
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchLatestUser = async () => {
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
    fetchLatestUser();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setForm(f => ({ ...f, preferences: { ...f.preferences, [prefKey]: value } }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePrefToggle = (key) => {
    setForm(f => ({ ...f, preferences: { ...f.preferences, [key]: !f.preferences[key] } }));
  };

  const handleThemeChange = async (theme) => {
    setForm(f => ({ ...f, preferences: { ...f.preferences, theme } }));
    await saveProfile(form);
  };

  const fetchLatestUser = async () => {
    const token = localStorage.getItem('token');
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

  const saveProfile = async (profileData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      await fetchLatestUser();
    } catch (err) {
      setError('Could not update profile.');
    }
    setLoading(false);
  };

  const handleSave = async e => {
    e.preventDefault();
    await saveProfile(form);
  };

  if (!user) return <div style={{ padding: 32 }}>No user data found.</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#2563eb' }}>Profile</h2>
      {success && <div style={{ color: '#22c55e', marginBottom: 16 }}>{success}</div>}
      {editMode ? (
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16 }}>
            <b>Name:</b> <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Email:</b> <input name="email" value={form.email} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Phone:</b> <input name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Department:</b> <input name="department" value={form.department} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Year:</b> <input name="year" value={form.year} onChange={handleChange} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <b>Preferences:</b>
            <div style={{ marginTop: 8 }}>
              <label>
                <input type="checkbox" checked={form.preferences.emailNotifications} onChange={() => handlePrefToggle('emailNotifications')} /> Email Notifications
              </label>
              <br />
              <label>
                <input type="checkbox" checked={form.preferences.pushNotifications} onChange={() => handlePrefToggle('pushNotifications')} /> Push Notifications
              </label>
              <br />
              <label>
                Theme:
                <select value={form.preferences.theme} onChange={e => handleThemeChange(e.target.value)} style={{ marginLeft: 8 }}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
          </div>
          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, width: '100%', marginBottom: 8 }} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => setEditMode(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, width: '100%' }}>Cancel</button>
        </form>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}><b>Name:</b> {user.name}</div>
          <div style={{ marginBottom: 16 }}><b>Email:</b> {user.email}</div>
          <div style={{ marginBottom: 16 }}><b>Phone:</b> {user.phone}</div>
          <div style={{ marginBottom: 16 }}><b>Department:</b> {user.department}</div>
          <div style={{ marginBottom: 16 }}><b>Year:</b> {user.year}</div>
          <div style={{ marginBottom: 16 }}><b>Preferences:</b>
            <div style={{ marginTop: 8 }}>
              <span>Email Notifications: {user.preferences?.emailNotifications ? 'On' : 'Off'}</span><br />
              <span>Push Notifications: {user.preferences?.pushNotifications ? 'On' : 'Off'}</span><br />
              <span>Theme: {user.preferences?.theme || 'light'}</span>
            </div>
          </div>
          <button onClick={() => setEditMode(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, width: '100%' }}>Edit Profile</button>
        </>
      )}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </div>
  );
};

export default Profile; 