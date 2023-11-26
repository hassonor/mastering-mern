import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
    username: Joi.string().required().min(4).max(20).messages({
        'string.base': 'Username must be of type string',
        'string.min': 'Invalid username',
        'string.max': 'Invalid username',
        'string.empty': 'Username is a required field'
    }),
    password: Joi.string().required().min(8).max(20).messages({
        'string.base': 'Password should be a type of string',
        'string.min': 'Password must have a minimum length of 8 characters',
        'string.max': 'Password should have a maximum length of 20 characters',
        'string.empty': 'Password is a required field'
    }),
});

export { loginSchema };
