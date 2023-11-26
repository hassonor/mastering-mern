import Joi, { ObjectSchema } from 'joi';

const basicInfoSchema: ObjectSchema = Joi.object({
    quote: Joi.string().trim().allow('').optional(),
    work: Joi.string().trim().allow('').optional(),
    school: Joi.string().trim().allow('').optional(),
    location: Joi.string().trim().allow('').optional()
});

const socialLinksSchema: ObjectSchema = Joi.object({
    facebook: Joi.string().uri().allow('').optional(),
    instagram: Joi.string().uri().allow('').optional(),
    twitter: Joi.string().uri().allow('').optional(),
    youtube: Joi.string().uri().allow('').optional()
});

const changePasswordSchema: ObjectSchema = Joi.object({
    currentPassword: Joi.string().required().min(8).max(20).messages({
        'string.base': 'Password should be a type of string',
        'string.min': 'Password must have a minimum length of 8 characters',
        'string.max': 'Password should have a maximum length of 20 characters',
        'string.empty': 'Current password is a required field'
    }),
    newPassword: Joi.string().required().min(8).max(20).messages({
        'string.base': 'Password should be a type of string',
        'string.min': 'Password must have a minimum length of 8 characters',
        'string.max': 'Password should have a maximum length of 20 characters',
        'string.empty': 'New password is a required field'
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
        'any.only': 'Confirm password must match the new password'
    })
});

const notificationSettingsSchema: ObjectSchema = Joi.object({
    messages: Joi.boolean().default(false).optional(),
    reactions: Joi.boolean().default(false).optional(),
    comments: Joi.boolean().default(false).optional(),
    follows: Joi.boolean().default(false).optional()
});

export { basicInfoSchema, socialLinksSchema, changePasswordSchema, notificationSettingsSchema };
