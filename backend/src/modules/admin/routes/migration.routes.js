import express from 'express';
import Question from '../../qa/models/Question.js';

const router = express.Router();

// Migration endpoint to fix null slugs
router.post('/fix-slugs', async (req, res) => {
  try {
    console.log('Starting slug migration...');
    
    // Find all questions with null or missing slugs
    const questionsWithoutSlugs = await Question.find({
      $or: [
        { slug: null },
        { slug: { $exists: false } },
        { slug: '' }
      ]
    });

    console.log(`Found ${questionsWithoutSlugs.length} questions without slugs`);

    const results = [];

    // Update each question with a proper slug
    for (const question of questionsWithoutSlugs) {
      const originalSlug = question.slug;
      
      // Generate slug from title
      const baseSlug = question.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .substring(0, 100); // Limit length

      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness
      while (await Question.findOne({ slug, _id: { $ne: question._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      question.slug = slug;
      await question.save();
      
      results.push({
        id: question._id,
        title: question.title,
        oldSlug: originalSlug,
        newSlug: slug
      });

      console.log(`Updated question "${question.title}" with slug: ${slug}`);
    }

    res.json({
      success: true,
      message: `Successfully updated ${results.length} questions`,
      results
    });
  } catch (error) {
    console.error('Error fixing slugs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing slugs',
      error: error.message
    });
  }
});

export default router;
