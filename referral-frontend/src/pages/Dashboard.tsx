import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);
  if (loading) {
    return <h1 className="text-xl font-bold p-4">Loading...</h1>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      <button
        onClick={() => navigate("/admin")}
        className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Admin Panel
      </button>
      <button
        onClick={() => navigate("/Business-panel")}
        className="mt-4 ml-4 bg-purple-500 text-white px-4 py-2 rounded"
      >
        Go to Business Dashboard
      </button>
      <button
        onClick={() => navigate("/referral-tracking")}
        className="mt-4 ml-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Track Referrals
      </button>
      <button
        onClick={() => navigate("/campaigns")}
        className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
      >
        Manage Campaigns
      </button>
    </div>
  );
}
