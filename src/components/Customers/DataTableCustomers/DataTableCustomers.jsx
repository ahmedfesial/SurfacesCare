import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useContext, useState } from "react";
import { API_BASE_URL } from "./../../../../config";
import { useQuery } from "@tanstack/react-query";
import { BiEditAlt } from "react-icons/bi";
import UpdateClientDialog from "../UpdateClientDialog/UpdateClientDialog";
import { FaSpinner } from "react-icons/fa";
import { CartContext } from "../../../Context/CartContext";
import { LuImage } from "react-icons/lu";

export default function DataTableCustomers() {
  let token = localStorage.getItem("userToken");

  const { searchTerm } = useContext(CartContext);

  // update client
  const [updateClient, setUpdateClient] = useState(false);
  const [clientId, setClientId] = useState(null);
  

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 30;

  function getAllCustomers() {
    return axios.get(`${API_BASE_URL}clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading } = useQuery({
    queryKey: ["AllCustomers"],
    queryFn: getAllCustomers,
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

  // Is Loading
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

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

  return (
    <>
      <div
        className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8 
        pt-4 font-light text-xs rounded-xl mt-16 min-h-[900px]"
      >
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table cellPadding="12" className="w-full border-collapse table-auto">
            <thead className="textColor bg-[#EBEBEB]">
              <tr className="text-left">
                <th className="p-4 rounded-l-xl text-sm font-semibold">ID</th>
                <th className="font-semibold text-sm">Name</th>
                <th className="font-semibold text-sm">Logo</th>
                <th className="font-semibold text-sm rounded-r-xl">Status</th>
              </tr>
            </thead>

            <tbody className="w-full">
              {filteredData && filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-2xl font-bold textColor"
                  >
                    {" "}
                    No Results Found
                  </td>
                </tr>
              ) : (
                currentRows.map((client) => (
                  <tr key={client.id} className="border-b-1 border-[#00000020]">
                    <td className="truncate ps-4 py-4">{client.id}</td>
                    <td
                      onClick={() => {
                        setUpdateClient(true);
                        setClientId(client.id);
                      }}
                      className="truncate textColor cursor-pointer py-4"
                    >
                      {(client?.company || "").split(" ").slice(0, 5).join(" ")}
                      <BiEditAlt className="inline-block" />
                    </td>
                    <td className="truncate py-4">
                      {client.logo ? (
                        <img
                          src={client.logo}
                          className="w-[40px] h-[40px] object-contain"
                        />
                      ) : (
                        <LuImage className="text-2xl textColor" />
                      )}
                    </td>
                    <td className="truncate py-4">
                      <span
                        className={`border py-1 px-2 rounded-md cursor-pointer text-xs ${
                          client.status === "approved"
                            ? "textColor border-gray-400"
                            : "text-red-600 border-red-600"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden">
          {filteredData && filteredData.length === 0 ? (
            <p className="text-center py-8 text-2xl font-bold textColor">
              {" "}
              No Results Found
            </p>
          ) : (
            currentRows.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-4 my-4 space-y-3 shadow-md"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">ID:</span>
                  <span>{client.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Name:</span>
                  <span
                    onClick={() => {
                      setUpdateClient(true);
                      setClientId(client.id);
                    }}
                    className="truncate textColor cursor-pointer"
                  >
                    {client.name} <BiEditAlt className="inline-block" />
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Logo:</span>
                  {client.logo ? (
                    <img
                      src={client.logo}
                      className="w-[40px] h-[40px] object-contain"
                    />
                  ) : (
                    <LuImage className="text-2xl textColor" />
                  )}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`py-1 px-2 rounded-md text-xs ${
                      client.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* update Clients */}
        <UpdateClientDialog
          updateClient={updateClient}
          setUpdateClient={setUpdateClient}
          clientId={clientId}
        />
      </div>

      <div className="w-[93%] mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 mt-8 sm:mt-4">
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} Customers on this Page
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
