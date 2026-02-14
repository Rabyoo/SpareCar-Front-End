import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean; // ⭐ أضف هذا السطر
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isBackendConnected: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

 useEffect(() => {
   // عند تحميل الـ App
   const initAuth = async () => {
     setLoading(true); // تبدأ التحميل
     const isLoggedIn = await checkAuth(); // تحقق من الـ localStorage أو backend
     setLoading(false); // انتهاء التحميل
     if (!isLoggedIn) {
       setUser(null); // لو مش متسجل دخول
     }
   };

   initAuth();
 }, []);

  // عدل checkBackendConnection ليصبح:
  const checkBackendConnection = async () => {
    try {
      const endpoints = [
        `${import.meta.env.VITE_API_URL}/health`, // هذا اللي شغال
        `${import.meta.env.VITE_API_URL}/health`, // جرب root
        `${import.meta.env.VITE_API_URL}`, // جرب base URL
        `${import.meta.env.VITE_API_URL}/v1/health`, // هذا اللي بيطلع 404
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (response.ok || response.status === 200) {
            setIsBackendConnected(true);
            console.log(`✅ Backend connected at: ${endpoint}`);
            return;
          }
        } catch (err) {
          console.log(`❌ Failed to connect to: ${endpoint}`);
        }
      }

      console.log("⚠️ Backend not reachable, using mock data");
      setIsBackendConnected(false);
    } catch (error) {
      console.error("Backend check error:", error);
      setIsBackendConnected(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    role?: string,
  ): Promise<boolean> => {
    try {
      console.log("🔐 Attempting login with:", email);

      // جرب الـ endpoints المحتملة
      const endpoints = [
        `${import.meta.env.VITE_API_URL}/auth/login`, // الأكثر احتمالاً
        `${import.meta.env.VITE_API_URL}/v1/auth/login`, // لو كان نسخة v1
        `${import.meta.env.VITE_API_URL}/auth/login`, // لو كان في root
        `${import.meta.env.VITE_API_URL}/users/login`, // احتمال آخر
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password, role }),
          });

          console.log(
            `📡 Response status: ${response.status} from ${endpoint}`,
          );

          if (response.ok) {
            const data = await response.json();
            console.log("✅ Login successful:", data);

            const user: User = {
              id:
                data.user?._id ||
                data.user?.id ||
                data._id ||
                Date.now().toString(),
              email: data.user?.email || data.email || email,
              name:
                data.user?.name ||
                data.user?.displayName ||
                data.name ||
                "User",
              role: data.user?.role || data.role || "customer",
              token: data.token || data.accessToken || "dummy-token",
            };

            setUser(user);
            localStorage.setItem(
              "token",
              data.token || data.accessToken || "dummy-token",
            );
            localStorage.setItem("user", JSON.stringify(user));

            toast.success(`Welcome back, ${user.name}!`);

            // Redirect بعد تأكيد الـ role
            setTimeout(() => {
              if (user.role === "admin") {
                console.log("🚀 Redirecting to admin dashboard");
                window.location.href = "/admin";
              } else {
                window.location.href = "/";
              }
            }, 500);

            return true;
          }

          // إذا كان الرد 404، جرب الـ endpoint التالي
          if (response.status === 404) {
            console.log(`❌ Endpoint ${endpoint} returned 404, trying next...`);
            continue;
          }
        } catch (err) {
          console.log(`⚠️ Error with endpoint ${endpoint}:`, err);
          continue;
        }
      }

      // لو كل الـ endpoints فشلت، استخدم mock للمستخدم admin@gmail.com
      console.log("🔄 All endpoints failed, using mock login");

      if (email === "admin@gmail.com" && password === "admin123") {
        const adminUser: User = {
          id: "694a76490dcbe9615c0b02ac",
          email: "admin@gmail.com",
          name: "Admin User",
          role: "admin",
          token: "mock-admin-token-for-dev",
        };

        setUser(adminUser);
        localStorage.setItem("token", "mock-admin-token-for-dev");
        localStorage.setItem("user", JSON.stringify(adminUser));

        toast.success("Welcome back, Admin! (Using development mode)");

        setTimeout(() => {
          console.log("🚀 Redirecting to admin dashboard (mock mode)");
          window.location.href = "/admin";
        }, 500);

        return true;
      }

      toast.error("Invalid email or password");
      return false;
    } catch (error) {
      console.error("❌ Login system error:", error);
      toast.error("Login service unavailable. Please try again.");
      return false;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) return false;

    try {
      // حاول التحقق من الـ Backend
      if (isBackendConnected) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/v1/auth/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          return true;
        }
      }

      // Fallback: استخدم الـ localStorage
      const user = JSON.parse(savedUser);
      if (user && user.email) {
        setUser(user);
        return true;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // استخدم الـ localStorage كـ fallback
      const user = JSON.parse(savedUser);
      if (user && user.email) {
        setUser(user);
        return true;
      }
    }

    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<boolean> => {
    // Mock registration - يمكنك تحديثها للـ Backend
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "customer",
    };
    setUser(newUser);
    toast.success("Account created successfully!");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // ⭐ أضف هذا في القيمة المعادة
        login,
        register,
        logout,
        isAdmin,
        isBackendConnected,
        checkAuth,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
