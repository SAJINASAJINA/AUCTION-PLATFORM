import { User } from "../models/userSchema.js";
import { paymentProof } from "../models/commissionProofSchema.js";
import { commission } from "../models/commissionSchema.js";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running verify commission cron...");

    const approvedProofs = await paymentProof.find({ status: "Approved" });

    for (const proof of approvedProofs) {
      try {
        const user = await User.findById(proof.userId).select("+userName");

        if (!user) continue;

        // Check unpaid commission
        if (user.unpaidcommission >= proof.amount) {
          // Deduct commission
          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $inc: { unpaidcommission: -proof.amount } },
            { new: true },
          );

          // Mark proof as settled
          await paymentProof.findByIdAndUpdate(proof._id, {
            status: "Settled",
          });

          // Save commission history
          await commission.create({
            amount: proof.amount,
            user: user._id,
          });

          const settlementDate = new Date().toDateString();

          const subject = "Payment Verified & Commission Settled";

          const message = `Dear ${user.userName},

Your payment proof has been verified successfully.

Payment Details:
Amount Settled: Rs.${proof.amount}
Remaining Unpaid Commission: Rs.${updatedUser.unpaidcommission}
Settlement Date: ${settlementDate}

Thank you for your payment.

Regards,
PrimeBid Auction Team`;

          await sendEmail({
            email: user.email,
            subject,
            message,
          });

          console.log(`Commission settled for ${user.userName}`);
        }
      } catch (error) {
        console.log("Commission Cron Error:", error.message);
      }
    }
  });
};
