import Tag from '../models/Tag.js';

class TagService {
  async findOrCreateTags(tagNames) {
    const tagIds = [];
    
    for (const tagName of tagNames) {
      let tag = await Tag.findOne({ name: tagName.toLowerCase() });
      
      if (!tag) {
        tag = new Tag({
          name: tagName.toLowerCase(),
          slug: tagName.toLowerCase().replace(/\s+/g, '-')
        });
        await tag.save();
      }
      
      tagIds.push(tag._id);
    }
    
    return tagIds;
  }

  async getTags(query = {}) {
    const { page = 1, limit = 20, sort = '-metrics.questionCount' } = query;
    const skip = (page - 1) * limit;

    const tags = await Tag.find({ status: 'active' })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Tag.countDocuments({ status: 'active' });

    return {
      tags,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getTagById(id) {
    const tag = await Tag.findById(id);
    
    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  }
}

export default TagService;