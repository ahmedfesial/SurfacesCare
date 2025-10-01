import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import defultProductImage from "../../assets/Photos/defultProductImage.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { FaBarcode } from "react-icons/fa";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { FaBox } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaVectorSquare } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import ProductDetailsNavbar from "./ProductDetailsNavbar/ProductDetailsNavbar";
import toast from "react-hot-toast";

export default function ProductDetails() {
  let guest_token = localStorage.getItem("guest_token");
  if (!guest_token) {
    guest_token = crypto.randomUUID();
    localStorage.setItem("guest_token", guest_token);
  }

  let { id } = useParams();

  let token = localStorage.getItem("userToken");

  // get product details
  function getProductDetails() {
    return axios.get(`${API_BASE_URL}products/show/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: getProductDetails,
    select: (data) => data.data.data,
  });

  // Technical Data Sheet
  function technicalData(id) {
  axios.get(`${API_BASE_URL}products/${id}/technical-datasheet`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // دي أهم حاجة
  })
  .then((res) => {
    // اعمل لينك مؤقت للـ Blob اللي راجع
    const fileURL = URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );
    // افتح الـ PDF في Tab جديدة
    window.open(fileURL, "_blank");

    toast.success("Opened Technical Data Sheet");
  })
  .catch(() => {
    toast.error("Error Download");
  });
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
    <section>
      <div className="grid grid-cols-[320px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
          <ProductDetailsNavbar />

          {/* Content */}
          <div className="my-12 md:my-66">
            {/*Main div*/}
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-16 w-[90%] mx-auto">
              {/* Slider image */}
              <div className="w-full  lg:w-[600px] flex flex-col justify-between xl:h-[700px]">
                <div>
                  <div className="w-[400px] h-[400px]">
                    <img
                      src={data?.main_image || defultProductImage}
                      alt="Product Image"
                      className="w-full rounded-lg shadow-lg aspect-square object-cover"
                    />
                  </div>

                  {/*Main Imgaes */}
                  <div className="w-full flex justify-between mt-6 ">
                    {data?.images?.map((image, i) => {
                      // support different shapes: string URL, { image: url }, { url: url }, { path: url }
                      const getImageUrl = (img) => {
                        if (!img) return null;
                        if (typeof img === "string") return img;
                        if (typeof img === "object") {
                          return (
                            img.image || img.url || img.path || img.src || null
                          );
                        }
                        return null;
                      };

                      const imgSrc = getImageUrl(image);

                      return (
                        <div
                          key={i}
                          className="w-24 h-24 object-cover rounded shadow"
                        >
                          <img
                            src={imgSrc || defultProductImage}
                            alt={`Product Image ${i}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/*Details */}
              <div className="w-full lg:w-[500px] bg-[#ffffff] rounded-md  p-8 shadow">
                <div className="w-full mx-auto">
                  <h1
                    lang="en"
                    className="text-3xl textColor md:text-3xl font-bold text-center lg:text-left"
                  >
                    {data?.name_en}
                  </h1>
                  <h1 className="font-semibold textColor mt-8 text-center lg:text-left">
                    Product Features:
                  </h1>
                  <p className="border-b-1 pb-4 text-center lg:text-left">
                    {data?.features}
                  </p>

                  {/* Legend & Color & Cerfication */}
                  <div className="flex flex-wrap justify-center sm:justify-between mt-4 textColor font-semibold gap-4">
                    {/* Certificates */}
                    <div>
                      <h1 className="flex items-center gap-2">Certificates:</h1>
                      <div className="gap-2 mt-2 flex flex-col">
                        {data?.certificates?.map((certificate) => (
                          <div key={certificate.id}>
                            {certificate?.image ? (
                              <div className="w-6 h-6">
                                <img
                                  src={certificate.image}
                                  alt={certificate.name}
                                  className="w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"; // يخفي الصورة
                                    e.currentTarget.parentElement.innerHTML = `<span class="textColor font-light">${certificate.name
                                      .split(" ")
                                      .slice(0, 1)
                                      .join(" ")}</span>`; // يضيف الاسم مكانها
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="">{certificate.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div>
                      <h1 className="flex items-center gap-2">Legend:</h1>
                      <div className="flex flex-col gap-2">
                        {data?.legends?.map((legend) => (
                          <div key={legend.id}>
                            {legend?.image ? (
                              <div className="w-6 h-6">
                                <img
                                  src={legend.image}
                                  alt={legend.name}
                                  className="w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement.innerHTML = `<span class="textColo font-light">${legend.name
                                      .split(" ")
                                      .slice(0, 1)
                                      .join(" ")}</span>`;
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="textColor">{legend.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h1 className="flex items-center gap-2">Color:</h1>
                      <div className="flex gap-2 mt-2 w-full">
                        {data?.main_colors?.map((color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-md border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PDFS */}
                  <div className="my-8">
                    <button
                      onClick={() => window.open(data?.pdf_hs, "_blank")}
                      className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-white   font-semibold transition-all duration-300"
                    >
                      PIS
                    </button>
                    <button
                      onClick={() => window.open(data?.pdf_msds, "_blank")}
                      className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 my-4 cursor-pointer hover:bg-white font-semibold transition-all duration-300"
                    >
                      MSDS
                    </button>

                    {/* Technical Data Sheet */}
                    <button
                      onClick={() => {
                        if (data?.pdf_technical) {
                          // لو فيه لينك PDF
                          window.open(data.pdf_technical, "_blank");
                        } else {
                          // لو مفيش PDF يشغل الـ function
                          technicalData(data?.id);
                        }
                      }}
                      className="backGroundColor text-white w-full py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-white  font-semibold transition-all duration-300"
                    >
                      Technical Data Sheet
                    </button>
                  </div>

                  {/*Table */}
                  <div className="space-y-1">
                    {/* Code */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaBarcode className="text-2xl" />
                        <span>HS Code:</span>
                      </p>
                      <p className="text-right">{data?.hs_code}</p>
                    </div>

                    {/* SKU */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <HiOutlineSquaresPlus className="text-2xl" />
                        <span>SKU:</span>
                      </p>
                      <p className="text-right">{data?.sku}</p>
                    </div>

                    {/* Pick size */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaBox className="text-2xl" />
                        <span>Pack Size:</span>
                      </p>
                      <p className="text-right">{data?.pack_size}</p>
                    </div>

                    {/*Dimensions*/}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaRulerCombined className="text-2xl" />
                        <span>Dimensions:</span>
                      </p>
                      <p className="text-right">{data?.dimensions}</p>
                    </div>

                    {/* Capacity: */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <AiOutlineUnorderedList className="text-2xl" />
                        <span>Capacity:</span>
                      </p>
                      <p className="text-right">{data?.capacity}</p>
                    </div>

                    {/*Specification */}
                    <div className="border text-left w-full textColor mx-auto p-2 grid grid-cols-[auto_1fr] items-center gap-4">
                      <p className="flex items-center gap-2 font-bold">
                        <FaVectorSquare className="text-2xl" />
                        <span>Specification:</span>
                      </p>
                      <p className="text-right">{data?.specification}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
