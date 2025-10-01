import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import { useFormik } from "formik";

export default function AddSubCategoroy() {
  const token = localStorage.getItem("userToken");
  const queryBrand = useQueryClient();

  // Get All MainCategory
  function getAllMainCategory() {
    return axios.get(`${API_BASE_URL}main-categories`);
  }

  const { data } = useQuery({
    queryKey: ["AllMainCategory"],
    queryFn: getAllMainCategory,
    select: (res) => res.data.data,
  });

  // Add SubCategory
  function AddSubCategoroy(values) {
    axios
      .post(`${API_BASE_URL}sub-categories/create`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Create Sub Categort");
        queryBrand.invalidateQueries(["AllSubCategory"]);
      })
      .catch((err) => {
        toast.error("Error Create Sub Categort");
        console.log(err);
      });
  }

  let formik = useFormik({
    initialValues: {
      main_category_id: "",
      name_en: "",
      name_ar: "",
    },
    onSubmit: AddSubCategoroy,
  });

  return (
    <div className="w-[99%] mx-auto">
    <form onSubmit={formik.handleSubmit} className="h-[500px] flex flex-col justify-between">
        <div className="space-y-4">
          {/*Select mainCategory  */}
          <select
            name="main_category_id"
            onChange={formik.handleChange}
            value={formik.values.main_category_id || ""}
            className="w-full rounded-md p-1 border textColor"
          >
            <option value="">Select Main-Category</option>
            {data?.map((mainCategory) => (
              <option key={mainCategory.id} value={mainCategory.id}>
                {mainCategory.name_en}
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
                className="border my-1 p-1.5 rounded-xl w-full"
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
                className="border my-1 p-1.5 rounded-xl text-right w-full"
                placeholder="الاسم عربى"
              />
            </div>
          </div>
        </div>
        {/* Add MainCategory Button */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
            type="submit"
          >
            Add Sub Category
          </button>
        </div>
      </form>
    </div>
  );
}
