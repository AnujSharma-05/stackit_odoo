import Question from '../models/Question.js';
import TagService from './tag.service.js';

const tagService = new TagService();

class QuestionService {
  async getQuestions(query = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = query;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ status: 'active' })
      .populate('author', 'username reputation')
      .populate('tags', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments({ status: 'active' });

    return {
      questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getQuestionById(id) {
    const question = await Question.findById(id)
      .populate('author', 'username reputation profile')
      .populate('tags', 'name color');

    if (!question) {
      throw new Error('Question not found');
    }

    // Increment view count
    question.metrics.views += 1;
    await question.save();

    return question;
  }

  async createQuestion(questionData, authorId) {
    // Convert tag names to ObjectIds
    const tagIds = await tagService.findOrCreateTags(questionData.tags);
    
    const question = new Question({
      ...questionData,
      tags: tagIds,
      author: authorId
    });

    await question.save();
    return await this.getQuestionById(question._id);
  }

  async updateQuestion(id, updateData, userId) {
    const question = await Question.findById(id);

    if (!question) {
      throw new Error('Question not found');
    }

    if (question.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this question');
    }

    Object.assign(question, updateData);
    await question.save();

    return await this.getQuestionById(id);
  }

  async deleteQuestion(id, userId) {
    const question = await Question.findById(id);

    if (!question) {
      throw new Error('Question not found');
    }

    if (question.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this question');
    }

    question.status = 'deleted';
    await question.save();
  }
}

export default QuestionService;