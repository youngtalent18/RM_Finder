import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        unique: true,
        minLength: 10,
        maxLength: 10
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },

    profileImage: {
        type: String,
        default: null
    },

    // 🔐 EMAIL VERIFICATION
    isVerified: {
      type: Boolean,
      default: false,
    },

    isStudentVerified: {
      type: Boolean,
      default: false,
    },

    verifyToken: String,
    verifyTokenExpire: Date,

    // 🔑 PASSWORD RESET
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    accountStatus: {
        type: String,
        enum: ["active", "suspended", "banned"],
        default: "active"
    },

    lastLogin: {
        type: Date,
        default: null
    }
  },
  { timestamps: true }
);

// 🔐 HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error("Error hashing password");
  }
});

// 🔑 COMPARE PASSWORD
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
