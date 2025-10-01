import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { API_BASE_URL } from "../../../../config";
import { NavLink } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

export default function AllBrandsMain() {

  function getAllCategories() {
    return axios.get(`${API_BASE_URL}brands`);
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllCategories"],
    queryFn: getAllCategories,
    select: (data) => {
      const allBrands = data.data.data;
      return allBrands.filter((brand) => brand.status === 1);
    },
  });

  console.log(data);

  // is Loading
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
      {data?.map((brand) => (
        <div key={brand.id}>
          <NavLink to={`/AllMainCategory/${brand.id}`}>
            <div
              className=" h-auto bg-center bg-cover bg-no-repeat my-4 rounded-2xl p-4"
              style={{
                backgroundImage: `linear-gradient(${brand.color_code}40 ,${brand.color_code}99), url(${brand.background_image_url})`,
              }}
            >
              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 w-[80%] mx-auto h-full">
                <div className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] flex justify-center items-center flex-shrink-0">
                  <img
                    src={`${brand.logo}`}
                    alt="Brand Logo"
                    loading="lazy"
                    className="w-full"
                  />
                </div>
                <div className="flex w-full mx-auto justify-center lg:justify-end items-center">
                  <p
                    lang="en"
                    className="text-white text-sm text-center lg:text-left font-semibold leading-snug w-full lg:w-[50%]"
                  >
                    {brand.short_description_en}
                  </p>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
      ))}
    </section>
  );
}
