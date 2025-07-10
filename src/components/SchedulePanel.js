import React, { useState } from 'react';
import CustomCalendar from './CustomCalendar';
import { XMarkIcon, CheckIcon, BellIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const EVENT_COLORS = {
  work: 'bg-blue-500',
  college: 'bg-yellow-400',
  personal: 'bg-green-500',
};

function getEventColor(type) {
  return EVENT_COLORS[type] || 'bg-gray-400';
}

function normalizeEventId(ev) {
  if (ev._id && !ev.id) return { ...ev, id: ev._id };
  if (ev.id && !ev._id) return { ...ev, _id: ev.id };
  return ev;
}

function AddEventModal({ open, onClose, onAdd, onEdit, editEvent, groups }) {
  const isEdit = !!editEvent;
  const [form, setForm] = useState(() =>
    editEvent ? {
      title: editEvent.title || '',
      description: editEvent.description || '',
      start: editEvent.start ? new Date(editEvent.start).toISOString().slice(0, 16) : '',
      end: editEvent.end ? new Date(editEvent.end).toISOString().slice(0, 16) : '',
      type: editEvent.type || 'work',
      group: editEvent.group || '',
      notification: !!editEvent.notification,
    } : {
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'work',
      group: '',
      notification: false,
    }
  );
  React.useEffect(() => {
    if (editEvent) {
      setForm({
        title: editEvent.title || '',
        description: editEvent.description || '',
        start: editEvent.start ? new Date(editEvent.start).toISOString().slice(0, 16) : '',
        end: editEvent.end ? new Date(editEvent.end).toISOString().slice(0, 16) : '',
        type: editEvent.type || 'work',
        group: editEvent.group || '',
        notification: !!editEvent.notification,
      });
    } else {
      setForm({
        title: '',
        description: '',
        start: '',
        end: '',
        type: 'work',
        group: '',
        notification: false,
      });
    }
  }, [editEvent, open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-modal-in" style={{ minWidth: 340 }}>
        <button className="absolute top-5 right-5 text-red-500 hover:text-white hover:bg-red-500 transition-all rounded-full p-1.5" onClick={onClose} title="Close" style={{ fontSize: 22 }}>
          <XMarkIcon className="h-7 w-7" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300">{isEdit ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={e => {
          e.preventDefault();
          if (isEdit) {
            onEdit && onEdit(editEvent._id, form);
          } else {
            onAdd(form);
          }
          onClose();
        }} className="flex flex-col gap-4">
          <input required className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-100 text-base" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <textarea className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-100 text-base resize-none" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="flex flex-col sm:flex-row gap-3">
            <input required type="datetime-local" className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-100 text-base" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} />
            <input required type="datetime-local" className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-100 text-base" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} />
          </div>
          <select className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white text-base" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="work">Work</option>
            <option value="college">College</option>
            <option value="personal">Personal</option>
          </select>
          <input className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-gray-100 text-base" placeholder="Group (optional)" value={form.group} onChange={e => setForm(f => ({ ...f, group: e.target.value }))} />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg text-lg transition-all mt-2">{isEdit ? 'Save Changes' : 'Add Event'}</button>
        </form>
      </div>
    </div>
  );
}

