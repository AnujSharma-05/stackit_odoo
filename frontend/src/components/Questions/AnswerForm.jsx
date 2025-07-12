import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { answersAPI } from '../../services/api';
import RichTextEditor from '../Editor/RichTextEditor';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  XMarkIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

const AnswerForm = ({ questionId, onAnswerSubmitted, onCancel }) => {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please login to answer');
      return;
    }

    if (!content.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await answersAPI.createAnswer({
        question: questionId,
        content
      });
      
      // Backend returns answer directly in response.data, not response.data.answer
      const answerData = response.data;
      console.log('Answer response:', answerData); // Debug log
      
      if (onAnswerSubmitted && answerData) {
        onAnswerSubmitted(answerData);
      }
      
      setContent('');
      toast.success('Answer posted successfully!');
      
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error posting answer:', error);
      toast.error(error.response?.data?.message || 'Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="p-6 border-b border-gray-700/50 bg-gray-800/30 text-center">
        <div className="max-w-md mx-auto">
          <LightBulbIcon className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white mb-2">Want to Answer?</h3>
          <p className="text-gray-400 mb-4">
            Join our community to share your knowledge and help others.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-medium transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-700/50 bg-gray-800/30">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Write Your Answer</h3>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <LightBulbIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-300 font-medium mb-2">Tips for a great answer:</h4>
              <ul className="text-sm text-blue-200/80 space-y-1">
                <li>• Be clear and concise</li>
                <li>• Include code examples if relevant</li>
                <li>• Explain your reasoning</li>
                <li>• Cite sources when appropriate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Your Answer <span className="text-red-400">*</span>
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Share your knowledge! Write a comprehensive answer that helps solve the problem..."
            minHeight="200px"
          />
          <p className="text-xs text-gray-500">
            You can use markdown syntax and code blocks in your answer.
          </p>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
          <div className="text-sm text-gray-400">
            {content.trim() && (
              <span>
                {content.trim().length} characters
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="small" />
                  Posting...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Post Answer
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
