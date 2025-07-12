import QuestionService from '../services/question.service.js';
const questionService = new QuestionService();

const getQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getQuestions(req.query);
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const question = await questionService.getQuestionById(req.params.id);
    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const question = await questionService.createQuestion(req.body, req.user._id);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const question = await questionService.updateQuestion(req.params.id, req.body, req.user._id);
    res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await questionService.deleteQuestion(req.params.id, req.user._id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export default {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};