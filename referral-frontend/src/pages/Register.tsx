import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "business";
  phone?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    role: "admin",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("https://referral-system-iiec.onrender.com/register", formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {["name", "email", "password", "phone"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field as keyof RegisterFormData] || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required={field !== "phone"}
          />
        ))}

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="business">Business</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Log in here
        </a>
      </p>
    </div>
  );
};

export default Register;
