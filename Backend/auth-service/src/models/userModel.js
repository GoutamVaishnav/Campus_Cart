import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  name: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  phone: {
    type: String,
    unique: true,
    required: true,
  },

  password_hash: String,

  college: String,

  verified: {
    type: Boolean,
    default: false,
  },

  otp: String,

  otp_expiry: Date,

  reset_token: String,

  reset_token_expiry: Date,

  refresh_token: String,

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// TTL INDEX
userSchema.index(
  { created_at: 1 },
  {
    expireAfterSeconds: 604800, // 7 days
    partialFilterExpression: { verified: false },
  },
);

export default mongoose.model("User", userSchema);
