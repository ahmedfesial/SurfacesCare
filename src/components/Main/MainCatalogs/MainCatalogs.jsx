import React, { useState } from "react";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import dayjs from "dayjs";

export default function MainCatalogs() {
  let token = localStorage.getItem("userToken");

  function getAllCatalogs() {
    return axios.get(`${API_BASE_URL}catalogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data } = useQuery({
    queryKey: ["catalogs"],
    queryFn: getAllCatalogs,
    select: (data) => data.data.data,
  });

  // left paginate
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

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

  // Right paginate
  const [currentPageRight, setCurrentPageRight] = useState(1);
  const rowsPerPageRight = 3;

  let currentRowsRight = [];
  let totalPagesRight = 0;
  let pageNumbersRight = [];

  if (data && data.length > 0) {
    const indexOfLastRow = currentPageRight * rowsPerPageRight;
    const indexOfFirstRow = indexOfLastRow - rowsPerPageRight;
    currentRowsRight = data.slice(indexOfFirstRow, indexOfLastRow);
    totalPagesRight = Math.ceil(data.length / rowsPerPageRight);
    pageNumbersRight = Array.from({ length: totalPagesRight }, (_, i) => i + 1);
  }

  return (
    <section>
      <div className="w-[80%] mx-auto px-4 py-2 bg-white rounded-2xl shadow hover:shadow-2xl duration-300 transition-all">
        <h2 className="textColor text-2xl text-center md:text-left md:ms-8 font-semibold pt-6">
          Catalogs
        </h2>

        <div className="mt-8 w-full mx-auto">
          {/* Title */}
          <div className="flex flex-col md:flex-row sm:w-[20%] xl:w-[60%] justify-between text-center md:text-left">
            <h3 className="textColor sm:ms-0 xl:ms-10 text-xl w-full md:w-auto">
              All Catalogs
            </h3>
            <h3 className="textColor text-xl w-full md:w-auto mt-4 md:mt-0 ">
              Last Catalogs
            </h3>
          </div>

          {/* Main Div */}
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between w-full items-center gap-4 pb-8">
            {/* left Div */}
            <div className="mt-4 w-full lg:w-[45%] mx-auto">
              {/* header */}
              <div className="backGroundColor flex font-light justify-between p-2 items-center text-white rounded-md">
                <h3 className="ms-4">Catalog Name</h3>
                <h3 className="me-4">Creation Date</h3>
              </div>

              {/* Content */}
              {Array.isArray(currentRows) &&
                currentRows
                  .slice()
                  .sort(
                    (a, b) =>
                      dayjs(b.created_at, "YYYY-MM-DD HH:mm:ss").valueOf() -
                      dayjs(a.created_at, "YYYY-MM-DD HH:mm:ss").valueOf()
                  )
                  .map((catalog) => (
                    <div key={catalog.id}>
                      <div className="flex font-light justify-between my-2 mx-4 text-[#525252]">
                        <p>{catalog.name}</p>
                        <p>
                          {dayjs(catalog.created_at).format("HH:mm DD.MM.YY")}
                        </p>
                      </div>
                    </div>
                  ))}

              {/* Pagination One Number Template */}
              <div className="text-center pt-4 flex items-center justify-end gap-2 mt-4">
                {/* زر السهم شمال */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                  style={{
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                  }}
                  disabled={currentPage === 1}
                >
                  <IoIosArrowBack className="text-[#11ADD1] text-xl" />
                </button>

                {/* رقم الصفحة الحالي */}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#1243AF",
                  }}
                >
                  {currentPage}
                </span>

                {/* زر السهم يمين */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      prev < pageNumbers.length ? prev + 1 : prev
                    )
                  }
                  style={{
                    cursor:
                      currentPage === pageNumbers.length
                        ? "not-allowed"
                        : "pointer",
                    opacity: currentPage === pageNumbers.length ? 0.5 : 1,
                  }}
                  disabled={currentPage === pageNumbers.length}
                >
                  <IoIosArrowForward className="text-[#11ADD1] text-xl" />
                </button>
              </div>
            </div>

            {/* right div */}
            <div className="mt-4 w-full lg:w-[45%] mx-auto">
              {/* header */}
              <div className="backGroundColor flex justify-between font-light items-center p-2 text-white rounded-md">
                <h3 className="ms-4">Catalog Name</h3>
                <h3 className="me-4">Creation Date</h3>
              </div>

              {Array.isArray(currentRowsRight) &&
                currentRowsRight
                  .slice()
                  .sort(
                    (a, b) =>
                      dayjs(a.created_at, "YYYY-MM-DD HH:mm:ss").valueOf() -
                      dayjs(b.created_at, "YYYY-MM-DD HH:mm:ss").valueOf()
                  )
                  .map((catalog) => (
                    <div key={catalog.id}>
                      <div className="flex justify-between my-2 mx-4 text-[#525252] font-light">
                        <p>{catalog.name}</p>
                        <p>
                          {dayjs(catalog.created_at).format("HH:mm DD.MM.YY")}
                        </p>
                      </div>
                    </div>
                  ))}

              {/* Pagination One Number Template */}
              <div
                style={{ marginTop: "10px" }}
                className="text-center pt-4 flex items-center justify-end gap-2"
              >
                {/* زر السهم شمال */}
                <button
                  onClick={() =>
                    setCurrentPageRight((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                  style={{
                    cursor: currentPageRight === 1 ? "not-allowed" : "pointer",
                    opacity: currentPageRight === 1 ? 0.5 : 1,
                  }}
                  disabled={currentPageRight === 1}
                >
                  <IoIosArrowBack className="text-[#11ADD1] text-xl" />
                </button>

                {/* رقم الصفحة الحالي */}
                <span
                  style={{
                    color: "#1243AF",
                    fontWeight: "bold",
                  }}
                >
                  {currentPageRight}
                </span>

                {/* زر السهم يمين */}
                <button
                  onClick={() =>
                    setCurrentPageRight((prev) =>
                      prev < pageNumbersRight.length ? prev + 1 : prev
                    )
                  }
                  style={{
                    cursor:
                      currentPageRight === pageNumbersRight.length
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      currentPageRight === pageNumbersRight.length ? 0.5 : 1,
                  }}
                  disabled={currentPageRight === pageNumbersRight.length}
                >
                  <IoIosArrowForward className="text-[#11ADD1] text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
