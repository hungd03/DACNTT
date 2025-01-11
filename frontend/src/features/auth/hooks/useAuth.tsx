import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { User } from "@/types/auth";
import { authApi } from "../api/auth.api";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async () => {
    try {
      const response = await authApi.getUserInfo();
      if (response.data.status) {
        setUser(response.data.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
      setIsLoggedIn(false);
      Cookies.remove("token");
    }
  };

  const login = async (token: string) => {
    Cookies.set("token", token, { expires: 1 });
    setIsLoggedIn(true);
    await fetchUserInfo();
  };

  const logout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUserInfo();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
