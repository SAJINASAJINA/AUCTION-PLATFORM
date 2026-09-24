import express from "express";

import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

import {
  deleteAuctionItem,
  deletePaymentProof,
  fetchAllUsers,
  getAllPaymentProof,
  getPaymentProofDetail,
  monthlyRevenue,
  updateProofStatus,
} from "../controllers/superAdminController.js";

const router = express.Router();

router.delete(
  "/auctionitem/delete/:id",
  isAuthenticated,
  isAuthorized("super admin"),
  deleteAuctionItem,
);

router.get(
  "/paymentproofs/getall",
  isAuthenticated,
  isAuthorized("super admin"),
  getAllPaymentProof,
);

router.get(
  "/paymentproof/:id",
  isAuthenticated,
  isAuthorized("super admin"),
  getPaymentProofDetail,
);

router.put(
  "/paymentproof/delete/:id",
  isAuthenticated,
  isAuthorized("super admin"),
  deletePaymentProof,
);

router.get(
  "/users/getall",
  isAuthenticated,
  isAuthorized("super admin"),
  fetchAllUsers,
);

router.get(
  "/monthly-income",
  isAuthenticated,
  isAuthorized("super admin"),
  monthlyRevenue,
);

router.put(
  "/paymentproof/update/:id",
  isAuthenticated,
  isAuthorized("super admin"),
  updateProofStatus,
);

export default router;
