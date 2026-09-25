import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { Errormiddlewares } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutrs.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRoutes from "./router/superAdminRouter.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

const app = express();
config({
  path: "./Config/config.env",
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auction Platform Backend is running",
  });
});
const allowedOrigins = [
  "https://auction-platform-sajina.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  }),
);

app.use("/api/v1/user", userRouter);

app.get("/api/v1/auctionitem/test", (req, res) => {
  res.json({
    success: true,
    message: "Auction item route is working",
  });
});
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRoutes);

endedAuctionCron();
verifyCommissionCron();
connection();
app.use(Errormiddlewares);

export default app;
