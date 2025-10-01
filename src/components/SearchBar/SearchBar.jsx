import React, { useContext } from "react";
import { API_BASE_URL } from "../../../config";
import { CartContext } from "../../Context/CartContext";

export default function SearchBar() {
  let { searchTerm, setSearchTerm } = useContext(CartContext);

  return (
    <div className="w-[96.5%] mt-4 mx-auto mb-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-2 ps-10 textColor border border-gray-300 bg-white rounded-lg focus:outline-none"
          placeholder="Search..."
        />
      </div>

      {/* Results Table */}
    </div>
  );
}
