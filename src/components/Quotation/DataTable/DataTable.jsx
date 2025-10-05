import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { API_BASE_URL } from "./../../../../config";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { IoCheckboxOutline } from "react-icons/io5";
import { CiSquareRemove } from "react-icons/ci";
import Forward from "./Forward";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { CartContext } from "../../../Context/CartContext";

export default function DataTable() {
  const { t, i18n } = useTranslation();
  let token = localStorage.getItem("userToken");
  const { searchTerm } = useContext(CartContext); 

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const queryClient = useQueryClient();

  // state محلي علشان الأكشنات
  const [localActions, setLocalActions] = useState({});

  function getDataUser() {
    return axios.get(`${API_BASE_URL}profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: userData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getDataUser,
    select: (res) => res.data.data,
  });

  // Call Quotation Requests
  function getAllQuotation() {
    let url =
      userData?.role === "super_admin"
        ? `${API_BASE_URL}quote-requests`
        : `${API_BASE_URL}user/quote-requests`;

    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let {
    data: Quotations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["AllQuotation", userData?.role],
    queryFn: getAllQuotation,
    select: (res) => res.data.data,
    enabled: !!userData?.role,
  });

 let filteredData = Quotations || [];

if (searchTerm && searchTerm.trim().length > 0) {
  const term = searchTerm.toLowerCase();
  filteredData = filteredData.filter((quot) => {
    const clientName = quot.client?.name?.toLowerCase() || "";
    const clientCompany = quot.client?.company?.toLowerCase() || "";
    return (
      clientName.includes(term) ||
      clientCompany.includes(term) ||
      (quot.name_en && quot.name_en.toLowerCase().includes(term)) ||
      (quot.name_ar && quot.name_ar.toLowerCase().includes(term)) ||
      (quot.id && quot.id.toString().includes(term))
    );
  });
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

  // Action quotation
  function approvedQuotation(quote_request_id) {
    axios
      .post(
        `${API_BASE_URL}quote-requests/approve/${quote_request_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Approved");
        setLocalActions((prev) => ({
          ...prev,
          [quote_request_id]: {
            action: "approved",
            user: userData?.name || "Unknown",
          },
        }));
        queryClient.invalidateQueries(["AllQuotation"]);
      })
      .catch(() => {
        toast.error("Error Approved");
      });
  }

  function rejectedQuotation(quote_request_id) {
    axios
      .post(
        `${API_BASE_URL}quote-requests/reject/${quote_request_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Rejected");
        setLocalActions((prev) => ({
          ...prev,
          [quote_request_id]: {
            action: "rejected",
            user: userData?.name || "Unknown",
          },
        }));
        queryClient.invalidateQueries(["AllQuotation"]);
      })
      .catch(() => {
        toast.error("Error");
      });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  // Error state
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
        pt-4 font-light text-xs rounded-xl mt-16 min-h-[900px] "
      >
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table cellPadding="12" className="w-full border-collapse table-auto" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            <thead className="textColor font-light bg-[#EBEBEB]">
              <tr className={i18n.language === "ar" ? "text-right" : "text-left"}>
                <th className={`font-semibold text-sm p-4 ${i18n.language === "ar" ? "rounded-r-xl" : "rounded-l-xl"}`}>
                  {t("Name")}
                </th>
                <th className="font-semibold text-sm">{t("Company")}</th>
                <th className="font-semibold text-sm">{t("Email")}</th>
                <th className="font-semibold text-sm">{t("Telephone")}</th>
                <th className="font-semibold text-sm text-center">{t("Date")}</th>
                <th className="font-semibold text-sm text-center">{t("Forward")}</th>
                <th className={`font-semibold text-sm text-center ${i18n.language === "ar" ? "rounded-l-xl" : "rounded-r-xl"}`}>
                  {t("Action")}
                </th>
              </tr>
            </thead>
            <tbody className="w-full ">
              {currentRows.map((quotation) => {
                const client = quotation.client;
                const localAction = localActions[quotation.id];
                const finalStatus = localAction?.action || quotation.status;
                const finalUser = localAction?.user || userData?.name;

                return (
                  <tr
                    key={quotation.id}
                    className="border-b-1 border-[#00000020]"
                  >
                    <td className={`truncate py-4 px-4 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
                      {client?.name
                        ? client.name.split(" ").slice(0, 2).join(" ")
                        : t("No Name")}
                    </td>
                    <td className={`truncate py-4 px-2 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
                      {client?.company}
                    </td>
                    <td className={`truncate py-4 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
                      {client?.email}
                    </td>
                    <td className={`truncate py-4 ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
                      {client?.phone}
                    </td>
                    <td className="truncate py-4 text-center">
                      {quotation?.created_at ? (
                        <div className="backGroundColor inline-block h-6 justify-center items-center text-white py-1 px-3 rounded-full font-extralight">
                          <span>
                            {dayjs(quotation.created_at).format(
                              "HH:mm, DD.MM.YY"
                            )}
                          </span>
                        </div>
                      ) : (
                        <span>{t("No Quotation")}</span>
                      )}
                    </td>
                    <td className="truncate py-4 text-center">
                      <div
                        className={`${
                          finalStatus !== "pending"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Forward requestId={quotation.id} />
                      </div>
                    </td>
                    <td className="truncate py-4 text-center">
                      <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-center items-center`}>
                        {finalStatus !== "pending" ? (
                          <span
                            className={`border-2 px-2 py-1 rounded-sm font-medium ${
                              finalStatus === "approved"
                                ? "textColor"
                                : "text-red-600"
                            }`}
                          >
                            {finalStatus === "approved"
                              ? `${t("Acc. by")} ${finalUser?.slice(0, 4)}...`
                              : `${t("Reje. by")} ${finalUser?.slice(0, 4)}...`}
                          </span>
                        ) : (
                          <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} gap-3`}>
                            <IoCheckboxOutline
                              className="textColor text-3xl cursor-pointer"
                              onClick={() => approvedQuotation(quotation.id)}
                            />
                            <CiSquareRemove
                              className="text-red-600 text-3xl cursor-pointer"
                              onClick={() => rejectedQuotation(quotation.id)}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
          {currentRows.map((quotation) => {
            const client = quotation.client;
            const localAction = localActions[quotation.id];
            const finalStatus = localAction?.action || quotation.status;
            const finalUser = localAction?.user || userData?.name;

            return (
              <div
                key={quotation.id}
                className="border rounded-lg p-4 my-4 space-y-3 shadow-md"
              >
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                  <span className="font-semibold">{t("Name")}:</span>
                  <span className="truncate">
                    {client?.name
                      ? client.name.split(" ").slice(0, 2).join(" ")
                      : t("No Name")}
                  </span>
                </div>
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                  <span className="font-semibold">{t("Company")}:</span>
                  <span className="truncate">{client?.company}</span>
                </div>
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                  <span className="font-semibold">{t("Email")}:</span>
                  <span className="truncate">{client?.email}</span>
                </div>
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                  <span className="font-semibold">{t("Telephone")}:</span>
                  <span className="truncate">{client?.phone}</span>
                </div>
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between items-center text-sm`}>
                  <span className="font-semibold">{t("Date")}:</span>
                  {quotation?.created_at ? (
                    <div className="backGroundColor inline-block h-6 justify-center items-center text-white py-1 px-3 rounded-full font-extralight">
                      <span>
                        {dayjs(quotation.created_at).format("HH:mm, DD.MM.YY")}
                      </span>
                    </div>
                  ) : (
                    <span>{t("No Quotation")}</span>
                  )}
                </div>
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between items-center text-sm`}>
                  <span className="font-semibold">{t("Forward")}:</span>
                  <div
                    className={`${
                      finalStatus !== "pending"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Forward requestId={quotation.id} />
                  </div>
                </div>
                <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} justify-between items-center text-sm`}>
                  <span className="font-semibold">{t("Action")}:</span>
                  {finalStatus !== "pending" ? (
                    <span
                      className={`border-2 px-2 py-1 rounded-sm font-medium ${
                        finalStatus === "approved"
                          ? "textColor"
                          : "text-red-600"
                      }`}
                    >
                      {finalStatus === "approved"
                        ? `${t("Acc. by")} ${finalUser?.slice(0, 4)}...`
                        : `${t("Reje. by")} ${finalUser?.slice(0, 4)}...`}
                    </span>
                  ) : (
                    <div className={`flex ${i18n.language === "ar" ? "flex-row-reverse" : "flex-row"} gap-3`}>
                      <IoCheckboxOutline
                        className="textColor text-3xl cursor-pointer"
                        onClick={() => approvedQuotation(quotation.id)}
                      />
                      <CiSquareRemove
                        className="text-red-600 text-3xl cursor-pointer"
                        onClick={() => rejectedQuotation(quotation.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Section */}
      <div className={`w-[90%] mx-auto flex flex-col sm:flex-row ${i18n.language === "ar" ? "sm:flex-row-reverse" : "sm:flex-row"} justify-between items-center pb-6 mt-20`} dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {/* User Count */}
        <div className="mt-4">
          <span className="text-sm font-light text-gray-500">
            {currentRows.length} {t("Quotations on this Page")}
          </span>
        </div>

        {/* Tailwind Pagination */}
        <nav aria-label="Page navigation" className={`mt-4 flex ${i18n.language === "ar" ? "justify-start" : "justify-end"}`}>
          <ul className={`inline-flex ${i18n.language === "ar" ? "space-x-px" : "-space-x-px"} text-sm`}>
            {/* Previous */}
            <li>
              <button
                onClick={() =>
                  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                }
                disabled={currentPage === 1}
                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${i18n.language === "ar" ? "rounded-e-lg" : "rounded-s-lg"} ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {t("Previous")}
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
                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${i18n.language === "ar" ? "rounded-s-lg" : "rounded-e-lg"} ${
                  currentPage === pageNumbers.length
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {t("Next")}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
