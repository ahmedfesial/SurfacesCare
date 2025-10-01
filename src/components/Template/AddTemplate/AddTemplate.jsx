import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { API_BASE_URL } from "./../../../../config";
import { useFormik } from "formik";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AddTemplate() {
  let token = localStorage.getItem("userToken");

  let queryClient = useQueryClient();

  // Create Template
  async function createTemplate(values) {
    try {
      // Step 1: create template
      const { data } = await axios.post(
        `${API_BASE_URL}templates/create`,
        { name: values.name, description: values.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const templateId = data.template_id;
      if (!templateId) throw new Error("Template ID not found");

      // Step 2: upload images groups
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
            `${API_BASE_URL}templates/${templateId}/cover-images`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Upload Error 👉", err.response?.data);
          throw err;
        }
      };

      // Start images
      await uploadGroup(values.startImages, "start");
      // End images
      await uploadGroup(values.endImages, "end");

      await uploadGroup(values.productImages, "start", "products");

      await uploadGroup(values.clientImages, "start", "client");

      toast.success("Template created successfully ✅");
      queryClient.invalidateQueries(["AllTemplates"]);
    } catch (err) {
      console.error("Main Error 👉", err.response?.data || err.message);
      toast.error("Error creating template ❌");
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
    onSubmit: createTemplate,
  });

  return (
    <Dialog.Root>
      {/*Button Add*/}
      <Dialog.Trigger className="bg-white flex items-center gap-2 text-[#1243AF] px-8 py-1 rounded-md mt-2 cursor-pointer hover:bg-gray-300 duration-300 transition-all z-40">
        Add Template <FaPlus className="text-sm" />
      </Dialog.Trigger>

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
                  className="py-2 px-4 ms-4 text-sm font-medium border-b-2 "
                >
                  Add Template
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="basic" className="p-4 md:p-6">
                <div className="w-full mx-auto">
                  {/* Name & Description */}
                  <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
                    <div className="mb-5 w-full">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-light"
                      >
                        Name
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
                        Description
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
                      Upload Start Images
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.currentTarget.files);
                        formik.setFieldValue("startImages", files);
                      }}
                    />
                    {/* Preview Start Images */}
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
                      Upload End Images
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        formik.setFieldValue("endImages", e.currentTarget.files)
                      }
                    />
                    {/* Preview Start Images */}
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
                      Upload Product Images
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
                    {/* Preview Start Images */}
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
                      Upload Client Images
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
                    {/* Preview Start Images */}
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
              </Tabs.Content>
            </Tabs.Root>

            <div className="flex justify-end p-4 md:p-6 pt-0">
              <button
                type="submit"
                className="px-6 bg-white text-[#1243AF] rounded-md p-2 cursor-pointer hover:bg-[#1243AF] hover:text-white border duration-300 transition-all"
              >
                Create Template
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
