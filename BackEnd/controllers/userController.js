import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  console.log("REQ FILES:", req.files);
  console.log("REQ BODY:", req.body);
  console.log("CONTENT TYPE:", req.headers["content-type"]);
  // Check profile image
  if (!req.files || !req.files.profileImage) {
    return next(new ErrorHandler("Profile image is required.", 400));
  }

  const { profileImage } = req.files;

  // Check image format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  // Check required fields
  if (!userName || !email || !password || !phone || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  // Auctioneer payment details
  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(
        new ErrorHandler("Please provide your full bank details.", 400),
      );
    }

    if (!easypaisaAccountNumber) {
      return next(
        new ErrorHandler("Please provide your Easypaisa account number.", 400),
      );
    }

    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your PayPal email.", 400));
    }
  }

  // Check existing user
  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorHandler("Email already registered.", 400));
  }

  // Upload profile image
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_USERS",
    },
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse?.error || "Unknown Cloudinary error.",
    );

    return next(
      new ErrorHandler("Failed to upload profile image to Cloudinary.", 500),
    );
  }

  // Create user
  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,

    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },

    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },

      easypaisa: {
        easypaisaAccountNumber,
      },

      paypol: {
        paypolEmail: paypalEmail,
      },
    },
  });

  generateToken(user, "User registered successfully.", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("please fill full form."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logout successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneyspent: { $gt: 0 } })
    .select("+userName")
    .lean();

  const leaderboard = users.sort((a, b) => b.moneyspent - a.moneyspent);

  res.status(200).json({
    success: true,
    leaderboard,
  });
});
