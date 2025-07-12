import Question from '../../qa/models/Question.js';
import Answer from '../../qa/models/Answer.js';
import User from '../../user/models/User.js';

class StatsService {
  async getCommunityStats() {
    try {
      // Get total questions count
      const totalQuestions = await Question.countDocuments();

      // Get total answers count
      const totalAnswers = await Answer.countDocuments();

      // Get active users (users who have activity in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeUsers = await User.countDocuments({
        $or: [
          { lastLoginAt: { $gte: thirtyDaysAgo } },
          { createdAt: { $gte: thirtyDaysAgo } }
        ]
      });

      // Get total users count
      const totalUsers = await User.countDocuments();

      // Get questions asked today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const questionsToday = await Question.countDocuments({
        createdAt: { $gte: today }
      });

      // Get answers given today
      const answersToday = await Answer.countDocuments({
        createdAt: { $gte: today }
      });

      // Format active users count (e.g., 1200 -> 1.2k)
      const formatCount = (count) => {
        if (count >= 1000) {
          return (count / 1000).toFixed(1) + 'k';
        }
        return count.toString();
      };

      return {
        totalQuestions,
        totalAnswers,
        activeUsers: formatCount(activeUsers),
        totalUsers,
        questionsToday,
        answersToday,
        stats: {
          questions: totalQuestions,
          answers: totalAnswers,
          activeUsers: formatCount(activeUsers),
          users: totalUsers
        }
      };
    } catch (error) {
      console.error('Error in getCommunityStats:', error);
      throw error;
    }
  }

  async getDashboardStats(userId) {
    try {
      // Get user's questions count
      const userQuestions = await Question.countDocuments({ author: userId });

      // Get user's answers count
      const userAnswers = await Answer.countDocuments({ author: userId });

      // Get user's total votes received
      const userQuestionsWithVotes = await Question.find({ author: userId }, 'metrics.score');
      const questionVotes = userQuestionsWithVotes.reduce((total, q) => total + (q.metrics?.score || 0), 0);

      const userAnswersWithVotes = await Answer.find({ author: userId }, 'metrics.score');
      const answerVotes = userAnswersWithVotes.reduce((total, a) => total + (a.metrics?.score || 0), 0);

      const totalVotes = questionVotes + answerVotes;

      // Get user's accepted answers count
      const acceptedAnswers = await Answer.countDocuments({ 
        author: userId, 
        isAccepted: true 
      });

      return {
        questionsAsked: userQuestions,
        answersGiven: userAnswers,
        totalVotes,
        acceptedAnswers,
        reputation: totalVotes + (acceptedAnswers * 5) // Simple reputation calculation
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }
}

export default new StatsService();
