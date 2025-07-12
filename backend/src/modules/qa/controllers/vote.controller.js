import VoteService from '../services/vote.service.js';
const voteService = new VoteService();

const vote = async (req, res, next) => {
  try {
    const result = await voteService.vote(req.body, req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const removeVote = async (req, res, next) => {
  try {
    const result = await voteService.removeVote(req.params.targetId, req.params.targetType, req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  vote,
  removeVote
};