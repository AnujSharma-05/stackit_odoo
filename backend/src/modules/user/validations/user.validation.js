import Joi from 'joi';

export const updateProfileValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .messages({
        'string.alphanum': 'Username can only contain letters, numbers, and underscores',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 20 characters',
        }),

    email: Joi.string()
        .email()
        .messages({
        'string.email': 'Please enter a valid email address'
        }),

    profile: Joi.object({
        bio: Joi.string().max(500).allow('').messages({
        'string.max': 'Bio cannot exceed 500 characters'
        }),
        location: Joi.string().max(100).allow('').messages({
        'string.max': 'Location cannot exceed 100 characters'
        }),
        website: Joi.string().uri().allow('').messages({
        'string.uri': 'Please enter a valid website URL'
        }),
        social: Joi.object({
        github: Joi.string().uri().allow(''),
        linkedin: Joi.string().uri().allow(''),
        twitter: Joi.string().uri().allow('')
        }).optional()
    }).optional(),

    preferences: Joi.object({
        emailNotifications: Joi.boolean(),
        theme: Joi.string().valid('light', 'dark', 'auto'),
        language: Joi.string()
    }).optional()
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

export const validateUpdateProfile = validate(updateProfileValidation);
