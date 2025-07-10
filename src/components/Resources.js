import React, { useState } from 'react';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, CalendarIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Replace the mockResources or initial resources array with only 15 resources, each for one of the following branches:
// CSE, IT, ECE, EE, ME, CE
const mockResources = [
  // 1st Year resources for each branch
  {
    branch: 'CSE',
    name: 'Introduction to Programming',
    description: 'Fundamental programming concepts for CSE 1st year students.',
    year: '1st Year',
    date: '8/1/2023',
    author: 'Prof. S. Rao',
    downloads: 900,
    size: '2.0 MB',
    url: '/group-files/Introduction_to_Programming.pdf',
    thumbnail: '💻',
  },
  {
    branch: 'IT',
    name: 'Basics of Information Technology',
    description: 'Essential IT concepts and basics for 1st year students.',
    year: '1st Year',
    date: '8/5/2023',
    author: 'Dr. M. Iyer',
    downloads: 850,
    size: '1.8 MB',
    url: '/group-files/Basics_of_Information_Technology.pdf',
    thumbnail: '🌐',
  },
  {
    branch: 'ECE',
    name: 'Basic Electronics',
    description: 'Introduction to electronics for ECE 1st year students.',
    year: '1st Year',
    date: '8/10/2023',
    author: 'Dr. R. Verma',
    downloads: 780,
    size: '2.2 MB',
    url: '/group-files/Basic_Electronics.pdf',
    thumbnail: '🔌',
  },
  {
    branch: 'EE',
    name: 'Fundamentals of Electrical Engineering',
    description: 'Core electrical engineering concepts for 1st year students.',
    year: '1st Year',
    date: '8/12/2023',
    author: 'Dr. P. Singh',
    downloads: 720,
    size: '2.1 MB',
    url: '/group-files/Fundamentals_of_Electrical_Engineering.pdf',
    thumbnail: '⚡',
  },
  {
    branch: 'ME',
    name: 'Engineering Graphics',
    description: 'Engineering drawing and graphics for ME 1st year students.',
    year: '1st Year',
    date: '8/15/2023',
    author: 'Prof. D. Thomas',
    downloads: 800,
    size: '2.5 MB',
    url: '/group-files/Engineering_Graphics.pdf',
    thumbnail: '🏭',
  },
  {
    branch: 'CE',
    name: 'Introduction to Civil Engineering',
    description: 'Overview and basics of civil engineering for 1st year students.',
    year: '1st Year',
    date: '8/18/2023',
    author: 'Prof. K. Gupta',
    downloads: 650,
    size: '1.9 MB',
    url: '/group-files/Introduction_to_Civil_Engineering.pdf',
    thumbnail: '🏗️',
  },
  {
    branch: 'CSE',
    name: 'Data Structures & Algorithms Notes',
    description: 'Comprehensive notes for CSE students covering DSA concepts and problems.',
    year: '2nd Year',
    date: '1/15/2024',
    author: 'Prof. A. Sharma',
    downloads: 1247,
    size: '2.3 MB',
    url: '/group-files/Data_Structures_Algorithms_Notes.pdf',
    thumbnail: '💻',
  },
  {
    branch: 'CSE',
    name: 'Machine Learning Project Report',
    description: 'A comprehensive project report on ML algorithms and applications for CSE.',
    year: '4th Year',
    date: '1/8/2024',
    author: 'Prof. V. Kumar',
    downloads: 1023,
    size: '3.7 MB',
    url: '/group-files/Machine_Learning_Project_Report.pdf',
    thumbnail: '🤖',
  },
  {
    branch: 'IT',
    name: 'Database Management Systems',
    description: 'DBMS concepts and ER diagrams for CSE and IT.',
    year: '3rd Year',
    date: '1/12/2024',
    author: 'Dr. M. Iyer',
    downloads: 3421,
    size: '2.9 MB',
    url: '/group-files/Database_Management_Systems.pdf',
    thumbnail: '🗄️',
  },
  {
    branch: 'IT',
    name: 'Web Technologies Lab Manual',
    description: 'Lab manual for web technologies and full-stack development.',
    year: '2nd Year',
    date: '2/10/2024',
    author: 'Prof. S. Rao',
    downloads: 1102,
    size: '2.1 MB',
    url: '/group-files/Web_Technologies_Lab_Manual.pdf',
    thumbnail: '🌐',
  },
  {
    branch: 'ECE',
    name: 'Digital Electronics Lab Manual',
    description: 'Lab experiments and circuit diagrams for ECE and EEE students.',
    year: '2nd Year',
    date: '1/10/2024',
    author: 'Dr. R. Verma',
    downloads: 2156,
    size: '4.1 MB',
    url: '/group-files/Digital_Electronics_Lab_Manual.pdf',
    thumbnail: '🔌',
  },
  {
    branch: 'ECE',
    name: 'VLSI Design Slides',
    description: 'Lecture slides for ECE students on VLSI design principles and practices.',
    year: '4th Year',
    date: '12/22/2023',
    author: 'Dr. S. Reddy',
    downloads: 876,
    size: '6.4 MB',
    url: '/group-files/VLSI_Design_Slides.pdf',
    thumbnail: '🖥️',
  },
  {
    branch: 'EE',
    name: 'Power Systems Analysis',
    description: 'Key concepts and solved problems for EEE students.',
    year: '3rd Year',
    date: '1/8/2024',
    author: 'Prof. S. Rao',
    downloads: 1893,
    size: '8.7 MB',
    url: '/group-files/Power_Systems_Analysis.pdf',
    thumbnail: '⚡',
  },
  {
    branch: 'EE',
    name: 'Electrical Machines Notes',
    description: 'Comprehensive notes on electrical machines for EE students.',
    year: '2nd Year',
    date: '2/5/2024',
    author: 'Dr. P. Singh',
    downloads: 1342,
    size: '5.2 MB',
    url: '/group-files/Electrical_Machines_Notes.pdf',
    thumbnail: '🔋',
  },
  {
    branch: 'ME',
    name: 'Thermodynamics Formula Sheet',
    description: 'Essential formulas and charts for ME students.',
    year: '2nd Year',
    date: '12/20/2023',
    author: 'Dr. P. Singh',
    downloads: 892,
    size: '3.2 MB',
    url: '/group-files/Thermodynamics_Formula_Sheet.pdf',
    thumbnail: '🔥',
  },
  {
    branch: 'ME',
    name: 'Fluid Mechanics Notes',
    description: 'Detailed notes on fluid mechanics for mechanical engineering.',
    year: '3rd Year',
    date: '1/18/2024',
    author: 'Prof. K. Gupta',
    downloads: 1107,
    size: '4.5 MB',
    url: '/group-files/Fluid_Mechanics_Notes.pdf',
    thumbnail: '💧',
  },
  {
    branch: 'CE',
    name: 'Structural Analysis Notes',
    description: 'Detailed notes for Civil Engineering students.',
    year: '3rd Year',
    date: '12/15/2023',
    author: 'Prof. K. Gupta',
    downloads: 567,
    size: '1.8 MB',
    url: '/group-files/Structural_Analysis_Notes.pdf',
    thumbnail: '🏗️',
  },
  {
    branch: 'CE',
    name: 'Surveying Field Manual',
    description: 'Fieldwork manual for Civil Engineering students.',
    year: '2nd Year',
    date: '11/30/2023',
    author: 'Dr. R. Mehta',
    downloads: 1567,
    size: '2.1 MB',
    url: '/group-files/Surveying_Field_Manual.pdf',
    thumbnail: '📏',
  },
  {
    branch: 'CSE',
    name: 'Operating Systems Notes',
    description: 'Comprehensive notes on OS concepts for CSE.',
    year: '3rd Year',
    date: '2/1/2024',
    author: 'Prof. A. Sharma',
    downloads: 1321,
    size: '2.8 MB',
    url: '/group-files/Operating_Systems_Notes.pdf',
    thumbnail: '🖱️',
  },
  {
    branch: 'IT',
    name: 'Computer Networks Guide',
    description: 'A guide to computer networks for IT students.',
    year: '4th Year',
    date: '1/25/2024',
    author: 'Dr. S. Banerjee',
    downloads: 998,
    size: '3.3 MB',
    url: '/group-files/Computer_Networks_Guide.pdf',
    thumbnail: '🌐',
  },
  {
    branch: 'ME',
    name: 'Manufacturing Processes Notes',
    description: 'Notes on manufacturing processes for mechanical engineering.',
    year: '4th Year',
    date: '1/30/2024',
    author: 'Prof. D. Thomas',
    downloads: 1203,
    size: '3.9 MB',
    url: '/group-files/Manufacturing_Processes_Notes.pdf',
    thumbnail: '🏭',
  },
];

