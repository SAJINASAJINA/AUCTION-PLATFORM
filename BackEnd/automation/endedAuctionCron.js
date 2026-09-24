import Cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { calculateCommission } from "../controllers/commissionController.js";
import { sendEmail } from "../utils/sendEmail.js";

export const endedAuctionCron = () => {
  Cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("Cron for ended auction running...");
    const endedAuctions = await Auction.find({
      endTime: { $lt: now },
      commisionCalculated: false,
    });
    console.log("ENDED AUCTIONS FOUND:", endedAuctions.length);
    for (const auction of endedAuctions) {
      try {
        const commissionAmount = await calculateCommission(auction._id);
        auction.commisionCalculated = true;
        let winningBid;

        if (auction.auctionType === "Reverse") {
          winningBid = await Bid.findOne({
            auctionItem: auction._id,
          }).sort({ amount: 1 });
        } else {
          winningBid = await Bid.findOne({
            auctionItem: auction._id,
          }).sort({ amount: -1 });
        }

        console.log("CURRENT BID:", auction.currentBid);
        console.log("WINNING BID:", winningBid);
        console.log("CURRENT BID:", auction.currentBid);

        const auctioneer = await User.findById(auction.createdBy);

        if (winningBid) {
          auction.highestBidder = winningBid.bidder.id;
          await auction.save();
          const bidder = await User.findById(winningBid.bidder.id).select(
            "+userName",
          );
          await User.findByIdAndUpdate(
            bidder.id,
            {
              $inc: {
                moneyspent: winningBid.amount,
                auctionswon: 1,
              },
            },

            { new: true },
          );
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidcommission: commissionAmount,
              },
            },

            { new: true },
          );
          const subject = `Congratulations! you won the auction for ${auction.tittle}`;

          const message = `Dear ${bidder.userName}, \n\n Congratulation! you have won the auction for ${auction.tittle}. \n\n Before proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\n please complete your payment using one of the following methodes: \n\n1.**Bank Transfer**:
    \n-Account Name:${auctioneer.paymentMethods.bankTransfer.bankAccountName}
    \n-AccountNumber:${auctioneer.paymentMethods.bankTransfer.bankAccountNumber}\n-Bank:${auctioneer.paymentMethods.bankTransfer.bankName}
    \n\n2.**Easypaisa**:
    \n- you can send payment via Easypaisa:${auctioneer.paymentMethods.easypaisa.easypaisaAccountNumber}
    \n\n3.**Paypal**:
    \n-Send payment to:${auctioneer.paymentMethods.paypol.paypolEmail}
    \n\n4.**Cash on Delivery (COD)**:
    \n-If you prefer COD ,you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront,use any of the above methods.
    \n- The remaining 80% will be paid upon delivery.\n-If you want to see the condition of your auction item then send your email on this:${auctioneer.email}
    \n\n Please ensure your payment is completed by [Payment Due Date].Once we confirm the payment,the item will be shipped to you.
    \n\n Thank you for participating!
    \n\n Best regards,
    \n Sajina Auction Team.`;

          console.log("SENDING EMAIL TO HIGHEST BIDDER");
          await sendEmail({ email: bidder.email, subject, message });
          console.log("SUCCESSFULLY EMAIL SEND TO HIGHEST BIDDER");
        } else {
          await auction.save();
        }
      } catch (error) {
        console.error(error || "some error in ended auction cron");
      }
    }
  });
};
