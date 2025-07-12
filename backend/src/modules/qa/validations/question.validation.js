import Joi from 'joi';

const questionValidation = Joi.object({
  title: Joi.string()
    .min(10)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 10 characters',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .min(20)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Description must be at least 20 characters',
      'string.max': 'Description cannot exceed 10000 characters',
      'any.required': 'Description is required'
    }),
  tags: Joi.array()
    .items(Joi.string())
    .min(1)
    .max(5)
    .required()
    .messages({
      'array.min': 'At least 1 tag is required',
      'array.max': 'Maximum 5 tags allowed',
      'any.required': 'Tags are required'
    }),
  difficulty: Joi.string()
    .valid('beginner', 'intermediate', 'advanced')
    .default('intermediate')
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.validatedData = value;
    next();
  };
};

export const validateQuestion = validate(questionValidation);
export { questionValidation, validate };