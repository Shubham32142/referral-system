import { useEffect, useState } from "react";
import axios from "axios";

interface ReferralStats {
  totalClicks: number;
  totalConversions: number;
  totalRewards: number;
}

interface Referral {
  _id: string;
  referrerId: { name: string; email: string };
  referralCode: string;
  clicks: number;
  conversions: number;
  rewardStatus: string;
  rewardAmount: number;
}

const BusinessDashboard = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const statsResponse = await axios.get("https://referral-system-iiec.onrender.com/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const referralsResponse = await axios.get(
        "https://referral-system-iiec.onrender.com/referrals",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(statsResponse.data);
      setReferrals(referralsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Business Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Clicks</h2>
          <p className="text-2xl">{stats?.totalClicks || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Conversions</h2>
          <p className="text-2xl">{stats?.totalConversions || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Rewards</h2>
          <p className="text-2xl">${stats?.totalRewards || 0}</p>
        </div>
      </div>

      {/* Referrals List */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Referrer</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Referral Code</th>
            <th className="border p-2">Clicks</th>
            <th className="border p-2">Conversions</th>
            <th className="border p-2">Reward Status</th>
            <th className="border p-2">Reward Amount</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral._id} className="border-b">
              <td className="border p-2">{referral.referrerId.name}</td>
              <td className="border p-2">{referral.referrerId.email}</td>
              <td className="border p-2">{referral.referralCode}</td>
              <td className="border p-2">{referral.clicks}</td>
              <td className="border p-2">{referral.conversions}</td>
              <td className="border p-2">{referral.rewardStatus}</td>
              <td className="border p-2">${referral.rewardAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessDashboard;
