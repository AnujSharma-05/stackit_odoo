import Joi from 'joi';

const answerValidation = Joi.object({
  content: Joi.string()
    .min(20)
    .max(15000)
    .required()
    .messages({
      'string.min': 'Answer must be at least 20 characters',
      'string.max': 'Answer cannot exceed 15000 characters',
      'any.required': 'Answer content is required'
    }),
  question: Joi.string()
    .required()
    .messages({
      'any.required': 'Question ID is required'
    })
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

export const validateAnswer = validate(answerValidation);
export { answerValidation, validate };