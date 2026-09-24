import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

export const trackCommissionStatus = catchAsyncErrors((req, res, next) => {
    const user = awaitUser.findById(
        req.user._id);
    if (User.unpaidcommission > 0) {
        return next(new ErrorHandler("you have unpaid commission.Pleasepay them before posting a new auction.", 403));

    };
    next();
    
});