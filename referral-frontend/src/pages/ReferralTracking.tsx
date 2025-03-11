import { useEffect, useState } from "react";
import axios from "axios";

interface ReferralStats {
  clicks: number;
  conversions: number;
  rewardAmount: number;
  referralCode: string;
}

const ReferralTracking = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/referral-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(
        `http://localhost:3000/referral/${stats.referralCode}`
      );
      alert("Referral link copied to clipboard!");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎯 Referral Tracking</h1>

      {/* Referral Link */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-bold">Your Referral Link:</h2>
        <p className="text-blue-600 break-all">
          http://localhost:3000/referral/{stats?.referralCode}
        </p>
        <button
          onClick={copyToClipboard}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Copy Link
        </button>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Clicks</h2>
          <p className="text-2xl">{stats?.clicks || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Conversions</h2>
          <p className="text-2xl">{stats?.conversions || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Rewards</h2>
          <p className="text-2xl">${stats?.rewardAmount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralTracking;
