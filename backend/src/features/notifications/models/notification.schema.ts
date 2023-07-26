import {INotificationDocument, INotification} from '@notification/interfaces/notification.interface';
import mongoose, {model, Model, Schema} from 'mongoose';

const notificationSchema: Schema = new Schema({
    userTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true},
    userFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    read: {type: Boolean, default: false},
    message: {type: String, default: ''},
    notificationType: String,
    entityId: mongoose.Types.ObjectId,
    createdItemId: mongoose.Types.ObjectId,
    comment: {type: String, default: ''},
    reaction: {type: String, default: ''},
    post: {type: String, default: ''},
    imgId: {type: String, default: ''},
    imgVersion: {type: String, default: ''},
    gifUrl: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now()}
});


const NotificationModel: Model<INotificationDocument> = model<INotificationDocument>('Notification', notificationSchema, 'Notification');
export {NotificationModel};