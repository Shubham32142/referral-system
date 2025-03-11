import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Referral, Campaign } from "../Model/backend.model.js";
import crypto from "crypto";
import { sendEmail, sendSMS } from "../Services/messageService.js";
export async function register(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    //check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exists" });
    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password is incorrect" });
    //generated jwt token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Generate Referral Link
export async function generateReferral(req, res) {
  try {
    const { businessId } = req.body;
    const referrerId = req.user.id;

    // Generate unique referral code
    const referralCode = crypto.randomBytes(5).toString("hex");

    // Save to DB
    const referral = new Referral({ businessId, referrerId, referralCode });
    await referral.save();

    res
      .status(201)
      .json({ referralLink: `http://localhost:3000/referral/${referralCode}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Track Clicks
export async function trackClicks(req, res) {
  try {
    const { referralCode } = req.params;
    const referral = await Referral.findOne({ referralCode });

    if (!referral)
      return res.status(404).json({ message: "Referral not found" });

    referral.clicks += 1;
    await referral.save();

    res.status(200).json({ message: "Click tracked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Track Conversion
export async function trackConversion(req, res) {
  try {
    const { referralCode } = req.body;
    const referral = await Referral.findOne({ referralCode });

    if (!referral)
      return res.status(404).json({ message: "Referral not found" });

    referral.conversions += 1;
    referral.rewardStatus = "approved";
    await referral.save();

    res.status(200).json({ message: "Conversion recorded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// create a new campaign

export async function newCampaign(req, res) {
  try {
    const { title, description, reward } = req.body;
    const businessId = req.user.id;
    const campaign = new Campaign({ businessId, title, description, reward });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//get all campaigns

export async function getCampaigns(req, res) {
  try {
    const campaigns = await Campaign.find({ businessId: req.user.id });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//update campaign

export async function updateCampaign(req, res) {
  try {
    const { id } = req.params;
    const updatedCampaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateCampaign)
      return res.status(404).json({ message: "Campaign not found" });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//delete campaign

export async function deleteCampaign(req, res) {
  try {
    const { id } = req.params;
    await Campaign.findByIdAndDelete(id);
    res.status(200).json({ message: "Campaign Delete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function bulkEmail(req, res) {
  try {
    const { recipients, subject, message } = req.body;
    for (let email of recipients) {
      await sendEmail(email, subject, message);
    }
    res.status(200).json({ message: "Bulk email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function bulkSMS(req, res) {
  try {
    const { phoneNumbers, message } = req.body;
    for (let number of phoneNumbers) {
      await sendSMS(number, message);
    }
    res.status(200).json({ message: "Bulk SMS send successfuly." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//dashboard  stats

export async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalReferrals = await Referral.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    res.status(200).json({ totalUsers, totalReferrals, totalCampaigns });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//get all users

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// delete user
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// get all referrals

export async function getAllReferrals(req, res) {
  try {
    const allReferrals = await Referral.find().populate(
      "businessId referrerId"
    );
    res.status(200).json(allReferrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//update referrals

export async function updateReferrals(req, res) {
  try {
    const { id } = req.params;
    const { rewardStatus } = req.body;
    const referral = await User.findByIdAndUpdate(
      id,
      { rewardStatus },
      { new: true }
    );
    if (!referral)
      return res.status(404).json({ message: "Referral not found" });
    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//referral reward controller
export async function getReferralsRewards(req, res) {
  try {
    const referrals = await Referral.find({
      rewardStatus: { $ne: "pending" },
    }).populate("businessId referrerId");
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// approve or reject rewards

export async function updateRewardStatus(req, res) {
  try {
    const { id } = req.params;
    const { rewardStatus, rewardAmount } = req.body;

    if (!["approved", "rejected"].includes(rewardStatus)) {
      return res.status(400).json({ message: "Invalid reward status" });
    }

    // Find and update referral in one step
    const referral = await Referral.findByIdAndUpdate(
      id,
      {
        rewardStatus,
        rewardAmount: rewardStatus === "approved" ? rewardAmount : 0,
      },
      { new: true }
    ).populate("referrerId");
    // Log referral before update
    const existingReferral = await Referral.findById(id);
    console.log("Before Update:", existingReferral);

    if (!referral) {
      return res.status(404).json({ message: "Referral not found" });
    }

    // Get user email & phone number
    const referrerEmail = referral.referrerId.email;
    const referrerPhone = referral.referrerId.phone;

    // Notification message
    const subject =
      rewardStatus === "approved"
        ? "🎉 Referral Reward Approved!"
        : "❌ Referral Reward Rejected";

    const message =
      rewardStatus === "approved"
        ? `Congrats! Your referral reward of $${rewardAmount} has been approved! 🎉`
        : `Unfortunately, your referral reward was rejected. ❌`;

    // Send Notifications
    if (referrerPhone) {
      await sendSMS(referrerPhone, message);
    }
    if (referrerEmail) {
      await sendEmail(referrerEmail, subject, message);
    }

    res
      .status(200)
      .json({ message: `Referral reward ${rewardStatus}`, referral });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getReferralStats = async (req, res) => {
  try {
    const businessId = req.user.id;

    const referrals = await Referral.find({ businessId });

    const totalClicks = referrals.reduce((sum, ref) => sum + ref.clicks, 0);
    const totalConversions = referrals.reduce(
      (sum, ref) => sum + ref.conversions,
      0
    );
    const totalRewards = referrals.reduce(
      (sum, ref) =>
        sum + (ref.rewardStatus === "approved" ? ref.rewardAmount : 0),
      0
    );

    res.status(200).json({ totalClicks, totalConversions, totalRewards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get referral stats

export const getUserReferralStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const referral = await Referral.findOne({ referrerId: userId });

    if (!referral) {
      return res.status(404).json({ message: "No referral data found" });
    }

    res.status(200).json({
      clicks: referral.clicks,
      conversions: referral.conversions,
      rewardAmount: referral.rewardAmount,
      referralCode: referral.referralCode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