export default function SchedulePanel({ events, setEvents }) {
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  // Removed unused filter state
  // const calendarRef = useRef(); // Removed unused variable

  // Filtering logic - removed unused variable
  // const filteredEvents = events.filter(ev =>
  //   (filter.type === 'all' || ev.type === filter.type) &&
  //   (!filter.group || (ev.group && ev.group.toLowerCase().includes(filter.group.toLowerCase()))) &&
  //   (!filter.date || new Date(ev.start).toDateString() === new Date(filter.date).toDateString())
  // );

  // All events for side panel
  const allEvents = events.sort((a, b) => new Date(a.start) - new Date(b.start));

  // Mark as completed
  const handleComplete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      // Find the full event object
      const event = events.find(ev => (ev._id || ev.id) === id);
      if (!event) {
        alert('Event not found!');
        return;
      }
      // Send the full event object with completed: true
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/schedule/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
          type: event.type,
          group: event.group,
          notification: event.notification,
          completed: true
        })
      });
      if (res.ok) {
        setEvents(evts => evts.map(ev => ((ev._id || ev.id) === id ? { ...ev, completed: true } : ev)));
      } else {
        alert('Failed to mark event as complete.');
      }
    } catch (err) {
      alert('Network error. Could not update event.');
    }
  };

  // Delete reminder
  const handleDelete = async (id) => {
    // Optimistically remove the event from UI
    const prevEvents = [...events];
    setEvents(evts => evts.filter(ev => (ev._id || ev.id) !== id));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/schedule/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        // Restore previous state if delete failed
        setEvents(prevEvents);
        alert('Failed to delete event.');
      }
    } catch (err) {
      setEvents(prevEvents);
      alert('Network error. Could not delete event.');
    }
  };

  // Add event
  const handleAddEvent = async (form) => {
    // If coming from CustomCalendar, adapt the object
    const isFromCalendar = !form.description && form.category;
    const eventData = isFromCalendar
      ? {
          title: form.title,
          description: "",
          start: new Date(form.start).toISOString(),
          end: new Date(form.end).toISOString(),
          type: form.category, // use category as type
          group: "",
          notification: false,
          completed: false,
        }
      : {
          title: form.title,
          description: form.description,
          start: new Date(form.start).toISOString(),
          end: new Date(form.end).toISOString(),
          type: form.type,
          group: form.group,
          notification: form.notification,
          completed: false,
        };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (res.ok && data.meeting) {
        setEvents(evts => {
          const newEvent = normalizeEventId(data.meeting);
          if (evts.some(ev => ev._id === newEvent._id || ev.id === newEvent.id)) {
            console.log('Duplicate event detected, not adding:', newEvent);
            return evts;
          }
          const newEvents = [...evts, newEvent];
          console.log('Events after add:', newEvents);
          return newEvents;
        });
      } else {
        alert(data.message || 'Failed to add event.');
      }
    } catch (err) {
      alert('Network error. Could not add event.');
    }
  };

  const handleEditEvent = async (id, form) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/schedule/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          start: new Date(form.start).toISOString(),
          end: new Date(form.end).toISOString(),
          type: form.type,
          group: form.group,
          notification: form.notification
        })
      });
      const data = await res.json();
      if (res.ok && data.meeting) {
        setEvents(evts => evts.map(ev => (ev._id === id ? normalizeEventId(data.meeting) : ev)));
      } else {
        alert(data.message || 'Failed to update event.');
      }
    } catch (err) {
      alert('Network error. Could not update event.');
    }
  };

  // Unique groups for filter dropdown
  const uniqueGroups = Array.from(new Set(events.map(ev => ev.group).filter(Boolean)));

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-6 py-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Calendar Area (left) */}
        <div className="flex-1 min-w-[320px] bg-neutral-50 dark:bg-gray-900 rounded-2xl shadow-lg p-4 border border-blue-100 dark:border-blue-900 min-w-0 flex flex-col justify-stretch">
          <CustomCalendar events={events} onAddEvent={handleAddEvent} />
        </div>
        {/* Side Panel: All Events */}
        <aside className="w-full md:max-w-[340px] flex-shrink-0 bg-neutral-50 dark:bg-gray-900 rounded-2xl shadow-lg p-4 border border-blue-100 dark:border-blue-900 h-fit animate-slide-in mt-4 md:mt-0">
          <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-3 flex items-center gap-2"><BellIcon className="h-5 w-5" />Events</h3>
          <ul className="space-y-3 overflow-x-auto">
            {allEvents.length === 0 && <li className="text-gray-500 dark:text-gray-400">No upcoming events.</li>}
            {allEvents.map(ev => (
              <li key={ev._id || ev.id} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl shadow border ${getEventColor(ev.type)} bg-opacity-10 dark:bg-opacity-20 transition-all animate-fade-in`}> 
                  <span className={`w-3 h-3 rounded-full ${getEventColor(ev.type)}`}></span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm break-words truncate max-w-[120px] sm:max-w-full">{ev.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 break-words truncate max-w-[120px] sm:max-w-full">{ev.description}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <button onClick={() => { setEditEvent(ev); setShowModal(true); }} className="ml-1 sm:ml-2 p-2 sm:p-1 rounded bg-blue-500 hover:bg-blue-600 text-white transition-all" title="Edit event"><PencilIcon className="h-5 w-5 sm:h-4 sm:w-4" /></button>
                  {!ev.completed && (
                    <button onClick={() => handleComplete(ev._id || ev.id)} className="ml-1 sm:ml-2 p-2 sm:p-1 rounded bg-green-500 hover:bg-green-600 text-white transition-all" title="Mark as completed"><CheckIcon className="h-5 w-5 sm:h-4 sm:w-4" /></button>
                  )}
                  <button onClick={() => handleDelete(ev._id || ev.id)} className="ml-1 sm:ml-2 p-2 sm:p-1 rounded bg-red-500 hover:bg-red-600 text-white transition-all" title="Delete event"><TrashIcon className="h-5 w-5 sm:h-4 sm:w-4" /></button>
                </li>
            ))}
          </ul>
        </aside>
      </div>
      {showModal && (
        <AddEventModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleAddEvent}
          onEdit={handleEditEvent}
          editEvent={editEvent}
          groups={uniqueGroups}
        />
      )}
    </div>
  );
}

export function MiniSchedulePanel({ events }) {
  // Show all events, sorted by start date
  const allEvents = (events || [])
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  return (
    <div>
      <h3 className="text-md font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0V10.5A2.25 2.25 0 0 1 5.25 8.25h13.5A2.25 2.25 0 0 1 21 10.5v8.25m-9-6h.008v.008H12v-.008z" /></svg>
        Upcoming Schedules
      </h3>
      <ul className="space-y-2">
        {allEvents.length === 0 && <li className="text-gray-500 dark:text-gray-400">No events.</li>}
        {allEvents.map(ev => (
          <li key={ev.id || ev._id} className={`flex items-center gap-3 p-2 rounded-lg border ${getEventColor(ev.type)} bg-opacity-10 dark:bg-opacity-20`}>
            <span className={`w-2 h-2 rounded-full ${getEventColor(ev.type)}`}></span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 dark:text-white text-sm truncate">{ev.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300 truncate">{ev.description}</div>
              <div className="text-xs text-gray-400 dark:text-gray-200">{new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 