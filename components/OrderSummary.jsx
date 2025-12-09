'use client';
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const { currency, getCartCount, getCartAmount, cartItems,clearCart } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const subTotal = getCartAmount(); // Get the base amount from context
 const [shippingFee, setShippingFee] = useState(60)
  const totalAmount = subTotal + shippingFee;

  const fetchUserAddresses = async () => {
    // setLoading(true); // uncomment if you add a loading state
    try {
      // 1. Get the session token for secure API calls
      const token = await getToken();

      // 2. Use the native `fetch` API
      const res = await fetch('/api/user/get-address', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Pass the Clerk token in the Authorization header
          'Authorization': `Bearer ${token}`,
        },
      });

      // 3. Parse the JSON response
      const data = await res.json();

      // 4. Handle success/failure based on API response
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]); // Select the first address by default
        }
      } else {
        // Display server-side error message
        toast.error(data.message);
      }
    } catch (error) {
      // Display client-side network error message
      toast.error(error.message || "Failed to fetch addresses.");
    }
    // finally {
    //     setLoading(false); // uncomment if you add a loading state
    // }
  }
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      return toast.error('Please select an address');
    }

    let cartItemsArray = Object.keys(cartItems).map((key) => ({
      product: key,
      quantity: cartItems[key]
    }));

    cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);

    if (cartItemsArray.length === 0) {
      return toast.error('Cart is empty');
    }

    try {

      const token = await getToken();

      const orderPayload = {
        addressId: selectedAddress._id,
        // NOTE: Sending the base subtotal, tax calculation is done on the server
        amount: subTotal,
        items: cartItemsArray,
        shippingFee: shippingFee
      };

      const res = await fetch('/api/order/creat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success) {

        
        router.push('/order-placed');
        if (clearCart) {
          clearCart();
        }
      } else {
        toast.error(data.message || 'Order creation failed.');
      }

    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserAddresses();
    }
  }, [isLoaded, isSignedIn, fetchUserAddresses]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        
        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{getCartAmount()}{currency}</p>
          </div>
          <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-3">
            Shipping Type
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer p-2 border border-gray-200 rounded hover:bg-white transition">
              <input 
                type="radio" 
                name="shipping" 
                value={60}
                checked={shippingFee === 60}
                onChange={() => setShippingFee(60)}
                className="w-4 h-4 accent-orange-600"
              />
              <span className="text-gray-700">Inside Dhaka (60{currency})</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-2 border border-gray-200 rounded hover:bg-white transition">
              <input 
                type="radio" 
                name="shipping" 
                value={120}
                checked={shippingFee === 120}
                onChange={() => setShippingFee(120)}
                className="w-4 h-4 accent-orange-600"
              />
              <span className="text-gray-700">Outside Dhaka (120{currency})</span>
            </label>
          </div>
        </div>
        <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{subTotal}{currency}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">{shippingFee}{currency}</p>
          </div>
          
          
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{totalAmount}{currency}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-gradient-to-r from-[#0A1625] to-[#0C1A2E] text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;