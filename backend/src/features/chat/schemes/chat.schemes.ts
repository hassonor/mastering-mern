import Joi, { ObjectSchema } from 'joi';

const addChatSchema: ObjectSchema = Joi.object().keys({
    conversationId: Joi.string().optional().allow(null, ''),
    receiverId: Joi.string().required().messages({
        'any.required': 'Receiver Id is required'
    }),
    receiverUsername: Joi.string().required().messages({
        'any.required': 'Receiver Username is required'
    }),
    receiverAvatarColor: Joi.string().required().messages({
        'any.required': 'Receiver Avatar Color is required'
    }),
    receiverProfilePicture: Joi.string().required().messages({
        'any.required': 'Receiver Profile Picture is required'
    }),
    body: Joi.string().optional().allow(null, ''),
    gifUrl: Joi.string().optional().allow(null, ''),
    selectedImage: Joi.string().optional().allow(null, ''),
    isRead: Joi.boolean().optional()
});

const markChatSchema: ObjectSchema = Joi.object().keys({
    senderId: Joi.string().required().messages({
        'any.required': 'Sender Id is required'
    }),
    receiverId: Joi.string().required().messages({
        'any.required': 'Receiver Id is required'
    })
});

export { addChatSchema, markChatSchema };
