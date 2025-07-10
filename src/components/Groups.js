import React, { useState, useEffect } from 'react';
import { PlusIcon, UsersIcon, MagnifyingGlassIcon, XMarkIcon, ChatBubbleLeftRightIcon, FolderIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const mockGroups = [
  // Computer Science and Engineering
  {
    id: 1,
    name: 'AI Study Group',
    description: 'Discuss and learn about Artificial Intelligence.',
    members: 12,
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    interest: 'AI',
    tags: ['AI', 'ML', 'Python'],
    files: [{
      id: 'ai-artificial-intelligence',
      name: 'AI_ArtificialIntelligence.pdf',
      type: 'pdf',
      url: '/group-files/AI_ArtificialIntelligence.pdf',
    }],
  },
  {
    id: 2,
    name: 'Code Masters',
    description: 'Competitive programming and coding challenges.',
    members: 20,
    department: 'Computer Science and Engineering',
    year: '4th Year',
    interest: 'Coding',
    tags: ['Coding', 'DSA', 'Contests'],
    files: [{
      id: 'codemasters-ai-paper',
      name: 'CodeMasters_ComputerScienceAI.pdf',
      type: 'pdf',
      url: '/group-files/CodeMasters_ComputerScienceAI.pdf',
    }],
  },
  {
    id: 3,
    name: 'Quantum Quest',
    description: 'Quantum computing and futuristic tech.',
    members: 6,
    department: 'Computer Science and Engineering',
    year: '2nd Year',
    interest: 'Quantum',
    tags: ['Quantum', 'Physics', 'Research'],
    files: [{
      id: 'quantum-computing',
      name: 'QuantumComputing.pdf',
      type: 'pdf',
      url: '/group-files/QuantumComputing.pdf',
    }],
  },
  {
    id: 4,
    name: 'Web Wizards',
    description: 'Frontend, backend, and full-stack web development.',
    members: 18,
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    interest: 'Web',
    tags: ['React', 'Node', 'Web'],
    files: [{
      id: 'web-development',
      name: 'WebDevelopment.pdf',
      type: 'pdf',
      url: '/group-files/WebDevelopment.pdf',
    }],
  },
  {
    id: 5,
    name: 'App Dev Club',
    description: 'Mobile app development for Android and iOS.',
    members: 14,
    department: 'Computer Science and Engineering',
    year: '2nd Year',
    interest: 'Apps',
    tags: ['Android', 'iOS', 'Flutter'],
    files: [{
      id: 'mobile-app-development',
      name: 'MobileAppDevelopment.pdf',
      type: 'pdf',
      url: '/group-files/MobileAppDevelopment.pdf',
    }],
  },
  {
    id: 6,
    name: 'First Year Forum',
    description: 'Support and resources for first-year students.',
    members: 18,
    department: 'Computer Science and Engineering',
    year: '1st Year',
    interest: 'Support',
    tags: ['Freshers', 'Help', 'Resources'],
    files: [{
      id: 'first-year-cs',
      name: 'FirstYearCS.pdf',
      type: 'pdf',
      url: '/group-files/FirstYearCS.pdf',
    }],
  },
  {
    id: 7,
    name: 'Data Science Hub',
    description: 'Explore data analysis, visualization, and big data.',
    members: 16,
    department: 'Computer Science and Engineering',
    year: '4th Year',
    interest: 'Data',
    tags: ['Data', 'Analytics', 'Big Data'],
    files: [{
      id: 'data-science',
      name: 'DataScience.pdf',
      type: 'pdf',
      url: '/group-files/DataScience.pdf',
    }],
  },
  {
    id: 8,
    name: 'Cyber Security Cell',
    description: 'Learn about ethical hacking and security.',
    members: 11,
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    interest: 'Security',
    tags: ['Security', 'Hacking', 'Ethical'],
    files: [{
      id: 'cyber-security',
      name: 'CyberSecurity.pdf',
      type: 'pdf',
      url: '/group-files/CyberSecurity.pdf',
    }],
  },
  {
    id: 9,
    name: 'Open Source Society',
    description: 'Contribute to open source projects.',
    members: 13,
    department: 'Computer Science and Engineering',
    year: '2nd Year',
    interest: 'Open Source',
    tags: ['GitHub', 'OSS', 'Projects'],
    files: [{
      id: 'open-source-software',
      name: 'OpenSourceSoftware.pdf',
      type: 'pdf',
      url: '/group-files/OpenSourceSoftware.pdf',
    }],
  },
  {
    id: 10,
    name: 'Cloud Computing Club',
    description: 'Explore AWS, Azure, and cloud technologies.',
    members: 10,
    department: 'Computer Science and Engineering',
    year: '4th Year',
    interest: 'Cloud',
    tags: ['AWS', 'Azure', 'Cloud'],
    files: [{
      id: 'cloud-computing',
      name: 'CloudComputing.pdf',
      type: 'pdf',
      url: '/group-files/CloudComputing.pdf',
    }],
  },
  // Mechanical Engineering
  {
    id: 11,
    name: 'Robotics Club',
    description: 'Build and program robots together.',
    members: 8,
    department: 'Mechanical Engineering',
    year: '2nd Year',
    interest: 'Robotics',
    tags: ['Robotics', 'Arduino'],
    files: [{
      id: 'robotics',
      name: 'Robotics.pdf',
      type: 'pdf',
      url: '/group-files/Robotics.pdf',
    }],
  },
  {
    id: 12,
    name: 'Auto Innovators',
    description: 'Automobile engineering and design.',
    members: 9,
    department: 'Mechanical Engineering',
    year: '3rd Year',
    interest: 'Automobile',
    tags: ['Cars', 'Design', 'Engines'],
    files: generateFiles(12),
  },
  {
    id: 13,
    name: 'Thermo Dynamics',
    description: 'Thermodynamics and heat transfer projects.',
    members: 7,
    department: 'Mechanical Engineering',
    year: '4th Year',
    interest: 'Thermodynamics',
    tags: ['Heat', 'Thermo', 'Energy'],
    files: generateFiles(13),
  },
  {
    id: 14,
    name: 'CAD Crew',
    description: 'Computer-aided design and simulation.',
    members: 12,
    department: 'Mechanical Engineering',
    year: '2nd Year',
    interest: 'CAD',
    tags: ['CAD', 'Simulation', 'Design'],
    files: generateFiles(14),
  },
  {
    id: 15,
    name: 'Mech Masters',
    description: 'Mechanical design and manufacturing.',
    members: 15,
    department: 'Mechanical Engineering',
    year: '3rd Year',
    interest: 'Manufacturing',
    tags: ['Manufacturing', 'Design', 'CAM'],
    files: generateFiles(15),
  },
  {
    id: 16,
    name: 'Aero Dynamics',
    description: 'Aerodynamics and aerospace projects.',
    members: 10,
    department: 'Mechanical Engineering',
    year: '4th Year',
    interest: 'Aerospace',
    tags: ['Aero', 'Flight', 'Simulation'],
    files: generateFiles(16),
  },
  {
    id: 17,
    name: 'Material Minds',
    description: 'Materials science and engineering.',
    members: 8,
    department: 'Mechanical Engineering',
    year: '2nd Year',
    interest: 'Materials',
    tags: ['Materials', 'Testing', 'Research'],
    files: generateFiles(17),
  },
  {
    id: 18,
    name: 'Mechatronics Mania',
    description: 'Mechatronics and automation.',
    members: 11,
    department: 'Mechanical Engineering',
    year: '3rd Year',
    interest: 'Mechatronics',
    tags: ['Automation', 'Sensors', 'Robotics'],
    files: generateFiles(18),
  },
  {
    id: 19,
    name: 'Hydraulics Hub',
    description: 'Hydraulics and fluid mechanics.',
    members: 6,
    department: 'Mechanical Engineering',
    year: '1st Year',
    interest: 'Hydraulics',
    tags: ['Fluids', 'Hydraulics', 'Pumps'],
    files: generateFiles(19),
  },
  {
    id: 20,
    name: 'First Year Mechs',
    description: 'Support for first-year mechanical students.',
    members: 13,
    department: 'Mechanical Engineering',
    year: '1st Year',
    interest: 'Support',
    tags: ['Freshers', 'Help', 'Mech'],
    files: generateFiles(20),
  },
  // Electrical Engineering
  {
    id: 21,
    name: 'Power Up',
    description: 'Electrical machines and power systems.',
    members: 13,
    department: 'Electrical Engineering',
    year: '4th Year',
    interest: 'Power',
    tags: ['Power', 'Machines', 'Energy'],
    files: generateFiles(21),
  },
  {
    id: 22,
    name: 'Green Energy',
    description: 'Renewable energy and sustainability.',
    members: 11,
    department: 'Electrical Engineering',
    year: '1st Year',
    interest: 'Environment',
    tags: ['Solar', 'Wind', 'Eco'],
    files: generateFiles(22),
  },
  {
    id: 23,
    name: 'Circuits Central',
    description: 'Circuit analysis and design.',
    members: 10,
    department: 'Electrical Engineering',
    year: '2nd Year',
    interest: 'Circuits',
    tags: ['Circuits', 'Design', 'PCB'],
    files: generateFiles(23),
  },
  {
    id: 24,
    name: 'Signal Squad',
    description: 'Signals, systems, and communication.',
    members: 9,
    department: 'Electrical Engineering',
    year: '3rd Year',
    interest: 'Signals',
    tags: ['Signals', 'DSP', 'Comms'],
    files: generateFiles(24),
  },
  {
    id: 25,
    name: 'Embedded Engineers',
    description: 'Embedded systems and microcontrollers.',
    members: 8,
    department: 'Electrical Engineering',
    year: '2nd Year',
    interest: 'Embedded',
    tags: ['Embedded', 'MCU', 'IoT'],
    files: generateFiles(25),
  },
  {
    id: 26,
    name: 'Control Crew',
    description: 'Control systems and automation.',
    members: 12,
    department: 'Electrical Engineering',
    year: '4th Year',
    interest: 'Control',
    tags: ['Control', 'Automation', 'Systems'],
    files: generateFiles(26),
  },
  {
    id: 27,
    name: 'ElectroMagnetics',
    description: 'Electromagnetics and field theory.',
    members: 7,
    department: 'Electrical Engineering',
    year: '3rd Year',
    interest: 'EMT',
    tags: ['EMT', 'Fields', 'Waves'],
    files: generateFiles(27),
  },
  {
    id: 28,
    name: 'Smart Grids',
    description: 'Smart grid and modern power systems.',
    members: 10,
    department: 'Electrical Engineering',
    year: '4th Year',
    interest: 'Smart Grid',
    tags: ['Smart', 'Grid', 'Power'],
    files: generateFiles(28),
  },
  {
    id: 29,
    name: 'First Year Sparks',
    description: 'Support for first-year electrical students.',
    members: 14,
    department: 'Electrical Engineering',
    year: '1st Year',
    interest: 'Support',
    tags: ['Freshers', 'Help', 'EE'],
    files: generateFiles(29),
  },
  {
    id: 30,
    name: 'Energy Innovators',
    description: 'Innovations in energy and power.',
    members: 9,
    department: 'Electrical Engineering',
    year: '2nd Year',
    interest: 'Energy',
    tags: ['Energy', 'Innovation', 'Power'],
    files: generateFiles(30),
  },
  // Civil Engineering
  {
    id: 31,
    name: 'Eco Warriors',
    description: 'Environmental awareness and projects.',
    members: 15,
    department: 'Civil Engineering',
    year: '1st Year',
    interest: 'Environment',
    tags: ['Eco', 'Green', 'Projects'],
    files: generateFiles(31),
  },
  {
    id: 32,
    name: 'Bridge Builders',
    description: 'Civil engineering projects and competitions.',
    members: 7,
    department: 'Civil Engineering',
    year: '3rd Year',
    interest: 'Structures',
    tags: ['Bridges', 'Design', 'CAD'],
    files: generateFiles(32),
  },
  {
    id: 33,
    name: 'Survey Stars',
    description: 'Land surveying and mapping.',
    members: 8,
    department: 'Civil Engineering',
    year: '2nd Year',
    interest: 'Survey',
    tags: ['Survey', 'Mapping', 'GIS'],
    files: generateFiles(33),
  },
  {
    id: 34,
    name: 'Concrete Crew',
    description: 'Concrete technology and construction.',
    members: 10,
    department: 'Civil Engineering',
    year: '4th Year',
    interest: 'Concrete',
    tags: ['Concrete', 'Construction', 'Tech'],
    files: generateFiles(34),
  },
  {
    id: 35,
    name: 'Urban Planners',
    description: 'Urban planning and smart cities.',
    members: 12,
    department: 'Civil Engineering',
    year: '3rd Year',
    interest: 'Urban',
    tags: ['Urban', 'Planning', 'Smart'],
    files: generateFiles(35),
  },
  {
    id: 36,
    name: 'GeoTech Group',
    description: 'Geotechnical engineering and soil mechanics.',
    members: 9,
    department: 'Civil Engineering',
    year: '2nd Year',
    interest: 'Geotech',
    tags: ['Geo', 'Soil', 'Testing'],
    files: generateFiles(36),
  },
  {
    id: 37,
    name: 'Water Works',
    description: 'Water resources and hydraulics.',
    members: 11,
    department: 'Civil Engineering',
    year: '4th Year',
    interest: 'Water',
    tags: ['Water', 'Hydraulics', 'Resources'],
    files: generateFiles(37),
  },
  {
    id: 38,
    name: 'Transport Tribe',
    description: 'Transportation engineering and planning.',
    members: 10,
    department: 'Civil Engineering',
    year: '3rd Year',
    interest: 'Transport',
    tags: ['Transport', 'Planning', 'Roads'],
    files: generateFiles(38),
  },
  {
    id: 39,
    name: 'First Year Civils',
    description: 'Support for first-year civil students.',
    members: 13,
    department: 'Civil Engineering',
    year: '1st Year',
    interest: 'Support',
    tags: ['Freshers', 'Help', 'Civil'],
    files: generateFiles(39),
  },
  {
    id: 40,
    name: 'Sustainable Structures',
    description: 'Sustainable building and green construction.',
    members: 8,
    department: 'Civil Engineering',
    year: '2nd Year',
    interest: 'Sustainability',
    tags: ['Sustainable', 'Green', 'Building'],
    files: generateFiles(40),
  },
  // Electronics and Communication Engineering
  {
    id: 41,
    name: 'Circuit Breakers',
    description: 'Explore electronics and circuit design.',
    members: 10,
    department: 'Electronics and Communication Engineering',
    year: '2nd Year',
    interest: 'Electronics',
    tags: ['Circuits', 'PCB', 'IoT'],
    files: generateFiles(41),
  },
  {
    id: 42,
    name: 'Design Den',
    description: 'UI/UX, product, and graphic design.',
    members: 14,
    department: 'Electronics and Communication Engineering',
    year: '3rd Year',
    interest: 'Design',
    tags: ['UI/UX', 'Product', 'Graphics'],
    files: generateFiles(42),
  },
  {
    id: 43,
    name: 'Signal Processors',
    description: 'Signal processing and DSP.',
    members: 12,
    department: 'Electronics and Communication Engineering',
    year: '4th Year',
    interest: 'DSP',
    tags: ['DSP', 'Signals', 'Processing'],
    files: generateFiles(43),
  },
  {
    id: 44,
    name: 'Embedded Innovators',
    description: 'Embedded systems and microcontrollers.',
    members: 11,
    department: 'Electronics and Communication Engineering',
    year: '2nd Year',
    interest: 'Embedded',
    tags: ['Embedded', 'MCU', 'IoT'],
    files: generateFiles(44),
  },
  {
    id: 45,
    name: 'Wireless Wizards',
    description: 'Wireless communication and networks.',
    members: 13,
    department: 'Electronics and Communication Engineering',
    year: '3rd Year',
    interest: 'Wireless',
    tags: ['Wireless', 'Networks', 'Comms'],
    files: generateFiles(45),
  },
  {
    id: 46,
    name: 'NanoTech Group',
    description: 'Nanotechnology and advanced electronics.',
    members: 9,
    department: 'Electronics and Communication Engineering',
    year: '4th Year',
    interest: 'Nano',
    tags: ['Nano', 'Tech', 'Electronics'],
    files: generateFiles(46),
  },
  {
    id: 47,
    name: 'Photonics Forum',
    description: 'Photonics and optical communication.',
    members: 8,
    department: 'Electronics and Communication Engineering',
    year: '2nd Year',
    interest: 'Photonics',
    tags: ['Photonics', 'Optics', 'Light'],
    files: generateFiles(47),
  },
  {
    id: 48,
    name: 'VLSI Visionaries',
    description: 'VLSI design and chip fabrication.',
    members: 10,
    department: 'Electronics and Communication Engineering',
    year: '3rd Year',
    interest: 'VLSI',
    tags: ['VLSI', 'Chips', 'Design'],
    files: generateFiles(48),
  },
  {
    id: 49,
    name: 'First Year ECE',
    description: 'Support for first-year ECE students.',
    members: 12,
    department: 'Electronics and Communication Engineering',
    year: '1st Year',
    interest: 'Support',
    tags: ['Freshers', 'Help', 'ECE'],
    files: generateFiles(49),
  },
  {
    id: 50,
    name: 'IoT Innovators',
    description: 'Internet of Things and smart devices.',
    members: 11,
    department: 'Electronics and Communication Engineering',
    year: '4th Year',
    interest: 'IoT',
    tags: ['IoT', 'Smart', 'Devices'],
    files: generateFiles(50),
  },
];

const departments = [
  'All',
  'Computer Science and Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Electronics and Communication Engineering',
];
const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const interests = ['All', 'AI', 'Robotics', 'Environment', 'Coding', 'Design'];

function CreateGroupModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    department: '',
    year: '',
    interest: '',
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}><XMarkIcon className="h-6 w-6" /></button>
        <h2 className="text-xl font-bold mb-4 text-white dark:text-white">Create New Group</h2>
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); onCreate(form); onClose(); }}>
          <input className="rounded-lg border px-3 py-2" placeholder="Group Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <textarea className="rounded-lg border px-3 py-2" placeholder="Description" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <select className="rounded-lg border px-3 py-2" required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
            <option value="">Select Department</option>
            {departments.slice(1).map(dep => <option key={dep}>{dep}</option>)}
          </select>
          <select className="rounded-lg border px-3 py-2" required value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
            <option value="">Select Year</option>
            {years.slice(1).map(y => <option key={y}>{y}</option>)}
          </select>
          <input className="rounded-lg border px-3 py-2" placeholder="Interest/Tag" value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))} />
          <button className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition" type="submit">Create Group</button>
        </form>
      </div>
    </div>
  );
}

