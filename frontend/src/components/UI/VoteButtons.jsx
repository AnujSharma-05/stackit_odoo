import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon as ArrowUpSolid, ArrowDownIcon as ArrowDownSolid } from '@heroicons/react/24/solid';

const VoteButtons = ({ 
  voteScore, 
  userVote, 
  onVote, 
  isOwner = false, 
  disabled = false,
  showButtons = true,
  size = 'default'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    medium: 'w-9 h-9',
    large: 'w-10 h-10'
  };

  const iconSize = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const textSize = {
    small: 'text-sm',
    default: 'text-lg',
    medium: 'text-lg',
    large: 'text-xl'
  };

  if (!showButtons) {
    return (
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center ${sizeClasses[size]} text-gray-600`}>
          <ArrowUpIcon className={iconSize[size]} />
        </div>
        <span className={`font-semibold ${textSize[size]} ${voteScore > 0 ? 'text-green-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {voteScore}
        </span>
        <div className={`flex items-center justify-center ${sizeClasses[size]} text-gray-600`}>
          <ArrowDownIcon className={iconSize[size]} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Upvote Button */}
      <button
        onClick={() => !disabled && !isOwner && onVote && onVote('up')}
        disabled={disabled || isOwner}
        className={`
          flex items-center justify-center rounded-lg border-2 transition-all duration-200
          ${sizeClasses[size]}
          ${userVote === 'up' 
            ? 'border-green-500 bg-green-500/20 text-green-400' 
            : 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-400 hover:bg-green-500/10'
          }
          ${disabled || isOwner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isOwner ? "Can't vote on your own content" : "Upvote"}
      >
        {userVote === 'up' ? (
          <ArrowUpSolid className={`${iconSize[size]} text-green-400`} />
        ) : (
          <ArrowUpIcon className={iconSize[size]} />
        )}
      </button>

      {/* Vote Score */}
      <div className="flex items-center justify-center min-h-[24px]">
        <span className={`font-bold ${textSize[size]} text-center ${
          voteScore > 0 ? 'text-green-400' : 
          voteScore < 0 ? 'text-red-400' : 
          'text-gray-400'
        }`}>
          {voteScore || 0}
        </span>
      </div>

      {/* Downvote Button */}
      <button
        onClick={() => !disabled && !isOwner && onVote && onVote('down')}
        disabled={disabled || isOwner}
        className={`
          flex items-center justify-center rounded-lg border-2 transition-all duration-200
          ${sizeClasses[size]}
          ${userVote === 'down' 
            ? 'border-red-500 bg-red-500/20 text-red-400' 
            : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 hover:bg-red-500/10'
          }
          ${disabled || isOwner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isOwner ? "Can't vote on your own content" : "Downvote"}
      >
        {userVote === 'down' ? (
          <ArrowDownSolid className={`${iconSize[size]} text-red-400`} />
        ) : (
          <ArrowDownIcon className={iconSize[size]} />
        )}
      </button>
    </div>
  );
};

export default VoteButtons;
