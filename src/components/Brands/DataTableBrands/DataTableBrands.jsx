import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./../../../../config";
import { IoMdCloudDownload } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { CartContext } from "../../../Context/CartContext";
import EditBrandModal from "../AddBrands/EditBrandModal";

export default function DataTableBrands() {
  let token = localStorage.getItem("userToken");
  const { searchTerm } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const rowsPerPage = 7;
  let queryClient = useQueryClient();

  // Get All Brands
  function getAllBrands() {
    return axios.get(`${API_BASE_URL}brands`);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllBrands"],
    queryFn: getAllBrands,
    select: (res) => res.data.data,
  });

  // Delete Brand
  function deleteBrand(id) {
    axios
      .delete(`${API_BASE_URL}brands/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Brand Deleted Successfully");
        queryClient.invalidateQueries(["AllBrands"]);
      })
      .catch(() => {
        toast.error("Something went wrong while deleting the brand");
      });
  }

  // Toggle Brand Status
  function toggleBrandStatus(id) {
    axios
      .post(
        `${API_BASE_URL}brands/${id}/toggleStatus`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Brand status toggled successfully");
        queryClient.invalidateQueries(["AllBrands"]);
      })
      .catch(() => {
        toast.error("Error while toggling brand status");
      });
  }

  // Filter with search
  let filteredData = data || [];
  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.toLowerCase();
    filteredData = data.filter(
      (brand) =>
        (brand.name_en && brand.name_en.toLowerCase().includes(term)) ||
        (brand.name_ar && brand.name_ar.toLowerCase().includes(term)) ||
        (brand.id && brand.id.toString().includes(term))
    );
  }

  // Pagination
  let currentRows = [];
  let totalPages = 0;
  let pageNumbers = [];

  if (filteredData.length > 0) {
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

  // Handle Error
  if (isError) {
    return (
      <div>
        <h1 className="text-center font-bold">{error.message}</h1>
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
              <th className="font-semibold text-sm w-[150px] p-4 rounded-l-xl">
                Logo
              </th>
              <th className="font-semibold text-sm w-[200px]">Name</th>
              <th className="font-semibold text-sm w-auto">Description</th>
              <th className="font-semibold text-sm w-[150px] ps-8">Catalog</th>
              <th className="font-semibold text-sm w-[150px] ps-12 rounded-r-xl">
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
                  No Results Found
                </td>
              </tr>
            ) : (
              currentRows.map((brand) => (
                <tr
                  key={brand.id}
                  className={`transition-all duration-300 border-b-1 border-[#00000020] ${
                    brand.status === 0 ? "line-through opacity-50 grayscale" : ""
                  }`}
                >
                  {/* Logo */}
                  <td>
                    <img
                      src={brand.logo}
                      alt="logo"
                      className="w-[60px] h-[60px] object-contain ps-4"
                    />
                  </td>

                  {/* Name */}
                  <td className="truncate">
                    {(brand?.name_en || "").split(" ").slice(0, 2).join(" ")}
                  </td>

                  {/* Description */}
                  <td className="truncate">
                    {(brand?.full_description_en || "")
                      .split(" ")
                      .slice(0, 8)
                      .join(" ")}
                    ...
                  </td>

                  {/* Catalog button */}
                  <td>
                    {brand.catalog_pdf_url ? (
                      <button
                        className="flex justify-center ps-10 items-center gap-2 text-md font-medium text-red-600 cursor-pointer hover:scale-110 transition-all duration-300"
                        onClick={() =>
                          window.open(brand.catalog_pdf_url, "_blank")
                        }
                      >
                        PDF <IoMdCloudDownload />
                      </button>
                    ) : (
                      <span className="ps-10 text-gray-400">No PDF</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex text-xl gap-2 ps-11">
                      {/* Toggle Eye */}
                      <IoEyeOutline
                        className="textColor cursor-pointer hover:scale-110 transition-all duration-300"
                        onClick={() => toggleBrandStatus(brand.id)}
                      />

                      {/* Delete Icon */}
                      <span onClick={() => deleteBrand(brand.id)}>
                        <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition-all duration-300" />
                      </span>

                      {/* Edit Icon */}
                      <span
                        onClick={() => {
                          setEditBrand(brand);
                          setEditModalOpen(true);
                        }}
                      >
                        <BiEditAlt className="textColor cursor-pointer hover:scale-110 transition-all duration-300" />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="w-[93%] mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 mt-8 sm:mt-4">
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} Brands on this Page
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

      {/* Edit Brand Modal */}
      <EditBrandModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        brand={editBrand}
      />
    </>
  );
}
