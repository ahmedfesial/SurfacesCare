import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "./../../../../config";
import { FaSpinner } from "react-icons/fa";
import { CartContext } from "../../../Context/CartContext";
import dayjs from "dayjs";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";


export default function DataTableMembers() {
  let token = localStorage.getItem("userToken");
  const { searchTerm } = useContext(CartContext);
  let queryUser = useQueryClient();
  


  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  // Get All Users
  function getAllUsers() {
    return axios.get(`${API_BASE_URL}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllUsers"],
    queryFn: getAllUsers,
    select: (data) => data.data.data,
  });

  let filteredData = data || [];
  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.toLowerCase();
    filteredData = data.filter(
      (member) =>
        (member.name && member.name.toLowerCase().includes(term)) ||
        (member.client_name &&
          member.client_name.toLowerCase().includes(term)) ||
        (member.id && member.id.toString().includes(term))
    );
  }

  // Delete member
  function deleteMember(id){
    axios.delete(`${API_BASE_URL}users/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(()=>{
      toast.success('Delete Member Successfully')
      queryUser.invalidateQueries(['AllUsers'])
    })
    .catch(()=>{
      toast.error('error delete Member')
    })
  }

  // Pagination (based on filteredData)
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
        <table cellPadding="12" className="w-full border-collapse table-auto">
          <thead className="textColor bg-[#EBEBEB]">
            <tr className="text-left ">
              <th className="w-[20%] font-semibold text-sm rounded-l-xl p-4">
                Name
              </th>
              <th className="w-[25%] font-semibold text-sm">Email</th>
              <th className="w-[20%] font-semibold text-sm">Telephone</th>
              <th className="w-[20%] font-semibold text-sm ps-6">Last Login</th>
              <th className="w-[15%] font-semibold text-sm ps-4">
                Status
              </th>
              <th className="w-[15%] font-semibold text-sm ps-4 rounded-r-xl pe-4">
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
              currentRows.map((user) => (
                <tr key={user.id} className="border-b-1 border-[#00000020]">
                  <td className="truncate ps-6 py-4">{user.name}</td>
                  <td className="truncate">{user.email}</td>
                  <td className="truncate">{user.phone}</td>
                  <td className="truncate">
                    <div className="backGroundColor w-32 h-6 flex justify-center items-center text-white py-1 px-2 rounded-full font-extralight">
                      <span>
                        {dayjs(user.created_at).format("HH:mm,  DD.MM.YY")}
                      </span>
                    </div>
                  </td>
                  <td>
                      <span className="border py-1 px-6 rounded-md cursor-pointer text-[#ff0000]">
                        Active
                      </span>
                  </td>
                  <td>
                    <span onClick={() => deleteMember(user.id)}>
                        <RiDeleteBin6Line className="text-red-600 cursor-pointer hover:scale-110 transition-all duration-300 text-xl ms-6"/>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* أزرار الصفحات */}
      </div>
      <div className="w-[93%] mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 mt-8 sm:mt-4">
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} Member on this Page
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
