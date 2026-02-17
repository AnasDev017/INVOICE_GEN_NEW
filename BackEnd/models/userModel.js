import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true, 
      minlength: [2, "Name must be at least 2 characters"] 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"]
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters"] 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    credits: { 
      type: Number, 
      default: 50, 
      min: [0, "Free limit cannot be negative"] 
    },
    profilePic: { 
      type: String, 
      default: "https://example.com/default-profile.png" 
    },
    verificationCode: { 
      type: String 
    },
    subscriptionPlan: { 
      type: String, 
      enum: ["free", "pro", "business"], 
      default: "free" 
    },
    clientStorage:{
      type: Number,
      default: 5,
      min: [0,"clients limit cannot be negative"]
    },
    maxCreditsLimit:{
      type: Number,
      min: 50,
      default: 50
    }
  },
  { timestamps: true }
);


const UserModel = mongoose.model("User", userSchema);
export default UserModel;
