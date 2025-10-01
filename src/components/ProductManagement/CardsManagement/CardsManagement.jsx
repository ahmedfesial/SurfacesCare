import React, { useState } from "react";
import defultProductImage from "../../../assets/Photos/defultProductImage.jpg";
import { NavLink } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { LuDelete } from "react-icons/lu";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";
import toast from "react-hot-toast";
import EditProductModal from "../EditModelProduct/EditModelProduct";

export default function CardsManagement({ filteredProducts }) {

  let token = localStorage.getItem("userToken");

  let queryClient = useQueryClient();

  // Get All Products
  function getAllProducts() {
    return axios.get(`${API_BASE_URL}products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllProducts"],
    queryFn: getAllProducts,
    select: (data) => data.data.data.data,
  });

  // Delete Product
  function deleteProduct(id) {
    axios
      .delete(`${API_BASE_URL}products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Product Deleted Successfully");
        queryClient.invalidateQueries(["AllProducts"]);
      })
      .catch(() => {
        toast.error("Something went wrong while deleting the product");
      });
  }

  const handleShare = (e, product) => {
    e.preventDefault(); // ما يروحش على NavLink
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.specification,
        url: window.location.origin + `/ProductManagement/${product.id}`,
      });
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  // wishlist حالة
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
        <h1 className="text-center font-bold">{error.message}</h1>
      </div>
    );
  }

    // Build the list to show: start from filter or all, then restrict to basket if requested
   let productsToShow = Array.isArray(filteredProducts) ? filteredProducts : data || [];


  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 my-12 py-8 w-[90%] mx-auto gap-6">
        {productsToShow?.map((product) => (
          <div key={product.id}>
            <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
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
                <NavLink to={`/ProductDetails/${product.id}`}>
                  <div className="w-full aspect-square overflow-hidden rounded-lg">
                    <img
                      className="w-full h-full object-cover"
                      src={product.image_url || defultProductImage}
                      alt="product image"
                    />
                  </div>
                </NavLink>

                <div className="px-2 py-4 flex flex-col flex-grow">
                  <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                    {product.specification}
                  </p>
                  <span className="text-md font-semibold tracking-tight textColor flex-grow">
                    {product.name_en
                      ? product.name_en.split(" ").slice(0, 4).join(" ")
                      : "No Name"}
                  </span>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <NavLink
                      to={`/UpdateProduct/${product.id}`}
                      className="backGroundColor text-sm p-2 w-full flex items-center gap-2 justify-center rounded-md text-white hover:bg-[#1243AF] border hover:text-white cursor-pointer"
                    >
                      Edit <FaPencilAlt className="text-sm" />
                    </NavLink>
                    <p
                      onClick={(e) => {
                        e.preventDefault();
                        deleteProduct(product.id);
                      }}
                      className="bg-[#FF0000] text-sm p-2 w-full flex items-center gap-2 justify-center rounded-md text-white hover:bg-white border hover:text-[#FF0000] cursor-pointer"
                    >
                      Delete <LuDelete />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <NavLink to={`/CreateProduct`}>
          <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-full flex flex-col relative">
            <div className="w-full aspect-square flex justify-center h-full items-center">
              <div className="textColor border w-[90%] h-[90%] flex justify-center items-center rounded-xl">
                <span className="text-4xl textColor">+</span>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    </section>
  );
}
