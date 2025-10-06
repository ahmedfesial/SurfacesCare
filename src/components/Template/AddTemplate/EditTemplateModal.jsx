import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { API_BASE_URL } from "./../../../../config";
import {  FaSpinner } from "react-icons/fa";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { RiDeleteBin6Line } from "react-icons/ri";
import { t } from "i18next";

export default function EditTemplateModal({ 
  isOpen, 
  onClose, 
  template, 
  onUpdate 
}) {
  let token = localStorage.getItem("userToken");
  let queryClient = useQueryClient();
  const [isLoading, setisLoading] = useState(false);
  

  // State for existing images
  const [existingImages, setExistingImages] = useState({
    startImages: [],
    endImages: [],
    productImages: [],
    clientImages: []
  });

  // Fetch template details with images
  function getTemplateDetails() {
    if (!template?.id) return Promise.resolve(null);
    return axios.get(`${API_BASE_URL}templates/${template.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data: templateDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["TemplateDetails", template?.id],
    queryFn: getTemplateDetails,
    select: (data) => data?.data?.template,
    enabled: !!template?.id && isOpen,
  });

  // Update Template
  async function updateTemplate(values) {
    setisLoading(true)
    try {
      // Step 1: Update template basic info
      await axios.put(
        `${API_BASE_URL}templates/update/${template.id}`,
        { 
          name: values.name, 
          description: values.description 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Handle image updates if new images are provided
      const uploadGroup = async (
        images,
        position,
        background_position = null
      ) => {
        if (!images || images.length === 0) return;

        let formData = new FormData();
        formData.append("position", position);
        if (background_position) {
          formData.append("background_position", background_position);
        }
        Array.from(images).forEach((img) => formData.append("images[]", img));

        try {
          await axios.post(
            `${API_BASE_URL}templates/${template.id}/cover-images`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Upload Error 👉", err.response?.data);
          throw err;
        }
      };
      // Upload new images if provided
      if (values.startImages && values.startImages.length > 0) {
        await uploadGroup(values.startImages, "start");
      }
      if (values.endImages && values.endImages.length > 0) {
        await uploadGroup(values.endImages, "end");
      }
      if (values.productImages && values.productImages.length > 0) {
        await uploadGroup(values.productImages, "start", "products");
      }
      if (values.clientImages && values.clientImages.length > 0) {
        await uploadGroup(values.clientImages, "start", "client");
      }

      toast.success("Template updated successfully ✅");
      queryClient.invalidateQueries(["AllTemplate"]);
      onUpdate && onUpdate();
      onClose();
      setisLoading(false)
    } catch {
      toast.error("Error updating template");
      setisLoading(false)
    }
  }

  let formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      startImages: [],
      endImages: [],
      productImages: [],
      clientImages: [],
    },
    onSubmit: updateTemplate,
  });

  // Update form values when template changes
  useEffect(() => {
    if (template) {
      formik.setValues({
        name: template.name || "",
        description: template.description || "",
        startImages: [],
        endImages: [],
        productImages: [],
        clientImages: [],
      });
    }
  }, [template]);

  // Load existing images when template details are fetched
  useEffect(() => {
    if (templateDetails) {
      setExistingImages({
        startImages: templateDetails.start_images || [],
        endImages: templateDetails.end_images || [],
        productImages: templateDetails.product_images || [],
        clientImages: templateDetails.client_images || []
      });
    }
  }, [templateDetails]);

  // Delete existing image
  async function deleteExistingImage(imageId, imageType) {
    try {
      await axios.delete(`${API_BASE_URL}templates/${template.id}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update local state
      setExistingImages(prev => ({
        ...prev,
        [imageType]: prev[imageType].filter(img => img.id !== imageId)
      }));
      
      toast.success("Image deleted successfully");
      queryClient.invalidateQueries(["TemplateDetails", template.id]);
    } catch (err) {
      console.error("Delete image error:", err);
      toast.error("Failed to delete image");
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto z-50">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full mx-auto textColor"
          >
            <Tabs.Root defaultValue="basic">
              <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-[50px] rounded-t-md mb-6 text-[#1243AF]">
                <Tabs.Trigger
                  value="basic"
                  className="py-2 px-4 ms-4 text-sm font-medium border-b-2"
                >
                  {t("Template.Update Template")}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="basic" className="p-4 md:p-6">
                {isLoadingDetails ? (
                  <div className="flex justify-center items-center py-8 gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1243AF]"></div>
                    <span className="ml-2 text-sm text-gray-600">{t("Template.Loading template details")}...</span>
                  </div>
                ) : (
                <div className="w-full mx-auto">
                  {/* Name & Description */}
                  <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
                    <div className="mb-5 w-full">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-light"
                      >
                        {t("Name")}
                      </label>
                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="name"
                        value={formik.values.name}
                        type="text"
                        id="name"
                        className="w-full bg-gray-50 border text-sm rounded-md block p-2.5 focus:outline-none"
                      />
                    </div>

                    <div className="mb-5 w-full">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-light"
                      >
                        {t("Brand.Description")}
                      </label>
                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="description"
                        value={formik.values.description}
                        type="text"
                        id="description"
                        className="w-full bg-gray-50 border text-sm rounded-md block p-2.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Upload Images */}
                  {/*Start Image Cover*/}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-light">
                      {t("Template.Upload Start Images")}
                    </label>
                    
                    {/* Existing Start Images */}
                    {existingImages.startImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2">Current Images:</p>
                        <div className="flex gap-2 flex-wrap">
                          {existingImages.startImages.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image.url || `${API_BASE_URL}${image.path}`}
                                alt={`existing-start-${idx}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => deleteExistingImage(image.id, 'startImages')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <label className="block mb-2 text-sm font-light">
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.currentTarget.files);
                        formik.setFieldValue("startImages", files);
                      }}
                    />
                    {/* Preview New Start Images */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {formik.values.startImages &&
                        Array.from(formik.values.startImages).map(
                          (file, idx) => (
                            <img
                              key={idx}
                              src={URL.createObjectURL(file)}
                              alt={`start-${idx}`}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          )
                        )}
                    </div>
                  </div>

                  {/* End Images Cover */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-light">
                     {t("Template.Upload End Images")}
                    </label>
                    
                    {/* Existing End Images */}
                    {existingImages.endImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2">Current Images:</p>
                        <div className="flex gap-2 flex-wrap">
                          {existingImages.endImages.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image.url || `${API_BASE_URL}${image.path}`}
                                alt={`existing-end-${idx}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => deleteExistingImage(image.id, 'endImages')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <label className="block mb-2 text-sm font-light">
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        formik.setFieldValue("endImages", e.currentTarget.files)
                      }
                    />
                    {/* Preview New End Images */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {formik.values.endImages &&
                        Array.from(formik.values.endImages).map((file, idx) => (
                          <img
                            key={idx}
                            src={URL.createObjectURL(file)}
                            alt={`end-${idx}`}
                            className="w-14 h-14 object-cover rounded-lg border"
                          />
                        ))}
                    </div>
                  </div>

                  {/* Product Image Cover */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-light">
                      {t("Template.Upload Product Image")}
                    </label>
                    
                    {/* Existing Product Images */}
                    {existingImages.productImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2">Current Images:</p>
                        <div className="flex gap-2 flex-wrap">
                          {existingImages.productImages.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image.url || `${API_BASE_URL}${image.path}`}
                                alt={`existing-product-${idx}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => deleteExistingImage(image.id, 'productImages')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <label className="block mb-2 text-sm font-light">
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        formik.setFieldValue(
                          "productImages",
                          e.currentTarget.files
                        )
                      }
                    />
                    {/* Preview New Product Images */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {formik.values.productImages &&
                        Array.from(formik.values.productImages).map(
                          (file, idx) => (
                            <img
                              key={idx}
                              src={URL.createObjectURL(file)}
                              alt={`product-${idx}`}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          )
                        )}
                    </div>
                  </div>

                  {/* Client Image Cover */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-light">
                      {t("Template.Upload Client Image")}
                    </label>
                    
                    {/* Existing Client Images */}
                    {existingImages.clientImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2">Current Images:</p>
                        <div className="flex gap-2 flex-wrap">
                          {existingImages.clientImages.map((image, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={image.url || `${API_BASE_URL}${image.path}`}
                                alt={`existing-client-${idx}`}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => deleteExistingImage(image.id, 'clientImages')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <label className="block mb-2 text-sm font-light">
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        formik.setFieldValue(
                          "clientImages",
                          e.currentTarget.files
                        )
                      }
                    />
                    {/* Preview New Client Images */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {formik.values.clientImages &&
                        Array.from(formik.values.clientImages).map(
                          (file, idx) => (
                            <img
                              key={idx}
                              src={URL.createObjectURL(file)}
                              alt={`client-${idx}`}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          )
                        )}
                    </div>
                  </div>
                </div>
                )}
              </Tabs.Content>
            </Tabs.Root>

            <div className="flex justify-end gap-4 p-4 md:p-6 pt-0">
             
              <button
                type="submit"
                className="px-6 bg-white text-[#1243AF] rounded-md p-2 cursor-pointer hover:bg-[#1243AF] hover:text-white border duration-300 transition-all"
              >
                {isLoading ? (<FaSpinner className="animate-spin text-2xl" />) : t("Template.Update Template")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
