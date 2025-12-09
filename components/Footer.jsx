import React from "react";
import { assets } from "../assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.new_icon} alt="logo2" />
          <p className="mt-6 text-sm">
            IS Gadget is your trusted source for the latest and greatest smart gadgets and electronics. We carefully curate our collection to ensure high quality, performance, and the best value. Shop with confidence knowing you're getting authentic products and dedicated customer support.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © iS-Gadget All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;