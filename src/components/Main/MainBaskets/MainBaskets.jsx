import React, { useState } from "react";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import dayjs from "dayjs";

export default function MainBaskets() {
  let token = localStorage.getItem("userToken");

  function getAllBaskets() {
    return axios.get(`${API_BASE_URL}baskets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data } = useQuery({
    queryKey: ["baskets"],
    queryFn: getAllBaskets,
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

  // Activites

  function getAllActivites() {
    return axios.get(`${API_BASE_URL}activities`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: Activites } = useQuery({
    queryKey: ["allActivites"],
    queryFn: getAllActivites,
    select: (data) => data.data,
  });

  // Right paginate
  const [currentPageActive, setCurrentPageActive] = useState(1);
  const rowsPerPageActive = 3;

  let currentRowsActive = [];
  let totalPagesActive = 0;
  let pageNumbersActive = [];

  if (Activites && Activites.length > 0) {
    const indexOfLastRow = currentPageActive * rowsPerPageActive;
    const indexOfFirstRow = indexOfLastRow - rowsPerPageActive;
    currentRowsActive = Activites.slice(indexOfFirstRow, indexOfLastRow);
    totalPagesActive = Math.ceil(Activites.length / rowsPerPageActive);
    pageNumbersActive = Array.from(
      { length: totalPagesActive },
      (_, i) => i + 1
    );
  }

  return (
    <>
      <section>
        <div className="w-[80%] mx-auto px-4 py-2 bg-white rounded-2xl shadow hover:shadow-2xl duration-300 transition-all">
          <h2 className="textColor text-2xl text-center md:text-left md:ms-8 font-semibold pt-6">
            Baskets
          </h2>

          <div className="mt-8 w-full mx-auto">
            {/* Title */}
            <div className="flex xl:w-[60%] md:w-[60%] justify-between text-left">
              <h3 className="textColor ms-10 text-xl">All Baskets</h3>
              <h3 className="textColor md:ms-40 text-xl">Last Baskets</h3>
            </div>

            {/* Main Div */}
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between w-full items-center gap-4 pb-8">
              {/* left Div */}
              <div className="mt-4 w-full lg:w-[45%] mx-auto">
                {/* header */}
                <div className="backGroundColor flex font-light justify-between p-2 items-center text-white rounded-md">
                  <h3 className="ms-4">Basket Name</h3>
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
                    .map((basket) => (
                      <div key={basket.id}>
                        <div className="flex font-light justify-between my-2 mx-4 text-[#525252]">
                          <p>{basket.name}</p>
                          <p>
                            {dayjs(basket.created_at).format("HH:mm DD.MM.YY")}
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
                  <h3 className="ms-4">Basket Name</h3>
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
                    .map((basket) => (
                      <div key={basket.id}>
                        <div className="flex justify-between my-2 mx-4 text-[#525252] font-light">
                          <p>{basket.name}</p>
                          <p>
                            {dayjs(basket.created_at).format("HH:mm DD.MM.YY")}
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
                      setCurrentPageRight((prev) =>
                        prev > 1 ? prev - 1 : prev
                      )
                    }
                    style={{
                      cursor:
                        currentPageRight === 1 ? "not-allowed" : "pointer",
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

      {/*Activites */}
      <section>
        <div className="w-[80%] mx-auto">
          <div className="mt-12 ms-4 border-t-1 w-[99%] text-[#00000030]">
            <h1 className="font-bold text-xl pt-6 text-black">Activites</h1>
          </div>

          <div className="ms-4 mt-4">
            {currentRowsActive?.map((Active) => (
              <div key={Active.id} className="flex my-4">
                <div>
                  <CiSquarePlus className="textColor text-2xl" />
                  <span className="ms-2 textColor">|</span>
                </div>
                <div>
                  <p>{Active?.description}</p>
                  <p className="textColor">{Active?.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination One Number Template */}
          <div
            style={{ marginTop: "10px" }}
            className="text-center pt-4 flex items-center justify-end gap-2"
          >
            {/* زر السهم شمال */}
            <button
              onClick={() =>
                setCurrentPageActive((prev) => (prev > 1 ? prev - 1 : prev))
              }
              style={{
                cursor: currentPageActive === 1 ? "not-allowed" : "pointer",
                opacity: currentPageActive === 1 ? 0.5 : 1,
              }}
              disabled={currentPageActive === 1}
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
              {currentPageActive}
            </span>

            {/* زر السهم يمين */}
            <button
              onClick={() =>
                setCurrentPageActive((prev) =>
                  prev < pageNumbersActive.length ? prev + 1 : prev
                )
              }
              style={{
                cursor:
                  currentPageActive === pageNumbersActive.length
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  currentPageActive === pageNumbersActive.length ? 0.5 : 1,
              }}
              disabled={currentPageActive === pageNumbersActive.length}
            >
              <IoIosArrowForward className="text-[#11ADD1] text-xl" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
