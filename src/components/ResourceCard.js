import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function ResourceCard({ filename, description }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition hover:shadow-xl">
      <DocumentTextIcon className="h-8 w-8 text-green-500" />
      <div>
        <div className="font-semibold text-gray-800 dark:text-gray-100">{filename}</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">{description}</div>
      </div>
    </div>
  );
} 