import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaPalette } from "react-icons/fa";

import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import { useFormik } from "formik";

export default function AddMainCategory() {
  const token = localStorage.getItem("userToken");
  const queryBrand = useQueryClient();

  // Get All Brands
  function getAllBrands() {
    return axios.get(`${API_BASE_URL}brands`);
  }

  const { data } = useQuery({
    queryKey: ["AllBrands"],
    queryFn: getAllBrands,
    select: (res) => res.data.data,
  });

  // Add Brnds
  function AddMainCategory(values) {
    const formData = new FormData();
    formData.append("brand_id", values.brand_id);
    formData.append("image_url", values.image_url);
    formData.append("name_en", values.name_en);
    formData.append("name_ar", values.name_ar);
    formData.append("color_code", values.color_code);

    axios
      .post(`${API_BASE_URL}main-categories/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Create Main Categort");
        queryBrand.invalidateQueries(["main-categories"]);
      })
      .catch((err) => {
        toast.error("Error Create Main Categort");
        console.log(err);
      });
  }

  let formik = useFormik({
    initialValues: {
      brand_id: "",
      name_en: "",
      name_ar: "",
      color_code: "",
      image_url: "",
    },
    onSubmit: AddMainCategory,
  });

  return (
    <div className="w-[99%] mx-auto">
      <form onSubmit={formik.handleSubmit} className="h-[500px] flex flex-col justify-between">
        <div className="space-y-4">
          {/*Select Brands  */}
          <select
            name="brand_id"
            onChange={formik.handleChange}
            value={formik.values.brand_id || ""}
            className="w-full rounded-md p-1 border textColor"
          >
            <option value="">Select Brand</option>
            {data?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name_en}
              </option>
            ))}
          </select>

          <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
            <div className="flex flex-col w-full ">
              <label htmlFor="name_en"> Name EN</label>
              <input
                id="name_en"
                value={formik.values.name_en}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="name_en"
                type="text"
                className="border my-1 p-1.5 rounded-md w-full"
                placeholder="Name EN"
              />
            </div>
            <div className="flex flex-col w-full  text-left md:text-right">
              <label className="text-sm" htmlFor="name_ar">
                الاسم عربى
              </label>
              <input
                id="name_ar"
                name="name_ar"
                onChange={formik.handleChange}
                value={formik.values.name_ar}
                onBlur={formik.handleBlur}
                type="text"
                className="border my-1 p-1.5 rounded-md text-right w-full"
                placeholder="الاسم عربى"
              />
            </div>
          </div>
          {/* Cover + Color */}
          <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
            <div className="flex flex-col w-full md:w-1/2">
              <label htmlFor="background_image_url"> Cover</label>
              <input
                id="image_url"
                name="image_url"
                type="file"
                onBlur={formik.handleBlur}
                onChange={(event) =>
                  formik.setFieldValue(
                    "image_url",
                    event.currentTarget.files[0]
                  )
                }
                className="border my-1 p-1.5 rounded-md w-full"
              />
            </div>
            <div className="flex flex-col w-full md:w-1/2 mt-6">
                      <div>
      {/* نخفي الـ input */}
      <input
        id="color_code"
        name="color_code"
        type="color"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.color_code}
        className="hidden"
      />

      {/* الزرار المخصص */}
      <label
        htmlFor="color_code"
        className="cursor-pointer border w-full h-10 my-1 rounded-md flex items-center justify-between px-4 bg-white shadow-sm hover:shadow-md transition"
      >
        <div className="flex items-center gap-2">
          <FaPalette className="text-lg" />
          <span className=" font-medium">Choose Color</span>
        </div>

        <div className="flex items-center gap-3">
          {/* كود HEX */}
          <span className="text-sm font-mono">
            {formik.values.color_code}
          </span>
          {/* اللون المختار */}
          <span
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: formik.values.color_code }}
          ></span>
        </div>
      </label>
    </div>
                    </div>
          </div>
        </div>
        {/* Add MainCategory Button */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
            type="submit"
          >
            Add Main Category
          </button>
        </div>
      </form>
    </div>
  );
}
