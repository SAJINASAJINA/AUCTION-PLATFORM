import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    select: false,
    minLength: [3, "userName must contain at least 3 characters."],
    maxLength: [40, "userName cannot exceed 40 characters."],
  },
  password: {
    type: String,
    select: false,
    minLength: [8, "password must contain at least 8 characters."],
  },
  email: String,
  address: String,
  phone: {
    type: String,
    minLength: [11, "phoneNumber must contain exact 11 digits."],
    maxLength: [11, "phoneNumber must contain exact 11 digits."],
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    easypaisa: {
      easypaisaAccountNumber: Number,
    },
    paypol: {
      paypolEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "super admin"],
  },
  unpaidcommission: {
    type: Number,
    default: 0,
  },
  auctionswon: {
    type: Number,
    default: 0,
  },
  moneyspent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 6);

  next();
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateJsonwebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
