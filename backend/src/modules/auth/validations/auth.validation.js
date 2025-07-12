import Joi from 'joi';

// User registration validation
const registerValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.alphanum': 'Username can only contain letters, numbers, and underscores',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 20 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required'
    }),
  role: Joi.string()
    .valid('user', 'admin')
    .default('user')
    .messages({
      'any.only': 'Role must be either user or admin'
    })
});

// User login validation
const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),
  rememberMe: Joi.boolean().default(false)
});

// Password reset request validation
const forgotPasswordValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    })
});

// Password reset validation
const resetPasswordValidation = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Reset token is required'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

// Change password validation
const changePasswordValidation = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

// Email verification validation
const verifyEmailValidation = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Verification token is required'
    })
});

// Resend verification email validation
const resendVerificationValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    })
});

// Profile update validation
const updateProfileValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .messages({
      'string.alphanum': 'Username can only contain letters, numbers, and underscores',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 20 characters'
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
      github: Joi.string().allow(''),
      linkedin: Joi.string().allow(''),
      twitter: Joi.string().allow('')
    })
  }),
  preferences: Joi.object({
    emailNotifications: Joi.boolean(),
    theme: Joi.string().valid('light', 'dark', 'auto'),
    language: Joi.string().valid('en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko')
  })
});

// Admin role update validation
const updateUserRoleValidation = Joi.object({
  userId: Joi.string()
    .required()
    .messages({
      'any.required': 'User ID is required'
    }),
  role: Joi.string()
    .valid('user', 'moderator', 'admin')
    .required()
    .messages({
      'any.only': 'Role must be user, moderator, or admin',
      'any.required': 'Role is required'
    })
});

// Admin user status update validation
const updateUserStatusValidation = Joi.object({
  userId: Joi.string()
    .required()
    .messages({
      'any.required': 'User ID is required'
    }),
  status: Joi.string()
    .valid('active', 'suspended', 'banned')
    .required()
    .messages({
      'any.only': 'Status must be active, suspended, or banned',
      'any.required': 'Status is required'
    }),
  reason: Joi.string()
    .max(500)
    .messages({
      'string.max': 'Reason cannot exceed 500 characters'
    })
});

// Refresh token validation
const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

// Validation middleware
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

export const validateRegister = validate(registerValidation);
export const validateLogin = validate(loginValidation);
export const validateReset = validate(resetPasswordValidation);

export {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyEmailValidation,
  resendVerificationValidation,
  updateProfileValidation,
  updateUserRoleValidation,
  updateUserStatusValidation,
  refreshTokenValidation,
  validate
};