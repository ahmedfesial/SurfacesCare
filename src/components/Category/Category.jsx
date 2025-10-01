import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { FaSpinner } from "react-icons/fa";

export default function Category() {
  let token = localStorage.getItem("userToken");

  function getAllCategories() {
    return axios.get(`${API_BASE_URL}brands`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllCategories"],
    queryFn: getAllCategories,
    select: (data) => {
      const allBrands = data.data.data;
      return allBrands.filter((brand) => brand.status === 1);
    },
  });

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
        <h1 className="text-center font-bold">{error}</h1>
      </div>
    );
  }

  return (
    <section className="overflow-x-hidden">
      <div className="pt-8 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[85%] 2xl:w-[90%] mx-auto">
        {data?.map((brand) => (
          <div key={brand.id} className="my-6">
            <NavLink to={`/MainCategory/${brand.id}`}>
              <div
                className="h-auto w-full bg-center bg-cover bg-no-repeat rounded-md p-6 shadow"
                style={{
                  backgroundImage: `linear-gradient(${brand.color_code}40 ,${brand.color_code}99), url(${brand.background_image_url})`,
                }}
              >
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full h-full">
                  {/* Logo */}
                  <div className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] flex justify-center items-center flex-shrink-0">
                    <img
                      src={brand.logo}
                      alt="Brand Logo"
                      loading="lazy"
                      className="w-full h-full object-contain max-w-full"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex-1 flex justify-center lg:justify-end items-center">
                    <p
                      lang="en"
                      className="text-white text-sm text-center lg:text-left font-semibold leading-snug max-w-[600px]"
                    >
                      {brand.short_description_en}
                    </p>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  );
}
