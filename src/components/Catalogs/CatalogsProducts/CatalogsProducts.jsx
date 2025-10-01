import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../../config";
import { useQuery } from "@tanstack/react-query";
import defultProductImage from "../../../assets/Photos/defultProductImage.jpg";
import { GoHeartFill } from "react-icons/go";
import { BsShare } from "react-icons/bs";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
const Dashboard = React.lazy(() => import("../../Dashboard/Dashboard"));
const CatalogsProductsNavbar = React.lazy(() =>
  import("../CatalogsProducts/CatalogsPorductsNavbar")
);

export default function CatalogsProducts() {
  const [wishlist, setWishlist] = useState({});
  let token = localStorage.getItem("userToken");

  let { CatalogsId } = useParams();

  function getCatalogProducts() {
    return axios.get(`${API_BASE_URL}catalogs/show/${CatalogsId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading } = useQuery({
    queryKey: ["CatalogProducts", CatalogsId],
    queryFn: getCatalogProducts,
    select: (data) => data.data.data.products,
  });

  console.log(data);
  

  // Is Loading
  if (isLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center my-12">
        <FaSpinner className="animate-spin text-5xl textColor" />
      </div>
    );
  }

  const handleShare = (e, product) => {
    e.preventDefault(); // ما يروحش على NavLink
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.specification,
        url: window.location.origin + `/CatalogsProducts/${product.id}`,
      });
    } else {
      alert("Sharing not supported in this browser.");
    }
  };
  // wishlist حالة

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section>
      <section>
        <div className="grid grid-cols-[320px_1fr] me-4">
          {/*Slilde bar */}
          <div className="mb-14 me-8">
            <Dashboard />
          </div>

          {/*Navbar */}
          <div>
            <CatalogsProductsNavbar />

            {/* Content */}
            <div className="my-52">
              <div className="w-[90%] flex justify-end items-center gap-8 ms-8 pt-4">
                <p className="text-[#11ADD1] font-semibold">
                  Count : {data?.length}
                </p>
              </div>

              <div className="grid grid-cols-4 mt-8 w-[90%] mx-auto gap-6 me-22">
                {data?.map((product) => {
                  return (
                    <NavLink to={`/ProductDetails/${product.product_id}`}>
                    <div key={product.id}>
                      <div className="shadow-lg bg-white rounded-xl hover:shadow-2xl duration-300 transition-all h-[400px] relative">
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
                            <p className="text-[#11ADD1] my-2 text-sm text-left font-semibold flex-grow">
                              {product?.specification}
                            </p>
                            <div>
                              <p className="textColor text-lg text-left font-bold">
                                {product?.product_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </NavLink>
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