function generateFiles(groupId) {
  // Only generate PDF files
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${groupId}-file${i+1}`,
    name: `File_${i+1}_${groupId}.pdf`,
    type: 'pdf',
    url: `/group-files/File_${i+1}_${groupId}.pdf`,
  }));
}

function getMockChat(groupId) { return []; }

function getMockTasks(groupId) {
  const titles = [
    'Kickoff Meeting', 'Submit Proposal', 'Upload Report', 'Design Review', 'Code Sprint', 'Testing Phase', 'Documentation', 'Presentation Prep', 'Final Submission', 'Retrospective',
    'Team Sync', 'Research Topic', 'Resource Collection', 'Peer Review', 'Demo Day'
  ];
  const statuses = ['Done', 'In Progress', 'Pending'];
  const today = new Date();
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    status: statuses[i % statuses.length],
    due: new Date(today.getTime() + (i + 1) * 86400000).toISOString().slice(0, 10),
  }));
}

function getMockMembers(groupId) { return []; }

function GroupDetailModal({ group, open, onClose }) {
  const [tab, setTab] = useState('files');
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState(getMockChat(group?.id));
  const tasks = getMockTasks(group?.id);
  const members = getMockMembers(group?.id);

  useEffect(() => {
    if (open && group) {
      setChat(getMockChat(group.id));
    }
  }, [open, group]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChat(prev => ([...prev, { id: prev.length + 1, user: 'You', text: chatInput, time }]));
    setChatInput('');
  };

  if (!open || !group) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative">
        <button className="absolute top-4 right-4 text-red-500 hover:text-red-700" onClick={onClose} title="Close"><XMarkIcon className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold mb-2 text-white dark:text-white">{group.name}</h2>
        <p className="mb-4 text-white dark:text-white">{group.description}</p>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('files')} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${tab === 'files' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}><FolderIcon className="h-5 w-5" /> Files</button>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-[120px] max-h-[350px] overflow-y-auto">
          {tab === 'files' && (
            <div className="space-y-2">
              {(group.files || []).filter(file => file.type === 'pdf').map(file => (
                <div key={file.id} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg px-3 py-2 shadow border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-8 text-center text-blue-600 font-bold uppercase">PDF</span>
                    <span className="truncate max-w-[180px] text-white dark:text-white">{file.name}</span>
                  </div>
                  <a href={file.url} download={file.name.endsWith('.pdf') ? file.name : file.name + '.pdf'} className="bg-blue-600 text-white rounded px-3 py-1 text-sm font-semibold hover:bg-blue-700 transition">Download</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Groups({ user }) {
  const [showCreate, setShowCreate] = useState(false);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: 'All', year: 'All', interest: 'All' });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups`);
        if (res.ok) {
          const data = await res.json();
          setGroups((Array.isArray(data) ? data : (data.groups || [])).map(g => ({
            ...g,
            tags: g.tags || [],
            files: g.files || [],
          })));
        } else {
          setGroups(mockGroups);
        }
      } catch {
        setGroups(mockGroups);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleCreateGroup = async (g) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(g)
      });
      if (res.ok) {
        const updated = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups`);
        const data = await updated.json();
        setGroups((Array.isArray(data) ? data : (data.groups || [])).map(g => ({
          ...g,
          tags: g.tags || [],
          files: g.files || [],
        })));
      } else {
        alert('Failed to create group.');
      }
    } catch {
      alert('Failed to create group.');
    }
  };

  const filteredGroups = groups.filter(
    g =>
      (filters.department === 'All' || g.department === filters.department) &&
      (filters.year === 'All' || g.year === filters.year) &&
      (filters.interest === 'All' || g.interest === filters.interest) &&
      (g.name.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 10);

  function isMember(group) {
    if (!user || !group || !group.members) return false;
    // Support both array of user ids or array of member objects
    return group.members.some(m => (typeof m === 'string' ? m === user.email : (m.user === user.email || m.user === user._id)));
  }

  async function joinGroup(group) {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');
    console.log('About to send join request for group:', group);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups/${group._id || group.id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Join group response:', res);
      if (res.ok) {
        // Refetch groups to update membership
        const updated = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups`);
        const data = await updated.json();
        setGroups((Array.isArray(data) ? data : (data.groups || [])).map(g => ({ ...g, tags: g.tags || [], files: g.files || [] })));
      } else {
        alert('Failed to join group.');
      }
    } catch (err) {
      console.error('Join group error:', err);
      alert('Failed to join group.');
    }
  }

  async function leaveGroup(group) {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups/${group._id || group.id}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/groups`);
        const data = await updated.json();
        setGroups((Array.isArray(data) ? data : (data.groups || [])).map(g => ({ ...g, tags: g.tags || [], files: g.files || [] })));
      } else {
        alert('Failed to leave group.');
      }
    } catch {
      alert('Failed to leave group.');
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading groups...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-start">
      <aside className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-4 h-fit sticky top-4 self-start">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Filters</h3>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-100">Department</label>
          <select className="w-full rounded-lg border px-2 py-1" value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}>
            {departments.map(dep => <option key={dep}>{dep}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-100">Year</label>
          <select className="w-full rounded-lg border px-2 py-1" value={filters.year} onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}>
            {years.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-100">Interest</label>
          <select className="w-full rounded-lg border px-2 py-1" value={filters.interest} onChange={e => setFilters(f => ({ ...f, interest: e.target.value }))}>
            {interests.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
      </aside>
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-between">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg shadow px-3 py-2 border border-gray-100 dark:border-gray-800">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              className="flex-1 bg-transparent outline-none text-base"
              placeholder="Search groups..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 shadow hover:bg-blue-700 transition"
            onClick={() => setShowCreate(true)}
          >
            <PlusIcon className="h-5 w-5" /> Create Group
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredGroups.map(group => (
            <div key={group.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-2 hover:scale-[1.025] hover:shadow-2xl transition cursor-pointer min-h-[170px]" onClick={() => setSelectedGroup(group)}>
              <div className="flex items-center gap-2 mb-1">
                <UsersIcon className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold dark:text-white">{group.name}</span>
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-1 line-clamp-2">{group.description}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {group.tags.map(tag => <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{tag}</span>)}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-300 flex-wrap">
                <span>{group.member_count || 0} members</span>
                <span>• {group.department}</span>
                <span>• {group.year}</span>
              </div>
            </div>
          ))}
          {filteredGroups.length === 0 && <div className="col-span-full text-center text-gray-400 py-12">No groups found.</div>}
        </div>
      </main>
      <CreateGroupModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreateGroup} />
      <GroupDetailModal group={selectedGroup} open={!!selectedGroup} onClose={() => setSelectedGroup(null)} />
    </div>
  );
} 