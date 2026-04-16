import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