function ResourceCard({ resource, onClick }) {
  return (
    <div 
      className="bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-800 p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(resource)}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{resource.thumbnail}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium">
              {resource.branch}
            </span>
          </div>
          <h3 className="font-semibold text-primary-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {resource.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {resource.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {resource.date ? new Date(resource.date).toLocaleDateString() : 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {resource.author}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ArrowDownTrayIcon className="h-3 w-3" />
                {resource.downloads ? resource.downloads.toLocaleString() : 0}
              </span>
              <span>{resource.size}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceDetailModal({ resource, open, onClose }) {
  if (!open || !resource) return null;

  const relatedResources = mockResources
    .filter(r => r.name !== resource.name && (r.branch === resource.branch))
    .slice(0, 5);

  // Dummy file for download (for demo)
  const dummyFileUrl = "data:text/plain;base64,VGhpcyBpcyBhIGRlbW8gcmVzb3VyY2UgZmlsZS4=";
  const downloadFileName = (resource.name || 'Resource').replace(/\s+/g, '_') + '.txt';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button className="absolute top-4 right-4 text-red-500 hover:text-red-700" onClick={onClose} title="Close">
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="flex items-start gap-6 mb-6">
          <div className="text-6xl">{resource.thumbnail || '📄'}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium text-sm">
                {resource.branch}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{resource.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{resource.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Uploaded: {resource.date ? new Date(resource.date).toLocaleDateString() : 'N/A'}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {resource.author}
              </span>
              <span className="flex items-center gap-1">
                <ArrowDownTrayIcon className="h-4 w-4" />
                {resource.downloads ? resource.downloads.toLocaleString() : 0} downloads
              </span>
              <span>{resource.size}</span>
            </div>
            <div className="flex gap-2">
              <a href={resource.url !== '#' ? resource.url : dummyFileUrl} download={downloadFileName} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {(resource.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedResources.map(related => (
              <div key={related.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl">{related.thumbnail || '📄'}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{related.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{related.branch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Resources() {
  const [resources] = useState(mockResources);
  const [search, setSearch] = useState('');
  const [filters] = useState({ category: 'All', year: 'All' });
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = resources.filter(resource =>
    (filters.category === 'All' || resource.branch === filters.category) &&
    (filters.year === 'All' || resource.year === filters.year) &&
    (resource.name.toLowerCase().includes(search.toLowerCase()) || 
     resource.description.toLowerCase().includes(search.toLowerCase()) ||
     resource.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-row gap-6 w-full items-start min-h-[calc(100vh-64px)]">
      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-between">
          <div className="flex-1 flex items-center gap-2 bg-neutral-50 dark:bg-gray-800 rounded-lg shadow px-3 py-2 border border-gray-100 dark:border-gray-800">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold dark:text-white">Resources ({filteredResources.length})</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredResources.length} of {resources.length} resources
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onClick={setSelectedResource}
              />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ResourceDetailModal
        resource={selectedResource}
        open={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
} 