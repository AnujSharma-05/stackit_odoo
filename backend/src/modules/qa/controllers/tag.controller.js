import TagService from '../services/tag.service.js';
const tagService = new TagService();

const getTags = async (req, res, next) => {
  try {
    const tags = await tagService.getTags(req.query);
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};

const getTagById = async (req, res, next) => {
  try {
    const tag = await tagService.getTagById(req.params.id);
    res.status(200).json(tag);
  } catch (err) {
    next(err);
  }
};

export default {
  getTags,
  getTagById
};