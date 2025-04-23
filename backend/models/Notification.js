// models/Notification.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: {                
    type: String,
    required: true,
    index: true
  },
  postId: {              
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  postTitle: { 
    type: String, required: true 
  },

  type: {                
    type: String,
    enum: ['reported','approved','deleted'],
    required: true
  },
  message: {             
    type: String,
    required: true
  },
  read: {                
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
