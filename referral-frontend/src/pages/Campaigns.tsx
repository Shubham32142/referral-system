import { useEffect, useState } from "react";
import axios from "axios";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  reward: number;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    reward: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://referral-system-iiec.onrender.com/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("https://referral-system-iiec.onrender.com/", newCampaign, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns([...campaigns, response.data]);
      setNewCampaign({ title: "", description: "", reward: 0 });
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://referral-system-iiec.onrender.com/campaign/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(campaigns.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📢 Manage Campaigns</h1>

      {/* New Campaign Form */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-bold">Create New Campaign</h2>
        <input
          type="text"
          placeholder="Title"
          value={newCampaign.title}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, title: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={newCampaign.description}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, description: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="Reward Amount"
          value={newCampaign.reward}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, reward: Number(e.target.value) })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={createCampaign}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Campaign
        </button>
      </div>

      {/* Campaign List */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Reward</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id} className="border-b">
              <td className="border p-2">{campaign.title}</td>
              <td className="border p-2">{campaign.description}</td>
              <td className="border p-2">${campaign.reward}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteCampaign(campaign._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Campaigns;
