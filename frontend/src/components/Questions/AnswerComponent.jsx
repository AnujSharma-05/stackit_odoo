import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import VoteButtons from '../UI/VoteButtons';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  FlagIcon,
  UserCircleIcon,
  StarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
} from '@heroicons/react/24/solid';

const AnswerComponent = ({ 
  answer, 
  questionAuthorId, 
  onVote, 
  onAccept, 
  onEdit, 
  onDelete,
  isQuestionOwner 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showActions, setShowActions] = useState(false);

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#answer-${answer._id}`;
    navigator.clipboard.writeText(url);
    toast.success('Answer link copied to clipboard!');
  };

  const handleReport = () => {
    toast.info('Report functionality coming soon!');
  };

  const isAuthor = user && answer.author?._id === user._id;
  const canAccept = isQuestionOwner && !answer.isAccepted;

  return (
    <div 
      id={`answer-${answer._id}`}
      className={`p-6 transition-all duration-200 ${
        answer.isAccepted 
          ? 'bg-green-900/10 border-l-4 border-l-green-500' 
          : 'hover:bg-gray-800/20'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-6">
        {/* Vote Buttons */}
        <div className="flex-shrink-0">
          <VoteButtons
            voteScore={answer.voteScore || 0}
            userVote={answer.userVote}
            onVote={(voteType) => onVote && onVote(answer._id, voteType)}
            isOwner={answer.isOwner}
            disabled={!isAuthenticated()}
            size="medium"
          />
          
          {/* Accept Answer Button */}
          {canAccept && (
            <button
              onClick={() => onAccept && onAccept(answer._id)}
              className="mt-3 p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded-lg transition-colors"
              title="Accept this answer"
            >
              <CheckCircleIcon className="w-6 h-6" />
            </button>
          )}
          
          {/* Accepted Answer Badge */}
          {answer.isAccepted && (
            <div className="mt-3 flex items-center justify-center">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-lg">
                <CheckCircleSolid className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-300 font-medium">Accepted</span>
              </div>
            </div>
          )}
        </div>

        {/* Answer Content */}
        <div className="flex-1 min-w-0">
          {/* Answer Body */}
          <div className="prose prose-invert max-w-none mb-6">
            <div
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: answer.content }}
            />
          </div>

          {/* Answer Actions */}
          <div className={`flex items-center justify-between transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-60'
          }`}>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
              >
                <ShareIcon className="w-3 h-3" />
                Share
              </button>
              
              {isAuthor && onEdit && (
                <button
                  onClick={() => onEdit(answer._id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit
                </button>
              )}
              
              {(isAuthor || user?.role === 'admin') && onDelete && (
                <button
                  onClick={() => onDelete(answer._id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                >
                  <TrashIcon className="w-3 h-3" />
                  Delete
                </button>
              )}
              
              <button
                onClick={handleReport}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded transition-colors"
              >
                <FlagIcon className="w-3 h-3" />
                Report
              </button>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">
                  {answer.isAccepted ? 'Answered' : 'answered'} {formatTimeAgo(answer.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/profile/${answer.author?.username}`}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {answer.author?.username}
                  </Link>
                  {answer.author?.role === 'admin' && (
                    <ShieldCheckIcon className="w-3 h-3 text-red-400" title="Admin" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <StarIcon className="w-3 h-3" />
                  <span>{answer.author?.reputation || 0} rep</span>
                </div>
              </div>
              
              {/* Avatar */}
              <div className="relative">
                {answer.author?.avatar ? (
                  <img
                    src={answer.author.avatar}
                    alt={answer.author.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-gray-600">
                    <UserCircleIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                
                {/* Online Status */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
            </div>
          </div>

          {/* Edit History */}
          {answer.editHistory && answer.editHistory.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-700/30">
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-400">
                  Edited {answer.editHistory.length} time{answer.editHistory.length !== 1 ? 's' : ''}
                </summary>
                <div className="mt-2 space-y-1">
                  {answer.editHistory.slice(-3).map((edit, index) => (
                    <div key={index} className="text-gray-600">
                      {formatTimeAgo(edit.editedAt)} {edit.reason && `- ${edit.reason}`}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Comments Section */}
          {answer.comments && answer.comments.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-700/30">
              <div className="space-y-2">
                {answer.comments.filter(comment => !comment.isDeleted).map((comment) => (
                  <div key={comment._id} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400">•</span>
                    <div className="flex-1">
                      <span className="text-gray-300">{comment.content}</span>
                      {' – '}
                      <Link
                        to={`/profile/${comment.author?.username}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {comment.author?.username}
                      </Link>
                      <span className="text-gray-500 ml-1">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerComponent;
