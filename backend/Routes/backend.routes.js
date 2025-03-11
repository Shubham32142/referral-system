import {
  register,
  login,
  trackClicks,
  trackConversion,
  generateReferral,
  newCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
  bulkEmail,
  bulkSMS,
  getAllReferrals,
  getAllUsers,
  getDashboardStats,
  deleteUser,
  updateReferrals,
  getReferralsRewards,
  updateRewardStatus,
  getReferralStats,
  getUserReferralStats,
} from "../Controller/backend.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../Middleware/authMiddleware.js";
export function Routes(app) {
  app.post("/register", register);
  app.post("/login", login);
  app.post("/create/referral", authMiddleware, generateReferral);
  app.get("/trackClick/:referralCode", trackClicks);
  app.post("/trackConversion", trackConversion);
  app.post("/", authMiddleware, newCampaign);
  app.get("/", authMiddleware, getCampaigns);
  app.put("/:id", authMiddleware, updateCampaign);
  app.delete("/campaign/:id", authMiddleware, deleteCampaign);
  app.post("/email", authMiddleware, bulkEmail);
  app.post("/sms", authMiddleware, bulkSMS);
  app.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);
  app.get("/users", authMiddleware, adminMiddleware, getAllUsers);
  app.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
  app.get("/referrals", authMiddleware, adminMiddleware, getAllReferrals);
  app.put("/referrals/:id", authMiddleware, adminMiddleware, updateReferrals);
  app.get("/referral-stats", authMiddleware, getUserReferralStats);
  app.get(
    "/referral-rewards",
    authMiddleware,
    adminMiddleware,
    getReferralsRewards
  );
  app.put(
    "/rewardStatus/:id",
    authMiddleware,
    adminMiddleware,
    updateRewardStatus
  );
  app.get("/stats", authMiddleware, getReferralStats);
}
