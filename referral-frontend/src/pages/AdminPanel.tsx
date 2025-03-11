import axios from "axios";
import { useState, useEffect } from "react";
interface Referral {
  _id: string;
  referrerId: { name: string; email: string };
  referralCode: string;
  rewardStatus: string;
  rewardAmount: number;
}
export function AdminPanel() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const referralsPerPage = 5; // Show 5 referrals per page

  const filteredReferrals = referrals.filter(
    (referral) =>
      referral.referrerId.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      referral.referrerId.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      referral.rewardStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastReferral = currentPage * referralsPerPage;
  const indexOfFirstReferral = indexOfLastReferral - referralsPerPage;
  const currentReferrals = filteredReferrals.slice(
    indexOfFirstReferral,
    indexOfLastReferral
  );

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  useEffect(() => {
    fetchReferrals();
  }, []);
  const getStatusLabel = (status: string) => {
    if (status === "approved")
      return <span className="text-green-600 font-bold">✅ Approved</span>;
    if (status === "rejected")
      return <span className="text-red-600 font-bold">❌ Rejected</span>;
    return <span className="text-gray-600 font-bold">⏳ Pending</span>;
  };
  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/referrals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReferrals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching referrals: ", error);
      setLoading(false);
    }
  };
  const updateRewardStatus = async (id: string, status: string) => {
    try {
      setProcessing((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/rewardStatus/${id}`,
        {
          rewardStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReferrals();
    } catch (error) {
      console.error("error updating rewards: ", error);
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false })); // ✅ Stop loading state
    }
  };
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin Panel - Manage Referrals
      </h1>
      <input
        type="text"
        placeholder="search referrals..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Referrer</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Referral Code</th>
            <th className="border p-2">Reward Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReferrals.map((referral) => (
            <tr key={referral._id} className="border-b">
              <td className="border p-2">{referral.referrerId.name}</td>
              <td className="border p-2">{referral.referrerId.email}</td>
              <td className="border p-2">{referral.referralCode}</td>
              <td className="border p-2">
                {getStatusLabel(referral.rewardStatus)}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => updateRewardStatus(referral._id, "approved")}
                  className={`px-3 py-1 rounded mr-2 ${
                    referral.rewardStatus === "approved"
                      ? "bg-green-500 text-white opacity-50 cursor-not-allowed"
                      : "bg-green-500 text-white"
                  }`}
                  disabled={
                    referral.rewardStatus === "approved" ||
                    processing[referral._id]
                  }
                >
                  {processing[referral._id] &&
                  referral.rewardStatus !== "approved"
                    ? "Approving..."
                    : "Approve"}
                </button>

                <button
                  onClick={() => updateRewardStatus(referral._id, "rejected")}
                  className={`px-3 py-1 rounded ${
                    referral.rewardStatus === "rejected"
                      ? "bg-red-500 text-white opacity-50 cursor-not-allowed"
                      : "bg-red-500 text-white"
                  }`}
                  disabled={
                    referral.rewardStatus === "rejected" ||
                    processing[referral._id]
                  }
                >
                  {processing[referral._id] &&
                  referral.rewardStatus !== "rejected"
                    ? "Rejecting..."
                    : "Reject"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
        >
          Previous
        </button>
        <span className="text-lg">Page {currentPage}</span>
        <button
          onClick={nextPage}
          disabled={indexOfLastReferral >= filteredReferrals.length}
          className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
