/* eslint-disable react-hooks/exhaustive-deps */
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaPalette , FaSpinner } from "react-icons/fa";
import { API_BASE_URL } from "../../../../config";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import EditMainCategoryModal from "./EditMainCategoryModal";
import EditSubCategoryModal from "./EditSubCategoryModal";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";

export default function EditBrandModal({ open, onOpenChange, brand }) {
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();
  const [logoPreview, setLogoPreview] = useState("");
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const [tabValue, setTabValue] = useState("basic");
  const [editMainCategoryModalOpen, setEditMainCategoryModalOpen] =
    useState(false);
  const [editSubCategoryModalOpen, setEditSubCategoryModalOpen] =
    useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  

  // Get All Main Categories for this brand
  function getMainCategoriesForBrand() {
    return axios.get(`${API_BASE_URL}main-categories`);
  }

  const { data: allMainCategoriesData } = useQuery({
    queryKey: ["AllMainCategories"],
    queryFn: getMainCategoriesForBrand,
    select: (res) => res.data.data,
  });

  // Filter main categories to show only those belonging to the selected brand
  const mainCategoriesData = allMainCategoriesData?.filter(
    (category) => category.brand_id === brand?.id
  );

  // Get All Sub Categories for this brand's main categories
  function getSubCategoriesForBrand() {
    return axios.get(`${API_BASE_URL}sub-categories`);
  }

  const { data: allSubCategoriesData } = useQuery({
    queryKey: ["AllSubCategories"],
    queryFn: getSubCategoriesForBrand,
    select: (res) => res.data.data,
  });

  // Filter sub categories to show only those belonging to this brand's main categories
  const subCategoriesData = allSubCategoriesData?.filter((subCategory) => {
    // Check if this sub category belongs to any main category of the selected brand
    return mainCategoriesData?.some(
      (mainCategory) => mainCategory.id === subCategory.main_category_id
    );
  });

  // Update Brand function
  function updateBrand(values) {
    setisLoading(true)
    const formData = new FormData();

    // Only append files if they are new files (not empty strings)
    if (values.logo && typeof values.logo !== "string") {
      formData.append("logo", values.logo);
    }
    if (
      values.background_image_url &&
      typeof values.background_image_url !== "string"
    ) {
      formData.append("background_image_url", values.background_image_url);
    }

    formData.append("name_en", values.name_en);
    formData.append("name_ar", values.name_ar);
    formData.append("short_description_en", values.short_description_en);
    formData.append("short_description_ar", values.short_description_ar);
    formData.append("full_description_en", values.full_description_en);
    formData.append("full_description_ar", values.full_description_ar);
    formData.append("color_code", values.color_code);

    axios
      .post(`${API_BASE_URL}brands/update/${brand.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Brand Updated Successfully");
        queryClient.invalidateQueries(["AllBrands"]);
        onOpenChange(false);
        setisLoading(false)
      })
      .catch(() => {
        toast.error("Error updating brand");
        setisLoading(false)
      });
  }

  const formik = useFormik({
    initialValues: {
      logo: "",
      background_image_url: "",
      name_en: "",
      name_ar: "",
      short_description_en: "",
      short_description_ar: "",
      full_description_en: "",
      full_description_ar: "",
      color_code: "",
    },
    onSubmit: updateBrand,
  });

  // Update form values when brand prop changes
  useEffect(() => {
    if (brand) {
      formik.setValues({
        logo: brand.logo || "",
        background_image_url: brand.background_image_url || "",
        name_en: brand.name_en || "",
        name_ar: brand.name_ar || "",
        short_description_en: brand.short_description_en || "",
        short_description_ar: brand.short_description_ar || "",
        full_description_en: brand.full_description_en || "",
        full_description_ar: brand.full_description_ar || "",
        color_code: brand.color_code || "#000000",
      });

      // Set preview images
      setLogoPreview(brand.logo || "");
      setBackgroundPreview(brand.background_image_url || "");
    }
  }, [brand]);

  // Handle file changes
  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("logo", file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("background_image_url", file);
      const reader = new FileReader();
      reader.onload = (e) => setBackgroundPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1243AF]/50 z-50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto z-50"
          onPointerDownOutside={() => onOpenChange?.(false)}
          onEscapeKeyDown={() => onOpenChange?.(false)}
        >
          <Tabs.Root value={tabValue} onValueChange={setTabValue}>
            {/* Tabs Header */}
            <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-auto p-2 rounded-t-xl text-[#1243AF]">
              <Tabs.Trigger
                value="basic"
                className="py-2 px-4 text-lg md:text-sm font-medium cursor-pointer 
                data-[state=active]:text-[#1243AF] data-[state=active]:font-bold data-[state=active]:border-b"
              >
                {t("Brand.Update Brand")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="main-categories"
                className="py-2 px-4 text-lg md:text-sm font-medium cursor-pointer 
                data-[state=active]:text-[#1243AF] data-[state=active]:font-bold data-[state=active]:border-b"
              >
                {t("Brand.Edit Main Category")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="sub-categories"
                className="py-2 px-4 text-lg md:text-sm font-medium cursor-pointer 
                data-[state=active]:text-[#1243AF] data-[state=active]:font-bold data-[state=active]:border-b"
              >
                {t("Brand.Edit Sub Category")}
              </Tabs.Trigger>
            </Tabs.List>

            {/* Brand Update Tab */}
            <Tabs.Content value="basic" className="p-4 md:p-6">
              <form onSubmit={formik.handleSubmit} className="h-[500px]">
                <div className="space-y-4">
                  {/* Logo + Name EN/AR */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                    <div className="w-full md:w-[30%] flex flex-col gap-2">
                      <p className="textColor text-sm">{t("Customers.Logo")}</p>
                      <div className="flex flex-col gap-2">
                        {logoPreview && (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-10 h-10 object-contain border rounded"
                          />
                        )}
                        <label
                          htmlFor="edit-logo-upload"
                          className="textColor border p-2 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF] hover:text-white transition font-light w-full"
                        >
                          <div className="flex justify-center items-center w-full">
                            <MdOutlineFileUpload className="text-lg" />
                          </div>
                        </label>
                        <input
                          id="edit-logo-upload"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onBlur={formik.handleBlur}
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full md:w-[35%] mt-13">
                      <label htmlFor="edit_name_en"> Name EN</label>
                      <input
                        id="edit_name_en"
                        value={formik.values.name_en}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="name_en"
                        type="text"
                        className="border my-1 p-1 rounded-md w-full"
                        placeholder="Name EN"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-[35%] text-left md:text-right mt-13">
                      <label className="text-sm" htmlFor="edit_name_ar">
                        الاسم عربى
                      </label>
                      <input
                        id="edit_name_ar"
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

                  {/* Short Descriptions */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                    <div className="flex flex-col w-full md:w-1/2">
                      <label htmlFor="edit_short_description_en">
                        Short Description EN
                      </label>
                      <textarea
                        maxLength={80}
                        id="edit_short_description_en"
                        name="short_description_en"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.short_description_en}
                        className="border my-1 pt-1 ps-2 rounded-md text-sm w-full"
                        placeholder="For Example , Surfaces care company...."
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/2 text-left md:text-right">
                      <label
                        htmlFor="edit_short_description_ar"
                        className="text-sm"
                      >
                        الوصف المختصر عربى
                      </label>
                      <textarea
                        maxLength={80}
                        id="edit_short_description_ar"
                        name="short_description_ar"
                        value={formik.values.short_description_ar}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border my-1 rounded-md text-right text-sm pt-1 ps-2 w-full"
                        placeholder="مثلا شركة العناية بالاسطح"
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                    {/* Long Descriptions EN*/}
                    <div className="flex flex-col w-full md:w-1/2">
                      <label htmlFor="edit_full_description_en">
                        Long Description EN
                      </label>
                      <textarea
                        id="edit_full_description_en"
                        name="full_description_en"
                        rows={5}
                        value={formik.values.full_description_en}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border my-1 text-sm ps-2 pt-1 rounded-md w-full"
                        placeholder="For Example , Surfaces care company...."
                      />
                    </div>

                    {/*Long Descriptions AR*/}
                    <div className="flex flex-col w-full md:w-1/2 text-left md:text-right">
                      <label
                        htmlFor="edit_full_description_ar"
                        className="text-sm"
                      >
                        الوصف عربى
                      </label>
                      <textarea
                        id="edit_full_description_ar"
                        name="full_description_ar"
                        value={formik.values.full_description_ar}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={5}
                        className="border my-1 text-sm ps-2 pt-1 rounded-md w-full"
                        placeholder="الوصف المختصر عربى"
                      />
                    </div>
                  </div>

                  {/* Cover + Color */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                    <div className="flex flex-col w-full md:w-1/2">
                      <label htmlFor="edit_background_image_url">
                        {t("Brand.Cover")}
                      </label>
                      <div className="flex flex-col gap-2">
                        {backgroundPreview && (
                          <img
                            src={backgroundPreview}
                            alt="Background preview"
                            className="w-15 h-15 object-cover border rounded"
                          />
                        )}
                        <input
                          id="edit_background_image_url"
                          name="background_image_url"
                          type="file"
                          accept="image/*"
                          onBlur={formik.handleBlur}
                          onChange={handleBackgroundChange}
                          className="border my-1 p-1.5 rounded-md w-full"
                        />
                      </div>
                    </div>

                    {/*Color  */}
                    <div className="flex flex-col w-full md:w-1/2">
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
                          className="cursor-pointer border w-full mt-23 h-10 my-1 rounded-md flex items-center justify-between px-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-center gap-2">
                            <FaPalette className="text-lg" />
                            <span className=" font-medium">
                              {t("Brand.Choose Color")}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* كود HEX */}
                            <span className="text-sm font-mono">
                              {formik.values.color_code}
                            </span>
                            {/* اللون المختار */}
                            <span
                              className="w-6 h-6 rounded-full border"
                              style={{
                                backgroundColor: formik.values.color_code,
                              }}
                            ></span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Brand Button */}
                <div className="flex justify-end mt-6 gap-4 pb-8">
                  <button
                    className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
                    type="submit"
                  >
                     {isLoading ? (<FaSpinner className="animate-spin text-2xl" />) : t("Brand.Update Brand")}
                  </button>
                </div>
              </form>
            </Tabs.Content>

            {/* Main Categories Tab */}
            <Tabs.Content value="main-categories" className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    Main categories for <strong>{brand?.name_en}</strong>
                  </p>
                </div>

                {mainCategoriesData && mainCategoriesData.length > 0 ? (
                  <div className="space-y-3">
                    {mainCategoriesData.map((category) => (
                      <div
                        key={category.id}
                        className="bg-gray-50 p-4 rounded-lg textColor shadow-lg flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          {category.image_url && (
                            <img
                              src={category.image_url}
                              alt={category.name_en}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-[#1243AF]">
                              {category.name_en}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {category.name_ar}
                            </p>
                            {category.color_code && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  Color:
                                </span>
                                <div
                                  className="w-4 h-4 rounded border"
                                  style={{
                                    backgroundColor: category.color_code,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedMainCategory(category);
                            setEditMainCategoryModalOpen(true);
                          }}
                          className="px-4 py-2 bg-[#1243AF] text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          {t("Brand.Edit")}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">
                      No main categories found for{" "}
                      <strong>{brand?.name_en}</strong>.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add main categories first to manage them here.
                    </p>
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Sub Categories Tab */}
            <Tabs.Content value="sub-categories" className="p-4 md:p-6">
              <div className="space-y-4">
                {subCategoriesData && subCategoriesData.length > 0 ? (
                  <div className="space-y-3">
                    {subCategoriesData.map((subCategory) => {
                      // Find the main category name for this sub category
                      const mainCategory = mainCategoriesData?.find(
                        (mc) => mc.id === subCategory.main_category_id
                      );
                      return (
                        <div
                          key={subCategory.id}
                          className="bg-gray-50 p-4 rounded-lg shadow-lg flex textColor justify-between items-center"
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-[#1243AF]">
                                {subCategory.name_en}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {subCategory.name_ar}
                              </p>
                              <p className="text-xs text-gray-500">
                                Main Category:{" "}
                                {mainCategory?.name_en || "Unknown"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedSubCategory(subCategory);
                              setEditSubCategoryModalOpen(true);
                            }}
                            className="px-4 py-2 bg-[#1243AF] text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            {t("Brand.Edit")}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">
                      No sub categories found for{" "}
                      <strong>{brand?.name_en}</strong>.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add main categories first, then sub categories will appear
                      here.
                    </p>
                  </div>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Edit Main Category Modal */}
      <EditMainCategoryModal
        open={editMainCategoryModalOpen}
        onOpenChange={setEditMainCategoryModalOpen}
        mainCategory={selectedMainCategory}
      />

      {/* Edit Sub Category Modal */}
      <EditSubCategoryModal
        open={editSubCategoryModalOpen}
        onOpenChange={setEditSubCategoryModalOpen}
        subCategory={selectedSubCategory}
      />
    </Dialog.Root>
  );
}
