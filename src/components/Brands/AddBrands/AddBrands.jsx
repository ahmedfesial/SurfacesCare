import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { MdOutlineFileUpload } from "react-icons/md";
import { API_BASE_URL } from "../../../../config";
import { FaPalette } from "react-icons/fa";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import AddMainCategory from "./AddMainCategory";
import AddSubCategoroy from "./AddSubCategoroy";
import { useTranslation } from "react-i18next";

export default function AddBrands({ open, onOpenChange }) {

  let {t} = useTranslation();
  const token = localStorage.getItem("userToken");
  const queryBrand = useQueryClient();
  const [tabValue, setTabValue] = useState("basic");

  // Get All Brands

  // Add Brnds
  function AddBrand(values) {
    const formData = new FormData();
    formData.append("logo", values.logo);
    formData.append("background_image_url", values.background_image_url);
    // formData.append("catalog_pdf_url", values.catalog_pdf_url);
    formData.append("name_en", values.name_en);
    formData.append("name_ar", values.name_ar);
    formData.append("short_description_en", values.short_description_en);
    formData.append("short_description_ar", values.short_description_ar);
    formData.append("full_description_en", values.full_description_en);
    formData.append("full_description_ar", values.full_description_ar);
    formData.append("color_code", values.color_code);

    axios
      .post(`${API_BASE_URL}brands/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Create Brands");
        queryBrand.invalidateQueries(["AllBrands"]);
      })
      .catch((err) => {
        toast.error("Error Create Brands");
        console.log(err);
      });
  }

  let formik = useFormik({
    initialValues: {
      logo: "",
      background_image_url: "",
      // catalog_pdf_url: "",
      name_en: "",
      name_ar: "",
      short_description_en: "",
      short_description_ar: "",
      full_description_en: "",
      full_description_ar: "",
      color_code: "",
    },
    onSubmit: AddBrand,
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger className="bg-white flex items-center gap-2 mt-2 text-[#1243AF] px-8 py-1 rounded-md cursor-pointer hover:bg-gray-300 duration-300 transition-all me-6">
        {t("Brand.Add")}  <FaPlus className="text-sm" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1243AF]/50 z-50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto z-50"
          // ده هو اللي بيقفل لو ضغطت برا أو ESC
          onPointerDownOutside={() => onOpenChange?.(false)}
          onEscapeKeyDown={() => onOpenChange?.(false)}
        >
          <Tabs.Root value={tabValue} onValueChange={setTabValue}>
            {/* 🟢 Tabs Header */}
            <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-auto p-2 rounded-t-xl text-[#1243AF]">
              <Tabs.Trigger
                value="basic"
                className="py-2 px-4 text-lg md:text-sm font-medium cursor-pointer 
              
             data-[state=active]:text-[#1243AF] data-[state=active]:font-bold data-[state=active]:border-b"
              >
                {t("Brand.Add Brand")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="settings"
                className="py-2 px-4 text-lg md:text-sm font-medium cursor-pointer 
            data-[state=active]:text-[#1243AF] data-[state=active]:font-bold data-[state=active]:border-b"
              >
                {t("Brand.Add Main-Categories")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="SubCategory"
                className="py-2 px-4 text-lg md:text-sm font-medium cursor-pointer 
              
             data-[state=active]:text-[#1243AF] data-[state=active]:font-bold data-[state=active]:border-b"
              >
                {t("Brand.Add Sub-Categories")}
              </Tabs.Trigger>
            </Tabs.List>

            {/* Brand*/}
            <Tabs.Content value="basic" className="p-4 md:p-6">
              <form onSubmit={formik.handleSubmit} className="h-[500px]">
                <div className="space-y-4">
                  {/* Logo + Name EN/AR */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                    <div className="w-full md:w-[30%] flex flex-col gap-2">
                      <p className="textColor text-sm">{t("Customers.Logo")}</p>
                      <label
                        htmlFor="file-upload"
                        className="textColor border p-2 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF]! hover:text-white! transition font-light w-full"
                      >
                        <div className="flex justify-center items-center w-full">
                          <MdOutlineFileUpload className="text-lg" />
                        </div>
                      </label>
                      <input
                        id="file-upload"
                        name="logo"
                        type="file"
                        onBlur={formik.handleBlur}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "logo",
                            event.currentTarget.files[0]
                          )
                        }
                        className="hidden"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-[35%]">
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
                    <div className="flex flex-col w-full md:w-[35%] text-left md:text-right mt-1">
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

                  {/* Short Descriptions */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                    <div className="flex flex-col w-full md:w-1/2">
                      <label htmlFor="short_description_en">
                        Short Description EN
                      </label>
                      <textarea
                        maxLength={80}
                        id="short_description_en"
                        name="short_description_en"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.short_description_en}
                        className="border my-1 pt-1 ps-2 rounded-md text-sm w-full placeholder:pt-2"
                        placeholder="For Example , Surfaces care company...."
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/2 text-left md:text-right">
                      <label htmlFor="short_description_ar" className="text-sm">
                        الوصف المختصر عربى
                      </label>
                      <textarea
                        maxLength={80}
                        id="short_description_ar"
                        name="short_description_ar"
                        value={formik.values.short_description_ar}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border my-1 rounded-md text-right text-sm pt-1 ps-2 w-full placeholder:p-2"
                        placeholder="مثلا شركة العناية بالاسطح"
                      />
                    </div>
                  </div>

                  {/* Long Descriptions */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">

                    <div className="flex flex-col w-full">
                      <label htmlFor="full_description_en">
                        Long Description EN
                      </label>
                      <textarea
                        id="full_description_en"
                        name="full_description_en"
                        rows={5}
                        value={formik.values.full_description_en}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border my-1 text-sm ps-2 pt-1 rounded-md w-full"
                        placeholder="For Example , Surfaces care company...."
                      />
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">
                      <div className="flex flex-col w-full mt-1">

                      <label htmlFor="full_description_ar" className="text-sm">
                        الوصف عربى
                      </label>
                      <textarea
                        id="full_description_ar"
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

                  </div>

                  {/* Cover + Color */}
                  <div className="w-full flex flex-col md:flex-row gap-4 items-center text-[#1243AF]">

                    {/* Cover */}
                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                      <p className="textColor text-sm">{t("Brand.Cover")}</p>
                      <label
                        htmlFor="file-upload"
                        className="textColor h-12 border p-2 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF]! hover:text-white! transition font-light w-full"
                      >
                        <div className="flex justify-center items-center w-full">
                          <MdOutlineFileUpload className="text-lg" />
                        </div>
                      </label>
                      <input
                        id="file-upload"
                        name="background_image_url"
                        type="file"
                        onBlur={formik.handleBlur}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "background_image_url",
                            event.currentTarget.files[0]
                          )
                        }
                        className="hidden"
                      />
                    </div>

                    {/* Catalog PDF */}
                    {/* <div className="w-full md:w-1/2 flex flex-col gap-2">
                      <p className="textColor text-sm">{t("Brand.Catalog")} PDF</p>
                      <label
                        htmlFor="Catalog-upload"
                        className="textColor h-12 border p-2 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF]! hover:text-white! transition font-light w-full"
                      >
                        <div className="flex justify-center items-center w-full">
                          <MdOutlineFileUpload className="text-lg" />
                        </div>
                      </label>
                      <input
                        id="Catalog-upload"
                        name="catalog_pdf_url"
                        type="file"
                        onBlur={formik.handleBlur}
                        onChange={(event) =>
                          formik.setFieldValue(
                            "catalog_pdf_url",
                            event.currentTarget.files[0]
                          )
                        }
                        className="hidden"
                      />
                    </div> */}

                    {/*Color*/}
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
        className="cursor-pointer border w-full h-12 my-1 rounded-md flex items-center justify-between px-4 bg-white shadow-sm hover:shadow-md transition"
      >
        <div className="flex items-center gap-2">
          <FaPalette className="text-lg" />
          <span className=" font-medium">{t("Brand.Choose Color")}</span>
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
                {/* Add Brand Button */}
                <div className="flex justify-end mt-6 gap-4">
                  <button
                    className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
                    type="submit"
                  >
                    {t("Save")}
                  </button>
                </div>
              </form>
            </Tabs.Content>

            {/* Main-Categories */}
            <Tabs.Content value="settings" className="p-4 md:p-6">
              <AddMainCategory />
            </Tabs.Content>

            {/* Sub-Categories */}
            <Tabs.Content value="SubCategory" className="p-4 md:p-6">
              <AddSubCategoroy /> 
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
