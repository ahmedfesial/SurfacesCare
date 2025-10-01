import React, { useContext, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
const Navbar = React.lazy(() => import("../Navbar/Navbar"));
import background2 from "../../assets/Photos/background2.png";
import defultProductImage from "../../assets/Photos/defultProductImage.jpg";
import { API_BASE_URL } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { FaBarcode } from "react-icons/fa";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { FaBox } from "react-icons/fa";
import { FaRulerCombined } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaVectorSquare } from "react-icons/fa6";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { CartContext } from "../../Context/CartContext";
import { FiShoppingBag } from "react-icons/fi";

export default function SubProductsDetails() {
  let guest_token = localStorage.getItem("guest_token");
  if (!guest_token) {
    guest_token = crypto.randomUUID();
    localStorage.setItem("guest_token", guest_token);
  }

  const {
    products = {},
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const [localQuantities, setLocalQuantities] = useState({});

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

  function handleIncrease(productId, e) {
    e.preventDefault();
    increaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => ({
          ...prev,
          [productId]:
            (prev[productId] ?? products?.[productId]?.quantity ?? 1) + 1,
        }));
      })
      .catch(() => {
        toast.error("Failed Increase Product Quantity +");
      });
  }
  function handleDecrease(productId, e) {
    e.preventDefault();
    decreaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => {
          const current =
            prev[productId] ?? products?.[productId]?.quantity ?? 1;
          return {
            ...prev,
            [productId]: current > 1 ? current - 1 : 1,
          };
        });
      })
      .catch(() => {
        toast.error("Failed Decrease Product Quantity -");
      });
  }
  // إضافة للعرض
  function addProductToQout(productId, e) {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}guest/cart/add`, {
        guest_token,
        product_id: productId,
      })
      .then(() => {
        toast.success("Add Product To cart");
      })
      .catch(() => {
        toast.error("Failed Add Product To cart");
      });
    toast;
  }

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
      <Navbar />
      {/*Header */}
      <section>
        <div
          className="h-[200px] bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `linear-gradient(#1243AF99) , url(${background2})`,
          }}
        ></div>
      </section>
      <div className="relative">
        <Link to={"/Cart"}>
          <div className="absolute translate-y-[-50%] right-4 md:right-18 backGroundColor text-white rounded-lg">
            <FiShoppingBag className="text-5xl md:text-7xl p-2 font-light" />
          </div>
        </Link>
      </div>
      <div>
        {/* <SubProductsDetailsNavbar/> */}

        {/* Content */}
        <div className="my-12 md:my-24">
          {/*Main div*/}
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-16 w-[90%] mx-auto">
            {/* Slider image */}
            <div className="w-full  lg:w-[600px] flex flex-col justify-between xl:h-[700px]">
              <div>
                <div>
                  <img
                    src={data?.main_image || defultProductImage}
                    alt="Product Image"
                    className="w-full rounded-lg shadow-lg aspect-square object-cover"
                  />
                </div>
                <div>
                  {data?.images?.map((image, i) => {
                    const getImageUrl = (img) => {
                      if (!img) return null;
                      if (typeof img === "string") return img;
                      if (typeof img === "object") {
                        return img.image || img.url || img.path || img.src || null;
                      }
                      return null;
                    };

                    const imgSrc = getImageUrl(image);

                    return (
                      <div key={i}>
                        <img src={imgSrc || defultProductImage} alt={`Product Image ${i}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 xl:mt-0">
                <div className="flex  gap-2 mt-2">
                  <button
                    onClick={(e) => addProductToQout(data?.id, e)}
                    className={`backGroundColor border cursor-pointer hover:bg-white! hover:text-[#1243AF]! duration-300 transition-all w-full flex items-center py-2 gap-2 justify-center rounded-lg text-white`}
                  >
                    Add Quot
                  </button>
                  <div className="flex items-center justify-center">
                    <button
                      className="backGroundColor cursor-pointer text-white inline-flex items-center justify-center text-sm font-medium h-9 w-9 rounded-lg hover:scale-110 transition-all duration-300"
                      onClick={(e) => handleDecrease(data?.id, e)}
                    >
                      <svg
                        className="w-3 h-3 font-bold"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 18 2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M1 1h16" />
                      </svg>
                    </button>
                    <span className="textColor mx-2">
                      {localQuantities[data?.id] ??
                        products?.[data?.id]?.quantity ??
                        1}
                    </span>
                    <button
                      className="backGroundColor cursor-pointer text-white inline-flex items-center justify-center text-sm font-medium h-9 w-9 rounded-lg hover:scale-110 transition-all duration-300"
                      onClick={(e) => handleIncrease(data?.id, e)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 1v16M1 9h16" />
                      </svg>
                    </button>
                  </div>
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
                    <div className="flex gap-2 mt-2">
                      {data?.certificates?.map((certificates) => (
                        <div key={certificates.id}>
                          {certificates?.image ? (
                            <>
                              <div className="w-6 h-6">
                                <img
                                  src={certificates.image}
                                  className="w-full"
                                  alt={certificates.name}
                                />
                              </div>
                            </>
                          ) : (
                            <span className="textColor">
                              {certificates.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div>
                    <h1 className="flex items-center gap-2">Legends:</h1>
                    <div className="flex gap-2 mt-2">
                      {data?.legends?.map((legend) => (
                        <div key={legend.id}>
                          {legend?.image ? (
                            <>
                              <div className="w-6 h-6">
                                <img src={legend.image} alt={legend.name} />
                              </div>
                            </>
                          ) : (
                            <span className="textColor">{legend.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h1 className="flex items-center gap-2">Color:</h1>
                    <div className="flex gap-2 mt-2">
                      {data?.main_colors?.map((color, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-md"
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
    </section>
  );
}
