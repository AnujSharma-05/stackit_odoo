import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { questionsAPI, answersAPI } from '../services/api';
import VoteButtons from '../components/UI/VoteButtons';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import AnswerForm from '../components/Questions/AnswerForm';
import AnswerComponent from '../components/Questions/AnswerComponent';
import toast from 'react-hot-toast';
import {
  EyeIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon,
  FlagIcon,
  UserCircleIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Answer form state
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    console.log('QuestionDetailPage mounted with ID:', id); // Debug log
    fetchQuestionDetails();
  }, [id]);

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching question with ID:', id); // Debug log
      const response = await questionsAPI.getQuestion(id);
      console.log('Question response:', response.data); // Debug log
      
      // Handle both old and new backend response structures
      if (response.data.question) {
        // Old backend structure: { question: {...}, answers: [...] }
        setQuestion(response.data.question);
        setAnswers(response.data.answers || []);
      } else {
        // New backend structure: returns question directly
        setQuestion(response.data);
        // Fetch answers separately for new backend
        try {
          const answersResponse = await answersAPI.getAnswersByQuestion(id);
          console.log('Answers response:', answersResponse.data); // Debug log
          setAnswers(answersResponse.data.answers || answersResponse.data || []);
        } catch (answerError) {
          console.log('No answers found or error fetching answers:', answerError);
          setAnswers([]);
        }
      }
      setError('');
    } catch (error) {
      console.error('Error fetching question:', error);
      console.error('Error response:', error.response); // Debug log
      setError(error.response?.data?.message || 'Failed to load question details');
      if (error.response?.status === 404) {
        toast.error('Question not found');
        // Don't navigate immediately, let user see the error
      } else {
        toast.error('Failed to load question');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionVote = async (voteType) => {
    if (!isAuthenticated()) {
      toast.error('Please login to vote');
      return;
    }

    try {
      console.log('Voting on question:', id, 'voteType:', voteType); // Debug log
      await questionsAPI.voteQuestion(id, voteType);
      
      // Refresh question data to get updated vote scores
      const response = await questionsAPI.getQuestion(id);
      console.log('Updated question after vote:', response.data); // Debug log
      
      if (response.data.question) {
        setQuestion(response.data.question);
      } else {
        setQuestion(response.data);
      }
      
      toast.success('Vote recorded');
    } catch (error) {
      console.error('Error voting on question:', error);
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleAnswerVote = async (answerId, voteType) => {
    if (!isAuthenticated()) {
      toast.error('Please login to vote');
      return;
    }

    try {
      console.log('Voting on answer:', answerId, 'voteType:', voteType); // Debug log
      await answersAPI.voteAnswer(answerId, voteType);
      
      // Refresh answers data to get updated vote scores
      const answersResponse = await answersAPI.getAnswersByQuestion(id);
      console.log('Updated answers after vote:', answersResponse.data); // Debug log
      setAnswers(answersResponse.data.answers || answersResponse.data || []);
      
      toast.success('Vote recorded');
    } catch (error) {
      console.error('Error voting on answer:', error);
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleSubmitAnswer = async (answerData) => {
    // Validate answerData before adding to state
    if (answerData && answerData._id) {
      setAnswers(prev => [answerData, ...prev]);
      setShowAnswerForm(false);
      toast.success('Answer submitted successfully!');
    } else {
      console.error('Invalid answer data received:', answerData);
      toast.error('Failed to add answer to the list');
      // Refresh the answers to get the latest state from server
      try {
        const answersResponse = await answersAPI.getAnswersByQuestion(id);
        setAnswers(answersResponse.data.answers || answersResponse.data || []);
      } catch (error) {
        console.error('Error refreshing answers:', error);
      }
      setShowAnswerForm(false);
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      await answersAPI.acceptAnswer(answerId);
      setAnswers(prev => prev
        .filter(answer => answer && answer._id) // Filter out invalid answers
        .map(answer => ({
          ...answer,
          isAccepted: answer._id === answerId
        }))
      );
      setQuestion(prev => ({ ...prev, acceptedAnswer: answerId }));
      toast.success('Answer accepted!');
    } catch (error) {
      console.error('Error accepting answer:', error);
      toast.error(error.response?.data?.message || 'Failed to accept answer');
    }
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getTextPreview = (html, maxLength = 150) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Question</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Question ID: {id}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchQuestionDetails}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Question Not Found</h2>
          <p className="text-gray-400 mb-4">The question you're looking for doesn't exist or has been removed.</p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Question ID: {id}</p>
            <p className="text-xs text-gray-600">
              {error ? `Error: ${error}` : 'No error message available'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  console.log('Retrying fetch for ID:', id);
                  fetchQuestionDetails();
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#1e40af_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#7c3aed_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_#0f172a_0%,_transparent_50%)]" />
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Questions
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Question */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
                <div className="flex gap-6">
                  {/* Vote Buttons */}
                  <div className="flex-shrink-0">
                    <VoteButtons
                      voteScore={question.voteScore || question.metrics?.score || 0}
                      userVote={question.userVote}
                      onVote={handleQuestionVote}
                      isOwner={user && question.author?._id === user._id}
                      disabled={!isAuthenticated()}
                      size="large"
                    />
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                      {question.title}
                    </h1>

                    {/* Question Meta */}
                    <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Asked {formatTimeAgo(question.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <EyeIcon className="w-4 h-4" />
                        {question.views || question.metrics?.views || 0} views
                      </div>
                      <div className="flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        {answers.length} answers
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="prose prose-invert max-w-none mb-6">
                      <div
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: question.description }}
                      />
                    </div>

                    {/* Tags */}
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {question.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full text-sm"
                          >
                            <TagIcon className="w-3 h-3" />
                            {typeof tag === 'string' ? tag : tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Question Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                          <ShareIcon className="w-4 h-4" />
                          Share
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                          <BookmarkIcon className="w-4 h-4" />
                          Save
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                          <FlagIcon className="w-4 h-4" />
                          Report
                        </button>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Asked by</div>
                          <Link
                            to={`/profile/${question.author?.username}`}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            {question.author?.username}
                          </Link>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answers Section */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                    </h2>
                    {isAuthenticated() && (
                      <button
                        onClick={() => setShowAnswerForm(!showAnswerForm)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                      >
                        {showAnswerForm ? 'Cancel' : 'Write Answer'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Answer Form */}
                {showAnswerForm && (
                  <AnswerForm
                    questionId={id}
                    onAnswerSubmitted={handleSubmitAnswer}
                    onCancel={() => setShowAnswerForm(false)}
                  />
                )}

                {/* Answers List */}
                <div className="divide-y divide-gray-700/50">
                  {answers.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No answers yet</p>
                      <p>Be the first to answer this question!</p>
                      {isAuthenticated() && (
                        <button
                          onClick={() => setShowAnswerForm(true)}
                          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                        >
                          Write Answer
                        </button>
                      )}
                    </div>
                  ) : (
                    answers
                      .filter(answer => answer && answer._id) // Filter out undefined/invalid answers
                      .map((answer) => (
                      <AnswerComponent
                        key={answer._id}
                        answer={answer}
                        questionAuthorId={question.author?._id}
                        onVote={handleAnswerVote}
                        onAccept={handleAcceptAnswer}
                        isQuestionOwner={user && question.author?._id === user._id}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Question Stats */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-semibold mb-4 text-white">Question Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white font-semibold">{question.views || question.metrics?.views || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Answers</span>
                    <span className="text-white font-semibold">{answers.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Score</span>
                    <span className={`font-semibold ${
                      (question.voteScore || question.metrics?.score || 0) > 0 ? 'text-green-400' : 
                      (question.voteScore || question.metrics?.score || 0) < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {question.voteScore || question.metrics?.score || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Asked</span>
                    <span className="text-white font-semibold text-sm">
                      {formatTimeAgo(question.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Questions */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-semibold mb-4 text-white">Related Questions</h3>
                <div className="space-y-3 text-sm">
                  <div className="text-gray-400">
                    No related questions found
                  </div>
                </div>
              </div>

              {/* Ask Question CTA */}
              {isAuthenticated() && (
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-md">
                  <h3 className="text-lg font-semibold mb-3 text-white">Have a Question?</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Ask the community and get help from experienced developers.
                  </p>
                  <Link
                    to="/ask"
                    className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-center transition-colors"
                  >
                    Ask Question
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
