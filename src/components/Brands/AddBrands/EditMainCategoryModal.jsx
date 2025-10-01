/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import { useFormik } from "formik";
import * as Dialog from "@radix-ui/react-dialog";

export default function EditMainCategoryModal({ open, onOpenChange, mainCategory }) {
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState("");

  // Get All Brands
  function getAllBrands() {
    return axios.get(`${API_BASE_URL}brands`);
  }

  const { data: brandsData } = useQuery({
    queryKey: ["AllBrands"],
    queryFn: getAllBrands,
    select: (res) => res.data.data,
  });

  // Update Main Category function
  function updateMainCategory(values) {
    const formData = new FormData();
    
    // Only append image if it's a new file (not empty string)
    if (values.image_url && typeof values.image_url !== 'string') {
      formData.append("image_url", values.image_url);
    }
    
    formData.append("brand_id", values.brand_id);
    formData.append("name_en", values.name_en);
    formData.append("name_ar", values.name_ar);
    formData.append("color_code", values.color_code);

    axios
      .post(`${API_BASE_URL}main-categories/update/${mainCategory.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Main Category Updated Successfully");
        queryClient.invalidateQueries(["AllMainCategory"]);
        onOpenChange(false);
      })
      .catch((err) => {
        toast.error("Error updating main category");
        console.log(err);
      });
  }

  const formik = useFormik({
    initialValues: {
      brand_id: "",
      name_en: "",
      name_ar: "",
      color_code: "",
      image_url: "",
    },
    onSubmit: updateMainCategory,
  });

  // Update form values when mainCategory prop changes
  const updateFormValues = useCallback(() => {
    if (mainCategory) {
      formik.setValues({
        brand_id: mainCategory.brand_id || "",
        name_en: mainCategory.name_en || "",
        name_ar: mainCategory.name_ar || "",
        color_code: mainCategory.color_code || "#000000",
        image_url: mainCategory.image_url || "",
      });
      
      // Set preview image
      setImagePreview(mainCategory.image_url || "");
    }
  }, [mainCategory]);

  useEffect(() => {
    updateFormValues();
  }, [updateFormValues]);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image_url", file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

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
              <h2 className="text-2xl font-bold text-[#1243AF]">Edit Main Category</h2>
              <Dialog.Close className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </Dialog.Close>
            </div>
            
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
            {brandsData?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name_en}
              </option>
            ))}
          </select>

          <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
            <div className="flex flex-col w-full ">
              <label htmlFor="edit_main_name_en"> Name EN</label>
              <input
                id="edit_main_name_en"
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
              <label className="text-sm" htmlFor="edit_main_name_ar">
                الاسم عربى
              </label>
              <input
                id="edit_main_name_ar"
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
          
          {/* Cover + Color */}
          <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
            <div className="flex flex-col w-full md:w-1/2">
              <label htmlFor="edit_main_image_url"> Cover</label>
              <div className="flex flex-col gap-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    className="w-32 h-20 object-cover border rounded"
                  />
                )}
                <input
                  id="edit_main_image_url"
                  name="image_url"
                  type="file"
                  accept="image/*"
                  onBlur={formik.handleBlur}
                  onChange={handleImageChange}
                  className="border my-1 p-1.5 rounded-xl w-full"
                />
              </div>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <label htmlFor="edit_main_color_code"> Color</label>
              <input
                id="edit_main_color_code"
                name="color_code"
                type="color"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.color_code}
                className="border w-full h-12 my-1 rounded-xl"
              />
            </div>
          </div>
        </div>
        
        {/* Update MainCategory Button */}
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
            Update Main Category
          </button>
        </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
