import mongoose from 'mongoose';
import Question from '../src/modules/qa/models/Question.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harshal2005js:harshal.mongo123@cluster1.go4uro0.mongodb.net/stackit_db';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit length
};

const fixSlugs = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all questions with null or missing slugs
    const questionsWithoutSlugs = await Question.find({
      $or: [
        { slug: null },
        { slug: { $exists: false } },
        { slug: '' }
      ]
    });

    console.log(`Found ${questionsWithoutSlugs.length} questions without slugs`);

    // Update each question with a proper slug
    for (const question of questionsWithoutSlugs) {
      const baseSlug = generateSlug(question.title);
      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness
      while (await Question.findOne({ slug, _id: { $ne: question._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      question.slug = slug;
      await question.save();
      console.log(`Updated question "${question.title}" with slug: ${slug}`);
    }

    console.log('All questions updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing slugs:', error);
    process.exit(1);
  }
};

fixSlugs();
