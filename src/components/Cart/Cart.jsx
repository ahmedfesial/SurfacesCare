import React, { useContext, useState } from "react";
import background2 from "../../assets/Photos/background2.png";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import defultProductImage from "../../assets/Photos/defultProductImage.jpg";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
import AddQuotation from "./AddQuotation";
import Footer from "../Footer/Footer";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";

export default function Cart() {
  const { increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const [localQuantities, setLocalQuantities] = useState({});

  let guest_token = localStorage.getItem("guest_token");
  if (!guest_token) {
    guest_token = crypto.randomUUID();
    localStorage.setItem("guest_token", guest_token);
  }

  // Get All Products
  function getAllProducts() {
    console.log("🌐 Making API request to:", `${API_BASE_URL}guest/cart/${guest_token}`);
    return axios.get(`${API_BASE_URL}guest/cart/${guest_token}`)
      .then(response => {
        console.log("✅ API Response received:", response);
        console.log("📊 Response data:", response.data);
        console.log("📋 Response data type:", typeof response.data);
        return response;
      })
      .catch(error => {
        console.error("❌ API Error:", error);
        console.error("📊 Error response:", error.response);
        throw error;
      });
  }

  let { data, isLoading, error } = useQuery({
    queryKey: ["AllCarts"],
    queryFn: getAllProducts,
    select: (data) => data.data,
  });
  
  // Enhanced debugging
  console.log("🔍 Cart Debug:");
  console.log("📊 Data:", data);
  console.log("📈 Data type:", typeof data);
  console.log("📋 Data isArray:", Array.isArray(data));
  console.log("📏 Data length:", data?.length);
  console.log("⏳ Loading:", isLoading);
  console.log("❌ Error:", error);
  console.log("🔑 Guest token:", guest_token);

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

  // زيادة الكمية
  function handleIncrease(productId) {
    increaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => ({
          ...prev,
          [productId]: (prev[productId] ?? 1) + 1,
        }));
        toast.success("Item quantity updated (+1)");
      })
      .catch(() => {
        toast.error("Error");
      });
  }
  // تقليل الكمية
  function handleDecrease(productId) {
    decreaseQuantity(productId)
      .then(() => {
        setLocalQuantities((prev) => {
          const current = prev[productId] ?? 1;
          return {
            ...prev,
            [productId]: current > 1 ? current - 1 : 1,
          };
        });
        toast.success("Item quantity updated (-1)");
      })
      .catch(() => {
        toast.error("Error");
      });
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

      {/* Cart Items */}
      <section className="pb-10 md:pb-20">
        <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto mt-10 text-white">
          <h1 className="bg-[#CB0022] text-xl md:text-2xl font-bold p-4 rounded-xl text-center w-full">
            PRODUCTS CART
          </h1>
        </div>
      </section>

      {/* Get Products */}
      <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto border py-8 rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 textColor h-full">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="text-lg">Loading cart items...</div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-8">
            <div className="text-red-500 text-lg">Error loading cart: {error.message}</div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="text-lg">Your cart is empty</div>
          </div>
        ) : (
          data?.map((product) => {
          return (
            <div key={product.id}>
              <div className="ms-4 shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
                {/* Icons Top Right */}
                <div className="absolute top-2 right-2 flex gap-3 z-10">
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
                        wishlist[product.id] ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 w-full flex flex-col flex-grow">
                  <div className="w-full aspect-square overflow-hidden rounded-lg">
                    <img
                      src={product.main_image || defultProductImage}
                      alt="Product Image"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow mt-4">
                    <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                      {product?.product?.specification}
                    </p>
                    <div>
                      <p className="textColor text-md text-left font-semibold h-[60px] pb-12">
                        {product?.product?.name_en}
                      </p>

                      <div className="py-1 flex items-center justify-center mt-4">
                        <span className="py-1 rounded-md me-4 text-lg border w-[60%] text-center">
                          Selected
                        </span>
                        <button
                          onClick={() => handleDecrease(product.id)}
                          className="backGroundColor mb-1 cursor-pointer text-white inline-flex items-center justify-center me-2 text-sm font-medium h-6 py-4 w-6 rounded-lg hover:scale-110 transition-all duration-300"
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

                        <span className="textColor">
                          {localQuantities[product.id] ?? product.quantity ?? 1}
                        </span>

                        <button
                          onClick={() => handleIncrease(product.id)}
                          className="backGroundColor mb-1 cursor-pointer text-white inline-flex items-center justify-center ms-2 text-sm font-medium h-6 py-4 w-6 rounded-lg hover:scale-110 transition-all duration-300"
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
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* Request Quotation  */}
      <div className="w-[90%] md:w-[70%] mx-auto flex justify-center my-14">
        <AddQuotation products={data ?? []} localQuantities={localQuantities} />
      </div>

      <Footer />
    </section>
  );
}
