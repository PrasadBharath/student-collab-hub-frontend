import React, { useState } from 'react';

const CATEGORY_COLORS = {
  work: '#2563eb',      // blue
  personal: '#22c55e', // green
  college: '#eab308',  // yellow
};
const CATEGORY_LABELS = {
  work: 'Work',
  personal: 'Personal',
  college: 'College',
};

// Example usage: <CustomCalendar events={events} />
export default function CustomCalendar({ events = [], onAddEvent }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [showModal, setShowModal] = useState(false);
  const [modalEvent, setModalEvent] = useState({ title: '', category: 'work' });
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, events: [] });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Format date as YYYY-MM-DD
  const fmt = d => d.toISOString().slice(0, 10);
  const todayKey = fmt(today);

  // Events by day (array of events)
  const eventsByDay = {};
  events.forEach(ev => {
    const key = fmt(new Date(ev.start));
    if (!eventsByDay[key]) eventsByDay[key] = [];
    eventsByDay[key].push(ev);
  });

  // Handlers
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };
  const handleMonthSelect = e => setMonth(Number(e.target.value));
  const handleDaySelect = d => setSelectedDate(new Date(year, month, d));

  // Modal logic
  const openModal = () => {
    setModalEvent({ title: '', category: 'work' });
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleModalChange = e => {
    const { name, value } = e.target;
    setModalEvent(ev => ({ ...ev, [name]: value }));
  };
  const handleModalSubmit = e => {
    e.preventDefault();
    if (!modalEvent.title.trim()) return;
    if (onAddEvent) {
      const eventDate = new Date(year, month, selectedDate.getDate());
      onAddEvent({
        title: modalEvent.title.trim(),
        start: eventDate,
        end: eventDate,
        type: 'custom',
        category: modalEvent.category,
      });
    }
    setShowModal(false);
  };

  // Tooltip logic
  const showTooltip = (ev, dayEvents) => {
    setTooltip({
      show: true,
      x: ev.clientX,
      y: ev.clientY,
      events: dayEvents,
    });
  };
  const hideTooltip = () => setTooltip({ show: false, x: 0, y: 0, events: [] });

  // Calendar grid logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Adjust so Monday is first (0=Mon, 6=Sun)
  const firstDayIdx = (firstDay + 6) % 7;
  const weeks = [];
  let day = 1 - firstDayIdx;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day < 1 || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day);
      }
    }
    weeks.push(week);
    if (day > daysInMonth) break;
  }

  // Format pretty date
  const prettyDay = new Date(year, month, selectedDate.getDate()).toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
  const prettyMonthDay = new Date(year, month, selectedDate.getDate()).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }).toUpperCase();

  return (
    <div className="calendar custom-calendar-dark align-card">
      <div className="col leftCol">
        <div className="content">
          <h1 className="date">
            {prettyDay}
            <span>{prettyMonthDay}</span>
          </h1>
          <button
            className="add-event-btn"
            onClick={openModal}
            style={{ marginTop: 12, width: '100%', fontSize: '1rem', fontWeight: 600 }}
          >
            Add Event
          </button>
        </div>
      </div>
      <div className="col rightCol">
        <div className="content">
          <div className="calendar-header">
            <button className="month-arrow" onClick={handlePrevMonth}>&lt;</button>
            <select className="month-select" value={month} onChange={handleMonthSelect}>
              {months.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <span className="calendar-year">{year}</span>
            <button className="month-arrow" onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {weekDays.map(wd => (
                <div key={wd} className="calendar-weekday">{wd}</div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div className="calendar-week" key={wi}>
                {week.map((d, di) => {
                  if (!d) return <div className="calendar-day empty" key={di}></div>;
                  const dateObj = new Date(year, month, d);
                  const key = fmt(dateObj);
                  const isSelected = d === selectedDate.getDate() && year === selectedDate.getFullYear() && month === selectedDate.getMonth();
                  const isToday = key === todayKey;
                  const dayEvents = eventsByDay[key] || [];
                  return (
                    <div
                      className={
                        'calendar-day' +
                        (isSelected ? ' selected' : '') +
                        (isToday ? ' today' : '')
                      }
                      key={di}
                      style={dayEvents.length ? { borderColor: CATEGORY_COLORS[dayEvents[0].category] } : {}}
                      onClick={() => handleDaySelect(d)}
                      onMouseEnter={dayEvents.length ? (ev) => showTooltip(ev, dayEvents) : undefined}
                      onMouseLeave={hideTooltip}
                    >
                      <span>{d}</span>
                      <div className="event-dots">
                        {dayEvents.slice(0, 3).map((ev, idx) => (
                          <span
                            key={idx}
                            className="event-dot"
                            style={{ background: CATEGORY_COLORS[ev.category] }}
                            title={ev.title}
                          ></span>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="event-dot event-dot-more">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="clearfix"></div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 18 }}>Add Event</h2>
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Event Name</label>
                <input
                  type="text"
                  name="title"
                  value={modalEvent.title}
                  onChange={handleModalChange}
                  className="event-input"
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Category</label>
                <select
                  name="category"
                  value={modalEvent.category}
                  onChange={handleModalChange}
                  className="event-input"
                  style={{ color: CATEGORY_COLORS[modalEvent.category], fontWeight: 600 }}
                >
                  {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                    <option key={cat} value={cat} style={{ color: CATEGORY_COLORS[cat] }}>{label}</option>
                  ))}
                </select>
                <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 8, background: CATEGORY_COLORS[modalEvent.category], marginLeft: 8, verticalAlign: 'middle' }}></span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={closeModal} className="modal-cancel-btn">Cancel</button>
                <button type="submit" className="add-event-btn">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {tooltip.show && (
        <div
          className="calendar-tooltip"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Events:</div>
          {tooltip.events.map((ev, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: CATEGORY_COLORS[ev.category], display: 'inline-block' }}></span>
              <span style={{ color: '#fff' }}>{ev.title}</span>
              <span style={{ color: CATEGORY_COLORS[ev.category], fontSize: 12, marginLeft: 4 }}>{CATEGORY_LABELS[ev.category]}</span>
            </div>
          ))}
        </div>
      )}
      <style>{`
      .calendar-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .month-arrow {
        background: #23304a;
        color: #60a5fa;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
      .month-arrow:hover {
        background: #2563eb;
        color: #fff;
      }
      .month-select {
        background: #181f2a;
        color: #60a5fa;
        border: 1px solid #23304a;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        padding: 6px 16px;
        outline: none;
        margin: 0 0.5rem;
      }
      .calendar-year {
        color: #60a5fa;
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0 0.5rem;
      }
      .calendar-grid {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .calendar-weekdays {
        display: flex;
        width: 100%;
        margin-bottom: 0.25rem;
      }
      .calendar-weekday {
        flex: 1 1 0;
        text-align: center;
        color: #94a3b8;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 1px;
        padding-bottom: 0.25rem;
      }
      .calendar-week {
        display: flex;
        width: 100%;
        gap: 0.25rem;
      }
      .calendar-day {
        flex: 1 1 0;
        aspect-ratio: 1 / 1;
        background: #232b3a;
        color: #fff;
        border-radius: 8px;
        margin: 0 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        border: 2px solid transparent;
        position: relative;
        transition: background 0.2s, color 0.2s, border 0.2s;
      }
      .calendar-day.selected {
        background: #2563eb;
        color: #fff;
        border: 2px solid #60a5fa;
      }
      .calendar-day.today {
        border: 2px solid #22d3ee;
        color: #22d3ee;
      }
      .calendar-day:hover {
        background: #23304a;
        color: #60a5fa;
      }
      .calendar-day.empty {
        background: transparent;
        border: none;
        cursor: default;
      }
      .event-dots {
        display: flex;
        gap: 2px;
        justify-content: center;
        margin-top: 2px;
      }
      .event-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 4px #0006;
        border: 2px solid #181f2a;
        display: inline-block;
      }
      .event-dot.event-dot-more {
        background: #374151;
        color: #fff;
        font-size: 0.85em;
        width: auto;
        height: 18px;
        min-width: 18px;
        border-radius: 9px;
        padding: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        margin-left: 2px;
      }
      .modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.45);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-card {
        background: #232b3a;
        color: #fff;
        border-radius: 1rem;
        box-shadow: 0 8px 32px #0008;
        padding: 2.5rem 2rem 2rem 2rem;
        min-width: 320px;
        max-width: 95vw;
      }
      .modal-cancel-btn {
        background: #374151;
        color: #fff;
        border: none;
        border-radius: 999px;
        padding: 8px 20px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
      .modal-cancel-btn:hover {
        background: #1e293b;
        color: #fff;
      }
      .align-card .add-event-btn {
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 999px;
        padding: 8px 20px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px #2563eb22;
        transition: background 0.2s, color 0.2s;
        margin-left: 0;
      }
      .align-card .add-event-btn:hover {
        background: #174ea6;
        color: #fff;
      }
      .align-card .event-input {
        background: #23304a;
        color: #fff;
        border: none;
        width: 100%;
        border-bottom: 1.5px solid #2563eb;
        font-size: 1rem;
        padding: 6px 0;
        border-radius: 0;
        outline: none;
        transition: border 0.2s;
      }
      .align-card .event-input:focus {
        border-bottom: 2px solid #60a5fa;
      }
      .align-card.calendar.custom-calendar-dark {
        width: 100%;
        max-width: 900px;
        min-width: 320px;
        height: auto;
        margin: 0;
        left: unset;
        top: unset;
        margin-left: 0;
        margin-top: 0;
        border-radius: 1.25rem;
        box-shadow: 0 4px 32px #0004;
        border: 1px solid #23304a;
        display: flex;
        flex-direction: row;
        overflow: hidden;
      }
      .align-card .col.leftCol {
        width: 38%;
        min-width: 220px;
        background: #23304a;
        color: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border-top-left-radius: 1.25rem;
        border-bottom-left-radius: 1.25rem;
        box-shadow: 2px 0 16px #0002;
      }
      .align-card .col.rightCol {
        width: 62%;
        background: #181f2a;
        color: #fff;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-top-right-radius: 1.25rem;
        border-bottom-right-radius: 1.25rem;
      }
      .align-card .col .content {
        padding: 2.5rem 2rem 2rem 2rem;
        flex: 1 1 auto;
      }
      .align-card .leftCol h1 {
        color: #fff;
        font-size: 2rem;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 2.5rem;
        letter-spacing: 1px;
        line-height: 1.1;
      }
      .align-card .leftCol h1 span {
        display: block;
        font-size: 1.1rem;
        margin-top: 0.5rem;
        letter-spacing: 1px;
        font-weight: 400;
      }
      .align-card .year-nav {
        margin-bottom: 1.5rem;
      }
      .align-card .year-arrow {
        background: #23304a;
        color: #60a5fa;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
      .align-card .year-arrow:hover {
        background: #2563eb;
        color: #fff;
      }
      .align-card .year-input {
        background: transparent;
        color: #60a5fa;
        border: none;
        font-size: 1.2rem;
        font-weight: 600;
        outline: none;
        width: 70px;
        text-align: center;
      }
      .align-card .months-scroll {
        overflow-x: auto;
        margin-bottom: 1.5rem;
      }
      .align-card .months {
        display: flex;
        gap: 12px;
        min-width: 600px;
      }
      .align-card .months li a {
        font-size: 1em;
        color: #60a5fa;
        text-align: center;
        width: 60px;
        margin-bottom: 0;
        display: block;
        border-radius: 999px;
        font-weight: 500;
        padding: 6px 0;
        transition: color 0.2s, background 0.2s;
      }
      .align-card .months li a.selected {
        font-weight: bold;
        color: #fff;
        background: #2563eb;
      }
      .align-card .weekday li a {
        width: 44px;
        text-align: center;
        margin-bottom: 20px;
        font-size: 1em;
        color: #94a3b8;
        font-weight: 500;
        display: block;
      }
      .align-card .days li {
        width: 44px;
      }
      .align-card .days li a {
        width: 32px;
        height: 32px;
        text-align: center;
        margin: auto auto;
        font-size: 1em;
        font-weight: bold;
        border-radius: 8px;
        margin-bottom: 8px;
        padding-top: 6px;
        color: #fff;
        display: block;
        transition: background 0.2s, color 0.2s, border 0.2s;
        border: 2px solid transparent;
      }
      .align-card .days li a.selected {
        background: #2563eb !important;
        color: #fff !important;
        border: 2px solid #60a5fa;
      }
      .align-card .days li a.today {
        border: 2px solid #22d3ee;
        color: #22d3ee;
      }
      .align-card .days li a.event {
        color: #38bdf8;
        border: 2px solid #38bdf8;
      }
      .align-card .days li a.selected.event {
        background: #38bdf8 !important;
        color: #181f2a !important;
        border: 2px solid #38bdf8;
      }
      .align-card .days li a:hover {
        background: #23304a;
        color: #60a5fa;
      }
      .calendar-tooltip {
        position: fixed;
        z-index: 2000;
        background: #232b3a;
        color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 16px #0008;
        padding: 12px 16px;
        font-size: 0.98rem;
        pointer-events: none;
        min-width: 120px;
        max-width: 260px;
      }
      @media (max-width: 900px) {
        .align-card.calendar.custom-calendar-dark {
          flex-direction: column;
          max-width: 100vw;
          border-radius: 0.75rem;
        }
        .align-card .col.leftCol, .align-card .col.rightCol {
          width: 100%;
          min-width: 0;
          border-radius: 0;
        }
        .align-card .col .content {
          padding: 1.25rem 1rem 1rem 1rem;
        }
        .align-card .months {
          min-width: 0;
        }
      }
      `}</style>
    </div>
  );
} 