// frontend/src/context/VendorContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setVendor(data.vendor);
        }
      }
    } catch (error) {
      console.error("Error fetching vendor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorContext.Provider value={{ vendor, setVendor, loading }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);
