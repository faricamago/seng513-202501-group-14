// models/User.js

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs'; 

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;  

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  followers: [{ type: String }], 
  following: [{ type: String }]  
}, { timestamps: true });


userSchema.pre('save', async function(next) {
 
  if (!this.isModified('password')) return next();

  try {
   
    const salt = await bcryptjs.genSalt(SALT_WORK_FACTOR);
    
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('User', userSchema);
