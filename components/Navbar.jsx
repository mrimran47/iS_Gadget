
"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "../assets/assets";
import Link from "next/link"
import { useAppContext } from "../context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import SearchInput from "./SearchInput";


const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()


  return (
    <div>
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-12 py-3 
bg-gradient-to-r from-[#0A1625] to-[#0C1A2E] 
text-white 
shadow-[0_2px_20px_rgba(0,0,0,0.4)] 
border-b border-[#1F2A40]
rounded-none
relative z-50">
      <Image
        className="w-32 h-10 relative cursor-pointer "
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="max-md:hidden">
        <SearchInput />
      </div>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="text-white hover:text-neonBlue hover:animate-neon-pulse transitionn">
          Home
        </Link>
        <Link href="/all-products" className="text-white hover:text-neonBlue hover:animate-neon-pulse transitionn">
          Shop
        </Link>
        <Link href="/#footer" className="text-white hover:text-neonBlue hover:animate-neon-pulse transitionn">
          About Us
        </Link>
        <Link href="/#ContactUs" className="text-white hover:text-neonBlue hover:animate-neon-pulse transitionn">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="neon-btn text-[10px] px-3 py-[4px] rounded-full border border-white
               hover:shadow-neon hover:text-neonBlue transition duration-300 ease-in-out">Seller Dashboard</button>}

      </div>


      <ul className="hidden md:flex items-center gap-4 ">

        {user
          ? <>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-product')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems></UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
              </UserButton.MenuItems>
            </UserButton>
          </>
          : <button onClick={openSignIn} className="px-2 flex items-center gap-2 text-gray-300 hover:text-[#00eaff] 
                 hover:shadow-[0_0_8px_#00eaff,0_0_16px_#00eaff,0_0_32px_#00eaff]
                 transition duration-300 ease-in-out rounded-full ">
            <Image className="w-4 h-4 invert brightness-150" src={assets.user_icon} alt="user icon" />
            Account
          </button>}
      </ul>


      <div className="flex items-center md:hidden gap-3">

        <div className="flex items-center gap-2">

          {isSeller && <button onClick={() => router.push('/seller')} className="neon-btn text-[10px] px-3 py-[4px] rounded-full border border-neonBlue 
               hover:shadow-neon hover:text-neonBlue transition duration-300 ease-in-out">Seller Dashboard</button>}
          {user
            ? <>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-product')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                </UserButton.MenuItems>
              </UserButton>
            </>
            : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>}
        </div>


        
      </div>

    </nav>
    <div className="mt-3 px-4 pb-3 border-t border-black-180 md:hidden">
        <SearchInput />
    </div>

    </div>
  );
};

export default Navbar;