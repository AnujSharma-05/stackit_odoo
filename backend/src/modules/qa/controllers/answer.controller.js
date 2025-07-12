import AnswerService from '../services/answer.service.js';
const answerService = new AnswerService();

const getAnswersByQuestion = async (req, res, next) => {
  try {
    const answers = await answerService.getAnswersByQuestion(req.params.questionId);
    res.status(200).json(answers);
  } catch (err) {
    next(err);
  }
};

const createAnswer = async (req, res, next) => {
  try {
    const answer = await answerService.createAnswer(req.body, req.user._id);
    res.status(201).json(answer);
  } catch (err) {
    next(err);
  }
};

const updateAnswer = async (req, res, next) => {
  try {
    const answer = await answerService.updateAnswer(req.params.id, req.body, req.user._id);
    res.status(200).json(answer);
  } catch (err) {
    next(err);
  }
};

const deleteAnswer = async (req, res, next) => {
  try {
    await answerService.deleteAnswer(req.params.id, req.user._id);
    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const acceptAnswer = async (req, res, next) => {
  try {
    const result = await answerService.acceptAnswer(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  getAnswersByQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer
};