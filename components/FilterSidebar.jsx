
import React from 'react';
import { FiFilter } from 'react-icons/fi';

const FilterSidebar = ({ filters, onFilterChange }) => {
    if (!onFilterChange || typeof onFilterChange !== 'function') {
        // This is a good way to catch the previous error if it reappears
        return <p>Filter handler is missing.</p>; 
    }

    return (
        <div className="p-4 bg-white flex border rounded-lg shadow-sm  md:space-x-4">
            <div className="flex justify-start items-center mb-4">
                <FiFilter className="text-xl mr-2 text-gray-700" /> {/* Filter Icon */}
                <h3 className="text-lg font-bold">Filter</h3> {/* Keep a concise label */}
            </div>
            
         
            <div className="mb-4 ">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                    className=" p-2 border rounded-md"
                    value={filters.category}
                   onChange={(e) => onFilterChange('category', e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Watch">Watch</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Earphone">Earphone</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Camera">Camera</option>
                    <option value="Smartphone">Smartphone</option>
                  
                </select>
            </div>

            
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 500"
                    value={filters.priceMax}
                    onChange={(e) => onFilterChange('priceMax', e.target.value)}
                />
            </div>

            
        </div>
    );
};

export default FilterSidebar;