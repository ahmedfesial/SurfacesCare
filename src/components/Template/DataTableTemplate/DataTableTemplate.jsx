import axios from "axios";
import React, { useContext, useState } from "react";
import { API_BASE_URL } from "../../../../config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CartContext } from "../../../Context/CartContext";
import { IoEyeOutline } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import EditTemplateModal from "../AddTemplate/EditTemplateModal";

export default function DataTableTemplate() {


  let token = localStorage.getItem("userToken");
  const { searchTerm } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const rowsPerPage = 7;

  let queryClient = useQueryClient();

  function getAllTemplate() {
    return axios.get(`${API_BASE_URL}templates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllTemplate"],
    queryFn: getAllTemplate,
    select: (data) => data.data.templates,
  });

  // Delete Template
  function deleteTemplate(id) {
    axios
      .delete(`${API_BASE_URL}templates/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Template Deleted Successfully");
        queryClient.invalidateQueries(["AllTemplate"]);
      })
      .catch((err) => {
        toast.error("Something went wrong while deleting the Template");
        console.log(err);
      });
  }

  // Toggle Template Status (Hide/Show)
  function toggleTemplateStatus(id) {
    axios
      .post(
        `${API_BASE_URL}templates/${id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Template status updated successfully");
        queryClient.invalidateQueries(["AllTemplate"]);
      })
      .catch((err) => {
        toast.error("Something went wrong while updating template status");
        console.log(err);
      });
  }

  // Filter with search
  let filteredData = data || [];
  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.toLowerCase();
    filteredData = data.filter(
      (brand) =>
        (brand.name && brand.name.toLowerCase().includes(term)) ||
        (brand.client_name && brand.client_name.toLowerCase().includes(term)) ||
        (brand.id && brand.id.toString().includes(term))
    );
  }

  // Pagination (based on filteredData Search)
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
              <th className="font-semibold rounded-l-xl text-sm w-[150px] p-4">
                ID
              </th>
              <th className="font-semibold text-sm w-[200px]">Name</th>
              <th className="font-semibold text-sm w-auto">Description</th>
              <th className="font-semibold text-sm w-[150px] rounded-r-xl ps-14">
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
              currentRows.map((template) => (
                <tr
                  key={template.id}
                  className={`transition-all duration-300 border-b-1 border-[#00000020] ${
                    template.status === 0
                      ? "line-through opacity-50 grayscale"
                      : ""
                  }`}
                >
                  {/* Logo */}
                  <td className="ps-8">{template.id}</td>

                  {/* Name */}
                  <td className="truncate">{template.name}</td>

                  {/* Description */}
                  <td className="truncate">
                    {template.description.split(" ").slice(0, 4).join(" ")}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex text-xl gap-2 ps-11">
                      {/* Eye Icon (Toggle Hide/Show) */}
                      <IoEyeOutline
                        className={`cursor-pointer hover:scale-110 transition-all duration-300 ${
                          template.status === 0 ? "text-gray-400" : "textColor"
                        }`}
                        onClick={() => toggleTemplateStatus(template.id)}
                        title={
                          template.status === 0
                            ? "Show Template"
                            : "Hide Template"
                        }
                      />

                      {/* delete Icon */}
                      <span onClick={() => deleteTemplate(template.id)}>
                        <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition-all duration-300" />
                      </span>

                      {/* Edit Icon */}
                      <span
                        onClick={() => {
                          setEditTemplate(template);
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

      {/* Pagination */}
      <div className="w-[93%] mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 mt-8 sm:mt-4">
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} Template on this Page
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

      {/* Edit Template Modal */}
      <EditTemplateModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditTemplate(null);
        }}
        template={editTemplate}
        onUpdate={() => {
          queryClient.invalidateQueries(["AllTemplate"]);
        }}
      />
    </>
  );
}
