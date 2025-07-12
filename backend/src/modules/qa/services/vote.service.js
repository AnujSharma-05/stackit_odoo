import Vote from '../models/Vote.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

class VoteService {
  async vote(voteData, userId) {
    const { target, targetType, voteType } = voteData;

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: userId,
      target,
      targetType
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        throw new Error('You have already voted');
      }
      
      // Update existing vote
      existingVote.voteType = voteType;
      await existingVote.save();
    } else {
      // Create new vote
      const vote = new Vote({
        user: userId,
        target,
        targetType,
        voteType
      });
      await vote.save();
    }

    // Update target metrics
    await this.updateTargetMetrics(target, targetType);

    return { message: 'Vote recorded successfully' };
  }

  async removeVote(targetId, targetType, userId) {
    const vote = await Vote.findOneAndDelete({
      user: userId,
      target: targetId,
      targetType
    });

    if (!vote) {
      throw new Error('Vote not found');
    }

    // Update target metrics
    await this.updateTargetMetrics(targetId, targetType);

    return { message: 'Vote removed successfully' };
  }

  async updateTargetMetrics(targetId, targetType) {
    const upvotes = await Vote.countDocuments({
      target: targetId,
      targetType,
      voteType: 'upvote'
    });

    const downvotes = await Vote.countDocuments({
      target: targetId,
      targetType,
      voteType: 'downvote'
    });

    const score = upvotes - downvotes;

    const Model = targetType === 'Question' ? Question : Answer;
    await Model.findByIdAndUpdate(targetId, {
      'metrics.upvotes': upvotes,
      'metrics.downvotes': downvotes,
      'metrics.score': score
    });
  }
}

export default VoteService;