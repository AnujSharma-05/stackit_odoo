import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlaggedQuestions();
  }, []);

  const fetchFlaggedQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/questions?flagged=true');
      setFlaggedQuestions(response.data.questions || []);
    } catch (err) {
      setError('Failed to fetch flagged questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/questions/${id}/approve`);
      setFlaggedQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      setFlaggedQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <div className="text-gray-400">Loading flagged questions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : flaggedQuestions.length === 0 ? (
          <div className="text-gray-400">No flagged questions found.</div>
        ) : (
          <div className="space-y-6">
            {flaggedQuestions.map((q) => (
              <div
                key={q._id}
                className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 backdrop-blur-md"
              >
                <div className="mb-2">
                  <h2 className="text-xl font-semibold mb-1 text-white">
                    {q.title || 'Untitled Question'}
                  </h2>
                  <p className="text-gray-300 line-clamp-3">{q.description}</p>
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleApprove(q._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-white transition-colors"
                  >
                    <CheckIcon className="w-5 h-5" /> Approve
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
