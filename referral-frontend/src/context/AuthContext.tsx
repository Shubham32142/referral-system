import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useEffect } from "react";
interface AuthContextType {
  user: string | null;
  login: (enail: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUser(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      setUser(token);
    } catch (error) {
      console.error("login failed", error);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
