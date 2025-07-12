import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionsAPI, tagsAPI } from '../services/api';
import RichTextEditor from '../components/Editor/RichTextEditor.jsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.jsx';
import toast from 'react-hot-toast';
import { PlusIcon, TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getTags();
      setAvailableTags(response.data.tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
    if (error.description) {
      setError(prev => ({
        ...prev,
        description: ''
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
      if (error.tags) {
        setError(prev => ({
          ...prev,
          tags: ''
        }));
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const selectSuggestedTag = (tag) => {
    if (!formData.tags.includes(tag.name) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.name]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim() || formData.content === '<p></p>') {
      newErrors.description = 'Description is required';
    } else {
      // Strip HTML tags for length check
      const textContent = formData.content.replace(/<[^>]*>/g, '');
      if (textContent.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await questionsAPI.createQuestion({
        title: formData.title,
        description: formData.content,
        tags: formData.tags
      });
      toast.success('Question posted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedTags = availableTags
    .filter(tag => 
      tag.name.includes(tagInput.toLowerCase()) && 
      !formData.tags.includes(tag.name)
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#1e40af_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#7c3aed_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_#0f172a_0%,_transparent_50%)]" />
      
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <PlusIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Ask a Question
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get help from the community by asking a clear, detailed question.
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  Question Title
                </label>
                <p className="text-gray-400 mb-4">
                  Be specific and imagine you're asking a question to another person.
                </p>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., How to implement JWT authentication in Node.js?"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Content Section */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  <DocumentTextIcon className="w-5 h-5 inline mr-2" />
                  Question Details
                </label>
                <p className="text-gray-400 mb-4">
                  Include all the information someone would need to answer your question.
                </p>
                <RichTextEditor
                  content={formData.content}
                  onChange={handleDescriptionChange}
                  placeholder="Describe your problem in detail. Include what you've tried and what you expected to happen..."
                  minHeight="200px"
                />
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  <TagIcon className="w-5 h-5 inline mr-2" />
                  Tags
                </label>
                <p className="text-gray-400 mb-4">
                  Add up to 5 tags to describe what your question is about.
                </p>
                
                {/* Tag Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Enter a tag..."
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim() || formData.tags.length >= 5}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Posting Question...
                    </>
                  ) : (
                    'Post Question'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg font-medium transition-colors border border-gray-600/50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gray-900/40 border border-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">💡 Tips for a Great Question</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Make your title specific and descriptive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Include relevant code snippets or error messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Explain what you've already tried</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Use tags to help others find your question</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;
