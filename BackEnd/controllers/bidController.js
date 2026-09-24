import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction item not found.", 404));
  }

  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 400));
  }
  if (auctionItem.auctionType === "Sealed") {
    if (
      auctionItem.bids.some(
        (bid) => bid.userId.toString() === req.user._id.toString(),
      )
    ) {
      return next(
        new ErrorHandler("You have already submitted a sealed bid.", 400),
      );
    }
  }

  if (auctionItem.auctionType === "Reverse") {
    if (amount >= auctionItem.currentBid) {
      return next(
        new ErrorHandler(
          "Reverse auction bid must be lower than the current bid.",
          400,
        ),
      );
    }

    if (amount <= 0) {
      return next(new ErrorHandler("Bid amount must be greater than 0.", 400));
    }
  } else {
    if (amount <= auctionItem.currentBid) {
      return next(
        new ErrorHandler(
          "Bid amount must be greater than the current bid.",
          400,
        ),
      );
    }

    if (amount < auctionItem.startingBid) {
      return next(
        new ErrorHandler("Bid amount must be greater than starting bid.", 400),
      );
    }
  }

  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than starting bid.", 400),
    );
  }

  try {
    // Find the previous highest bidder before updating the bid
    const previousHighestBid = await Bid.findOne({
      auctionItem: auctionItem._id,
      "bidder.id": { $ne: req.user._id },
    }).sort({ amount: -1 });

    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });

    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() === req.user._id.toString(),
    );

    const bidderDetail = await User.findById(req.user._id);

    if (existingBid && existingBidInAuction) {
      // Update existing bid
      existingBid.amount = amount;
      await existingBid.save();

      existingBidInAuction.amount = amount;
    } else {
      // Create new bid
      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });

      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount,
      });
    }

    // Update current highest bid
    auctionItem.currentBid = amount;

    await auctionItem.save();

    // Send outbid email to previous highest bidder
    if (
      previousHighestBid &&
      previousHighestBid.bidder.id.toString() !== req.user._id.toString()
    ) {
      const outbidUser = await User.findById(previousHighestBid.bidder.id);

      if (outbidUser) {
        const subject = `You have been outbid on ${auctionItem.tittle}`;

        const message = `Dear User,

You have been outbid on the auction item "${auctionItem.tittle}".

The new highest bid is Rs.${amount}.

If you want to continue participating, please place a higher bid.

Thank you for participating in our auction.

Best regards,
Sajina Auction Team.`;

        console.log("SENDING OUTBID EMAIL TO:", outbidUser.email);

        await sendEmail({
          email: outbidUser.email,
          subject,
          message,
        });

        console.log("OUTBID EMAIL SENT SUCCESSFULLY");
      }
    }

    res.status(201).json({
      success: true,
      message: "Bid placed.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});
