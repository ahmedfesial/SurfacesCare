import axios from "axios";
import React, { useState, useContext } from "react";
import { API_BASE_URL } from "../../../../config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";
import { LuTrash2 } from "react-icons/lu";
const UpdataBaskts = React.lazy(()=> import('../UpdataBaskts/UpdataBaskts'))

export default function DataTableBaskets() {
  let token = localStorage.getItem("userToken");

  // Get searchTerm from context
  const { searchTerm } = useContext(CartContext);
  const [updateBaskets, setUpdateBaskets] = useState(false); // Update Baskets
  const [basketsId, setBasketsId] = useState(null);
  
  

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 30; //Show how many items are on the page
  let queryClient = useQueryClient(); //Update UI

  // get All Baskets

  function getAllBaskets() {
    return axios.get(`${API_BASE_URL}baskets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllBaskets"],
    queryFn: getAllBaskets,
    select: (data) => data.data.data,
  });

  // Delete Baskets
  function deleteBasket(id) {
    axios
      .delete(`${API_BASE_URL}baskets/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Basket Deleted Successfully");
        queryClient.invalidateQueries(["AllBaskets"]);
      })
      .catch(() => {
        toast.error("Something went wrong while deleting the basket");
      });
  }

  // Update Baskets
  

  // Filter data by searchTerm if present
  let filteredData = data;
  if (searchTerm && searchTerm.trim().length > 0 && data) {
    const term = searchTerm.toLowerCase();
    filteredData = data.filter(
      (basket) =>
        (basket.name && basket.name.toLowerCase().includes(term)) ||
        (basket.client_name &&
          basket.client_name.toLowerCase().includes(term)) ||
        (basket.id && basket.id.toString().includes(term))
    );
  }

  // Pagination
  let currentRows = [];
  let totalPages = 0;
  let pageNumbers = [];

  if (filteredData && filteredData.length > 0) {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    totalPages = Math.ceil(filteredData.length / rowsPerPage);
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // is Loading
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  // Hnadle Error
  if (isError) {
    return (
      <div>
        <h1 className="text-center font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 
        pt-4 font-light text-xs rounded-xl mt-16 min-h-[900px]"
      >
        <table cellPadding="12" className="leading-12 w-full">
          <thead className="textColor bg-[#EBEBEB]">
            <tr className="text-left">
              <th className="w-[70px] text-sm font-semibold p-4 rounded-l-xl">
                ID
              </th>
              <th className="w-[200px] text-sm font-semibold">Basket Name</th>
              <th className="w-[400px] text-sm font-semibold">Customer Name</th>
              <th className="w-[100px] text-sm font-semibold">Product</th>
              <th className="w-[60px] text-sm font-semibold rounded-r-xl">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="w-full">
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-xl textColor font-bold"
                >
                  {" "}
                  No Results Found
                </td>
              </tr>
            ) : (
              currentRows.map((basket) => (
                <tr key={basket.id} className="border-b-1 border-[#00000020]">
                  <td className="ps-4">{basket.id}</td>
                  <td
                    onClick={() => {
                      setUpdateBaskets(true);
                      setBasketsId(basket.id);
                    }}
                    className="truncate textColor cursor-pointer"
                  >
                    {(basket?.name || "").split(" ").slice(0, 2).join(" ")}
                    <BiEditAlt className="inline-block" />
                  </td>
                  <td>{basket.client_name}</td>
                  <NavLink to={`/BasketsProducts/${basket.id}`}>
                    <td className="textColor ps-6 font-semibold cursor-pointer">
                      {basket.product_count}
                    </td>
                  </NavLink>
                  <td>
                    <LuTrash2
                      className="text-xl ms-3 text-red-600 cursor-pointer hover:scale-110 transition-all duration-300"
                      onClick={() => deleteBasket(basket.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <UpdataBaskts
        updateBaskets={updateBaskets}
        setUpdateBaskets={setUpdateBaskets}
        BasketsId={basketsId}
        />

      {/* Pigniation  */}
      <div className="w-[93%] mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 mt-8 sm:mt-4">
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} Baskets on this Page
          </span>
        </div>

        {/* Tailwind Pagination */}
        <nav aria-label="Page navigation" className="mt-4 flex justify-end">
          <ul className="inline-flex -space-x-px text-sm">
            {/* Previous */}
            <li>
              <button
                onClick={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-s-lg ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                Previous
              </button>
            </li>

            {/* Numbers */}
            {pageNumbers.map((num) => (
              <li key={num}>
                <button
                  onClick={() => setCurrentPage(num)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${
                    currentPage === num
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                      : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  {num}
                </button>
              </li>
            ))}

            {/* Next */}
            <li>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < pageNumbers.length ? prev + 1 : prev
                  )
                }
                disabled={currentPage === pageNumbers.length}
                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg ${
                  currentPage === pageNumbers.length
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
