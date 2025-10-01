import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import { useFormik } from "formik";
import * as Dialog from "@radix-ui/react-dialog";

export default function EditSubCategoryModal({ open, onOpenChange, subCategory }) {
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();

  // Get All MainCategory
  function getAllMainCategory() {
    return axios.get(`${API_BASE_URL}main-categories`);
  }

  const { data: mainCategoriesData } = useQuery({
    queryKey: ["AllMainCategory"],
    queryFn: getAllMainCategory,
    select: (res) => res.data.data,
  });

  // Update Sub Category function
  function updateSubCategory(values) {
    axios
      .post(`${API_BASE_URL}sub-categories/update/${subCategory.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Sub Category Updated Successfully");
        queryClient.invalidateQueries(["AllSubCategory"]);
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Error updating sub category");
        console.log(err);
      });
  }

  const formik = useFormik({
    initialValues: {
      main_category_id: "",
      name_en: "",
      name_ar: "",
    },
    onSubmit: updateSubCategory,
  });

  // Update form values when subCategory prop changes
  const updateFormValues = useCallback(() => {
    if (subCategory) {
      formik.setValues({
        main_category_id: subCategory.main_category_id || "",
        name_en: subCategory.name_en || "",
        name_ar: subCategory.name_ar || "",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategory]);

  useEffect(() => {
    updateFormValues();
  }, [updateFormValues]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1243AF]/50 z-40" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto z-50"
          onPointerDownOutside={() => onOpenChange?.(false)}
          onEscapeKeyDown={() => onOpenChange?.(false)}
        >
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1243AF]">Edit Sub Category</h2>
              <Dialog.Close className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </Dialog.Close>
            </div>
            
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
            {mainCategoriesData?.map((mainCategory) => (
              <option key={mainCategory.id} value={mainCategory.id}>
                {mainCategory.name_en}
              </option>
            ))}
          </select>

          <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
            <div className="flex flex-col w-full ">
              <label htmlFor="edit_sub_name_en"> Name EN</label>
              <input
                id="edit_sub_name_en"
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
              <label className="text-sm" htmlFor="edit_sub_name_ar">
                الاسم عربى
              </label>
              <input
                id="edit_sub_name_ar"
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
        
        {/* Update SubCategory Button */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-8 bg-gray-500 text-white rounded-md p-2 cursor-pointer hover:bg-gray-600 duration-300 transition-all"
          >
            Cancel
          </button>
          <button
            className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
            type="submit"
          >
            Update Sub Category
          </button>
        </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
