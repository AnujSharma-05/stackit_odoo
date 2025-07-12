import Answer from '../models/Answer.js';
import Question from '../models/Question.js';

class AnswerService {
  async getAnswersByQuestion(questionId) {
    const answers = await Answer.find({ question: questionId, status: 'active' })
      .populate('author', 'username reputation')
      .sort({ isAccepted: -1, 'metrics.score': -1 });

    return answers;
  }

  async createAnswer(answerData, authorId) {
    const answer = new Answer({
      ...answerData,
      author: authorId
    });

    await answer.save();

    // Update question answer count
    await Question.findByIdAndUpdate(answerData.question, {
      $inc: { 'metrics.answerCount': 1 }
    });

    return await Answer.findById(answer._id).populate('author', 'username reputation');
  }

  async updateAnswer(id, updateData, userId) {
    const answer = await Answer.findById(id);

    if (!answer) {
      throw new Error('Answer not found');
    }

    if (answer.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this answer');
    }

    Object.assign(answer, updateData);
    await answer.save();

    return await Answer.findById(id).populate('author', 'username reputation');
  }

  async deleteAnswer(id, userId) {
    const answer = await Answer.findById(id);

    if (!answer) {
      throw new Error('Answer not found');
    }

    if (answer.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this answer');
    }

    answer.status = 'deleted';
    await answer.save();

    // Update question answer count
    await Question.findByIdAndUpdate(answer.question, {
      $inc: { 'metrics.answerCount': -1 }
    });
  }

  async acceptAnswer(answerId, userId) {
    const answer = await Answer.findById(answerId).populate('question');

    if (!answer) {
      throw new Error('Answer not found');
    }

    if (answer.question.author.toString() !== userId.toString()) {
      throw new Error('Only question author can accept answers');
    }

    // Unaccept previous accepted answer
    await Answer.updateMany(
      { question: answer.question._id },
      { isAccepted: false, acceptedAt: null }
    );

    // Accept this answer
    answer.isAccepted = true;
    answer.acceptedAt = new Date();
    await answer.save();

    // Update question accepted answer
    await Question.findByIdAndUpdate(answer.question._id, {
      acceptedAnswer: answerId
    });

    return { message: 'Answer accepted successfully' };
  }
}

export default AnswerService;