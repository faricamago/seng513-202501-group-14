// models/Notification.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: {                // the post author’s username
    type: String,
    required: true,
    index: true
  },
  postId: {              // reference to the post
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
  read: {                // for dismissing
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
