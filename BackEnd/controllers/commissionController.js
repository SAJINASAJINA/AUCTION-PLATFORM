import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { paymentProof } from "../models/commissionProofSchema.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const calculateCommission = async (auctionId) => {
  if (!mongoose.Types.ObjectId.isValid(auctionId)) {
    throw new Error("Invalid auction Id format.");
  }

  const auction = await Auction.findById(auctionId);

  if (!auction) {
    throw new Error("Auction not found.");
  }

  const commissionRate = 0.05;
  const commission = auction.currentBid * commissionRate;

  return commission;
};

export const proofOfCommission = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("paymentProof screenshot required.", 400));
  }
  const { proof } = req.files;
  const { amount, comment } = req.body;
  const user = await User.findById(req.user._id);
  if (!amount || !comment) {
    return next(new ErrorHandler("Amount & comment are required fields.", 400));
  }
  if (user.unpaidcommission === 0) {
    return res.status(200).json({
      success: true,
      message: "you don't have any unpaid commission.",
    });
  }
  if (user.unpaidcommission < amount) {
    return next(
      new ErrorHandler(
        `The amount exceeds your unpaid commission balance.Please enter an amount up to ${user.unpaidcommission}`,
        403,
      ),
    );
  }
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(proof.mimetype)) {
    return next(new ErrorHandler("ScreenShot format not supported.", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    proof.tempFilePath,
    {
      folder: "MERN_AUCTION_PAYMENT_PROOFS",
    },
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "cloudinary error:",
      cloudinaryResponse.error || "unknown cloudinary Error.",
    );
    return next(new ErrorHandler("Failed to upload paymentProof.", 500));
  }
  const commissionProof = await paymentProof.create({
    userId: req.user._id,
    proof: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    amount,
    comment,
  });
  res.status(201).json({
    success: true,
    message:
      "Your proof has been submitted successfully. we will review it and responed to you within 24 hours.",
  });
});
