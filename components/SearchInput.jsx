"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/assets/assets"; 

const SearchInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    if (query.trim() !== "") {
      
      router.push(`/search/${query}`);
      setQuery(""); 
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <input
        type="text"
        placeholder="Search here"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          h-8 w-80 md:w-52 lg:w-80 
          px-3 py-1 
          text-black 
          text-b
          bg-white
          transition duration-300
          rounded	0.25rem
        "
      />
      <button 
        type="submit" 
        className="absolute right-0 top-0 h-full px-2 rounded-r-full hover:opacity-80 transition duration-150"
      >
        
        <Image 
          className="w-4 h-4 " 
          src={assets.search_icon} 
          alt="search icon" 
        />
      </button>
    </form>
  );
};

export default SearchInput;