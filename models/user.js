// models/user.js
import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    clerkId:   { type: String, required: true, unique: true, index: true },
    email:     { type: String, required: true, index: true },
    name:      { type: String, required: true },
    imageUrl:  { type: String, required: true },
    cartItems: { type: Object, default: {} },
    role: { type: String, default: "Buyer" },
  },
  { timestamps: true, minimize: false }
);

// Use capitalized model name to avoid clashes
export default mongoose.models.user || mongoose.model("user", userSchema);