export default function ActionButtons() {
  return (
    <div className="flex gap-4 mt-4">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">Join Group</button>
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-purple-300">Upload Notes</button>
      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-green-300">Upcoming Meetings</button>
    </div>
  );
} 