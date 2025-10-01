import axios from "axios";
import React, { useContext, useState } from "react";
import { API_BASE_URL } from "../../../../config";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../../Context/CartContext";
import dayjs from "dayjs";

export default function DataTableCatalogs() {
  let token = localStorage.getItem("userToken");

  const { searchTerm } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  function getAllCatalog() {
    return axios.get(`${API_BASE_URL}catalogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllCatalogs"],
    queryFn: getAllCatalog,
    select: (data) => data.data.data,
  });

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

  let currentRows = [];
  let totalPages = 0;
  let pageNumbers = [];

  if (data && data.length > 0) {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    totalPages = Math.ceil(data.length / rowsPerPage);
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (filteredData && filteredData.length > 0) {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    totalPages = Math.ceil(filteredData.length / rowsPerPage);
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Is Loading
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
        <table
          cellPadding="12"
          className="leading-12 w-full table-fixed border-collapse"
        >
          <thead className="textColor bg-[#EBEBEB]">
            <tr className="text-left">
              <th className="w-[70px] p-4 rounded-l-xl font-semibold text-sm">
                ID
              </th>
              <th className="w-[150px] font-semibold text-sm">Catalog Name</th>
              <th className="w-[150px] font-semibold text-sm">Customer Name</th>
              <th className="w-[100px] font-semibold text-sm">Products</th>
              <th className="w-[100px] font-semibold rounded-r-xl text-sm ps-5">
                Creation Date
              </th>
            </tr>
          </thead>

          <tbody className="w-full">
            {filteredData && filteredData.length === 0 ? (
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
              currentRows.map((catalog) => (
                <tr key={catalog.id} className="border-b-1 border-[#00000020]">
                  {/* Id */}
                  <td className="ps-4">{catalog.id}</td>

                  {/* Name Catalog */}
                  <td className="truncate">{catalog.name}</td>

                  {/* Creator */}
                  <td className="truncate">{catalog?.basket?.client_name}</td>

                  {/* product count */}
                  <NavLink to={`/CatalogsProducts/${catalog.id}`}>
                    <td className="textColor text-center ps-6">
                      {catalog?.basket?.product_count}
                    </td>
                  </NavLink>

                  {/* Create */}
                  {/* {catalog.created_at.split("T")[0]} */}
                  <td>
                    <div className="backGroundColor w-32 h-6 flex justify-center items-center text-white py-1 px-2 rounded-full font-extralight">
                      <span>
                        {dayjs(catalog.created_at).format("HH:mm DD.MM")}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* أزرار الصفحات */}
      <div className="w-[93%] mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 mt-8 sm:mt-4">
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} Catalogs on this Page
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
