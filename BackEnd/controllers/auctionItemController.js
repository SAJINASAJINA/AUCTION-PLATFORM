import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  // Check image
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Auction item image required.", 400));
  }

  const { image } = req.files;

  // Check image format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  // Get form data
  const {
    tittle,
    description,
    category,
    condition,
    auctionType,
    startingBid,
    startTime,
    endTime,
  } = req.body;

  // Validate required fields
  if (
    !tittle ||
    !description ||
    !category ||
    !condition ||
    !auctionType ||
    startingBid === undefined ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Please provide all details.", 400));
  }

  // Validate dates
  if (new Date(startTime) < new Date()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time.",
        400,
      ),
    );
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400,
      ),
    );
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
      },
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary error:",
        cloudinaryResponse?.error || "Unknown Cloudinary error",
      );

      return next(
        new ErrorHandler("Failed to upload auction image to Cloudinary.", 500),
      );
    }

    // Create auction
    const auction = await Auction.create({
      tittle,
      description,
      category,
      condition,
      auctionType,
      startingBid,
      currentBid: auctionType === "Reverse" ? Number(startingBid) : 0,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: `Auction item created and will be listed on auction page at ${startTime}`,
      auctionItem: auction,
    });
  } catch (error) {
    console.error("Create auction error:", error);

    return next(
      new ErrorHandler(error.message || "Failed to create auction.", 500),
    );
  }
});

export const getAllItems = catchAsyncErrors(async (req, res, next) => {
  let items = await Auction.find();
  res.status(200).json({
    success: true,
    items,
  });
});
export const getMyAuctionItems = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const items = await Auction.find({ createdBy: req.user._id });
  res.status(200).json({
    success: true,
    items,
  });
});
export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }

  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  const bidders = [...auctionItem.bids].sort((a, b) => b.amount - a.amount);

  res.status(200).json({
    success: true,
    auctionItem,
    bidders,
  });
});
export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }

  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  await auctionItem.deleteOne();

  await Bid.deleteMany({
    auctionItem: auctionItem._id,
  });

  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});
export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Validate auction ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }

  // Find auction
  let auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }

  // Check start and end time
  if (!req.body.startTime || !req.body.endTime) {
    return next(
      new ErrorHandler(
        "Start time and end time for republish are mandatory.",
        400,
      ),
    );
  }

  const newStartTime = new Date(req.body.startTime);
  const newEndTime = new Date(req.body.endTime);

  // Check valid dates
  if (isNaN(newStartTime.getTime()) || isNaN(newEndTime.getTime())) {
    return next(new ErrorHandler("Invalid start time or end time.", 400));
  }

  // Start time must be future
  if (newStartTime <= new Date()) {
    return next(
      new ErrorHandler(
        "Auction starting time must be greater than present time.",
        400,
      ),
    );
  }

  // Start must be before end
  if (newStartTime >= newEndTime) {
    return next(
      new ErrorHandler(
        "Auction starting time must be less than ending time.",
        400,
      ),
    );
  }

  // Auction must already be ended
  if (new Date(auctionItem.endTime) > new Date()) {
    return next(
      new ErrorHandler("Auction is already active, cannot republish.", 400),
    );
  }

  // If there was a highest bidder, reset their winning details
  if (auctionItem.highestBidder) {
    const highestBidder = await User.findById(auctionItem.highestBidder);

    if (highestBidder) {
      highestBidder.moneyspent = Math.max(
        0,
        highestBidder.moneyspent - auctionItem.currentBid,
      );

      highestBidder.auctionswon = Math.max(0, highestBidder.auctionswon - 1);

      await highestBidder.save();
    }
  }

  // Reset auction details
  auctionItem.startTime = req.body.startTime;
  auctionItem.endTime = req.body.endTime;
  auctionItem.bids = [];
  auctionItem.commisionCalculated = false;
  auctionItem.currentBid = 0;
  auctionItem.highestBidder = null;

  await auctionItem.save();

  // Delete old Bid documents
  await Bid.deleteMany({
    auctionItem: auctionItem._id,
  });

  // Reset auctioneer's unpaid commission
  const createdBy = await User.findByIdAndUpdate(
    req.user._id,
    {
      unpaidcommission: 0,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    auctionItem,
    message: `Auction republished and will be active on ${req.body.startTime}`,
    createdBy,
  });
});
