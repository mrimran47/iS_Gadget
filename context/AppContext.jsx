"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, } from "react";
import toast from "react-hot-toast";
import { useUser, useAuth } from "@clerk/nextjs";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken, isSignedIn } = useAuth();

  // ----- App state -----

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  console.log("PRODUCTS LOADED:", products.length);

  const [err, setErr] = useState('');
  const [filters, setFilters,] = useState({ 
       category: '', 
        priceMin: 0,
        priceMax: 999999
    });
    const handleFilterChange = (key, value) => {
    const finalValue = ['priceMin', 'priceMax'].includes(key)
        ? parseFloat(value)
        : value;

    setFilters(prev => {
        if (prev[key] === finalValue) return prev; // ⛔ prevent re-render
        return { ...prev, [key]: finalValue };
    });
};



  const fetchProductData = async () => {
    setLoading(true);
    setErr('');

    try {
      const cleanFilters = Object.fromEntries(
  Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
);

const filterParams = new URLSearchParams(cleanFilters).toString();

      const url = `/api/product/list?${filterParams}`;

      const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      } else {
       
        toast.error(data.message);
      }

    }
    catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error.message.includes('HTTP error')
        ? 'Failed to load products.'
        : 'A network error occurred.';
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setUserData(data);
    }
    catch (err) {
      console.error(err);
      setUserData(false);
    }
  };


  const addToCart = async (itemId) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        const res = await fetch('/api/cart/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ cartData }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        toast.success('Item added to cart');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    if (quantity === 0) delete cartData[itemId];
    else cartData[itemId] = quantity;
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();
        const res = await fetch('/api/cart/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ cartData }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        toast.success('Cart Updated');
      } catch (error) {
        toast.error(error.message);
      }
    }

  };

  const getCartCount = () => {
    let total = 0;
    for (const id in cartItems) if (cartItems[id] > 0) total += cartItems[id];
    return total;
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const item = products.find((p) => p._id === id);
      if (item && cartItems[id] > 0) {
        total += item.offerPrice * cartItems[id];
      }
    }

    return Math.floor(total * 100) / 100;
  };
  const fetchCartItems = async () => {
    
    if (!isLoaded || !isSignedIn || !user?.id) {
        setCartItems({}); 
        return;
    }

    try {
        const token = await getToken();
        const res = await fetch('/api/cart/get', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success && data.user && data.user.cartItems) {
            setCartItems(data.user.cartItems);
        }
    } catch (error) {
        console.error("Cart Fetch Error:", error);
    }
};
  useEffect(() => {
    fetchCartItems();
  }, [isLoaded, isSignedIn, user?.id, getToken]);



  useEffect(() => {
    fetchProductData();
  }, [filters]);

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchUserData();
    }
  }, [isLoaded, user?.id]);


  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch("/api/me/sync", { method: "POST" });
        if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.id) sync();
  }, [user?.id]);


  useEffect(() => {
    if (!isLoaded) return;
    const roleFromClerk = user?.publicMetadata?.role;
    const roleFromDb = userData?.role;
    const role = roleFromClerk ?? roleFromDb ?? "buyer";
    setIsSeller(role === "seller");
  }, [isLoaded, user?.publicMetadata?.role, userData?.role]);
  
  const clearCart = () => {
    setCartItems({}); 
};

  const value = {
    loading,
    err,
    router,
    user,
    isSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    handleFilterChange,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    clearCart,
    filters,

  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
