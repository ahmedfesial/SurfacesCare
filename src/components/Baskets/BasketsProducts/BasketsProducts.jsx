import axios from "axios";
import React, { useContext, useState } from "react";
import { API_BASE_URL } from "../../../../config";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import defultProductImage from "../../../assets/Photos/defultProductImage.jpg";
import { FaSpinner } from "react-icons/fa";
import { CartContext } from "../../../Context/CartContext";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";
const Dashboard = React.lazy(() => import("../../Dashboard/Dashboard"));
const BasketsProductsNavbar = React.lazy(() =>
  import("./BasketsProductsNavbar/BasketsProductsNavbar")
);

export default function BasketsProducts() {
  let token = localStorage.getItem("userToken");

  let { withPrice, submitMode } = useContext(CartContext);

  let { BasketsId } = useParams();

  // wishlist حالة
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = (e, product) => {
    e.preventDefault(); // ما يروحش على NavLink
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.specification,
        url: window.location.origin + `/ProductDetails/${product.id}`,
      });
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  function getBasketData() {
    return axios.get(`${API_BASE_URL}baskets/show/${BasketsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["BasketProducts", BasketsId],
    queryFn: getBasketData,
    select: (data) => data.data.data.basket_products,
  });

  // Filter products based on submit mode
  const filteredData = submitMode 
    ? data?.filter(product => product.is_selected === true || product.is_selected === 1)
    : data;

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
        <h1 className="text-center font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <section>
      <section>
        <div className="grid grid-cols-[320px_1fr] me-4">
          {/* Sidebar */}
          <div className="mb-14 me-8">
            <Dashboard />
          </div>

          {/* Navbar */}
          <div>
            <BasketsProductsNavbar />

            {/* Content */}
            <div className="my-52">
              <div className="w-[90%] flex justify-end items-center gap-8 ms-8 pt-4">
                <p className="text-[#11ADD1] font-semibold">
                  Count : {filteredData?.length}
                </p>
                {submitMode && (
                  <p className="text-[#1243AF] font-semibold">
                    عرض المنتجات المحددة فقط
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 mt-8 w-[90%] mx-auto gap-6 me-22">
                {filteredData?.map((product) => {
                  return (
                    <div key={product.id}>
                      <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
                        {/* Icons Top Right */}
                        <div className="absolute top-2 right-2 flex gap-3">
                          <button onClick={(e) => handleShare(e, product)}>
                            <BsShare className="text-lg text-gray-600 cursor-pointer hover:text-[#11ADD1]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product.id);
                            }}
                          >
                            <GoHeartFill
                              className={`text-lg cursor-pointer ${
                                wishlist[product.id]
                                  ? "text-red-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>

                        <div className="p-4 w-full flex flex-col flex-grow">
                          <div className="w-full aspect-square overflow-hidden rounded-lg">
                            <img
                              src={product.image_url || defultProductImage}
                              alt="Product Image"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-grow mt-4">

                            {/* Name SubCategory */}
                            <p className="text-[#11ADD1] my-2 text-sm  font-semibold">
                              {product.specification}
                            </p>
                            <p className="text-[#11ADD1] my-2 text-sm  font-semibold">
                              Quantity : {product.quantity}
                            </p>

                            <div>
                              {/* Product Name */}
                              <p className="textColor text-md text-left font-semibold h-[60px] pb-12">
                                {product?.product_name}
                              </p>
                              {/* Product With Price */}
                              <div className="flex items-center justify-between mt-4">
                                {withPrice && (
                                  <p className="textColor text-md font-light">
                                    {product?.price} SAR
                                  </p>
                                )}

                                {/* الزر */}
                                <a
                                  href="#"
                                  className={`text-white backGroundColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 text-center 
      ${withPrice ? "w-[70%]" : "w-full"}`}
                                >
                                  Selected
                                </a>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
