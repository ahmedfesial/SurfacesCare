import * as Dialog from "@radix-ui/react-dialog";
import { Dropdown } from "flowbite-react";
import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "./../../../../config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Legend from "./Legend";
import Certificates from "./Certificates";






export default function EditProductModal({ product }) {
  let token = localStorage.getItem("userToken");
  let queryClient = useQueryClient();

  // Update Product
  function updateProduct(values) {
    axios
      .put(`${API_BASE_URL}products/update/${product.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Product Updated Successfully ✅");
        queryClient.invalidateQueries(["AllProducts"]);
      })
      .catch(() => {
        toast.error("Error while updating product ❌");
      });
  }

  // get all legend
  const getAllLegend = () =>
      axios.get(`${API_BASE_URL}legends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
    const { data } = useQuery({
      queryKey: ["AllLegend"],
      queryFn: getAllLegend,
      select: (res) => res.data.data,
    });

  // Formik
  let formik = useFormik({
    initialValues: {
      name_en: product?.name_en || "",
      specification: product?.specification || "",
      price: product?.price || "",
      legend_ids: [],
    },
    enableReinitialize: true,
    onSubmit: updateProduct,
  });

  return (
    <Dialog.Root>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        <button className="backGroundColor text-sm p-2 w-full flex items-center gap-2 justify-center rounded-md text-white hover:bg-white! hover:text-[#1243AF]! border cursor-pointer">
          Edit
        </button>
      </Dialog.Trigger>

      {/* Overlay + Modal Content */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl shadow-gray-700 focus:outline-none">
          {/* الهيدر */}
          <div className="flex justify-between items-start p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold">Edit product</h3>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-2xl text-sm p-1.5 ml-auto inline-flex items-center"
              >
                ✖
              </button>
            </Dialog.Close>
          </div>

          {/* البودي */}
          <form className="p-6 space-y-6">
                <div className="">
                  <div className="flex w-full justify-between my-4">
                    <select name="" id="" className="w-[32%] rounded-md p-2 border textColor">
                        <option value="">Select Brand</option>
                        <option value="">ahmed</option>
                        <option value="">ahmed</option>
                    </select>
                    <select name="" id="" className="w-[32%] rounded-md p-2 border textColor">
                        <option value="">Select Main Category</option>
                        <option value="">ahmed</option>
                        <option value="">ahmed</option>
                    </select>
                    <select name="" id="" className="w-[32%] rounded-md p-2 border textColor">
                        <option value="">Select Sub Category</option>
                        <option value="">ahmed</option>
                        <option value="">ahmed</option>
                    </select>

                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="brand"
                      className="block mb-2 text-sm font-medium textColor"
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="brand"
                      placeholder=""
                      required
                      className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-fuchsia-50 focus:border-fuchsia-300 block w-full p-2.5 shadow-sm"
                    />
                  </div>
                  

                  <div className="col-span-full my-4 textColor">
                    <label
                      htmlFor="product-details"
                      className="block mb-2 text-sm font-medium"
                    >
                      Product Details
                    </label>
                    <textarea
                      id="product-details"
                      rows="6"
                      placeholder=""
                      className="block p-4 w-full text-gray-900 border border-gray-300 sm:text-sm rounded-lg focus:ring-2 focus:ring-fuchsia-50 focus:border-fuchsia-300"
                    ></textarea>
                  </div>


                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium textColor"
                    >
                      Standard Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      placeholder="$2300"
                      required
                      className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-fuchsia-50 focus:border-fuchsia-300 block w-full p-2.5 shadow-sm"
                    />
                  </div>




                  {/*Legend & Color  */}
                  <div>
                    {/* kegend */}
                    <div className="flex items-center gap-4">
                      <div>
                        {data?.map((legend) => {
  const isChecked = formik.values.legend_ids.includes(legend.id);

  return (
    <div key={legend.id} className="flex items-center gap-2 my-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            if (isChecked) {
              formik.setFieldValue(
                "legend_ids",
                formik.values.legend_ids.filter((id) => id !== legend.id)
              );
            } else {
              formik.setFieldValue(
                "legend_ids",
                [...formik.values.legend_ids, legend.id]
              );
            }
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
        <span className="text-sm text-gray-900">{legend.name}</span>
      </label>
    </div>
  );
})}
                      </div>
                      

                    <Certificates/>
                    
                    </div>
                    

                  </div>

                </div>





                {/* صور المنتج */}
                <div className="flex my-4 space-x-5">
                  {["1", "2", "3"].map((i) => (
                    <div key={i}>
                      <img
                        src={`/images/products/apple-imac-${i}.png`}
                        className="h-24"
                        alt="imac"
                      />
                      <button type="button" className="cursor-pointer">
                        <svg
                          className="-mt-5 w-6 h-6 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 2a1 1 0 
                              00-.894.553L7.382 
                              4H4a1 1 0 000 
                              2v10a2 2 0 002 
                              2h8a2 2 0 002-2V6a1 
                              1 0 100-2h-3.382l-.724-1.447A1 
                              1 0 0011 2H9zM7 8a1 1 0 012 
                              0v6a1 1 0 11-2 
                              0V8zm5-1a1 1 0 00-1 
                              1v6a1 1 0 102 0V8a1 1 
                              0 00-1-1z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* رفع الصور */}
                <div className="flex justify-center items-center w-full">
                  <label className="flex flex-col w-full h-32 rounded border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 
                          003-3v-1m-4-8l-4-4m0 0L8 
                          8m4-4v12"
                        />
                      </svg>
                      <p className="py-1 text-sm text-gray-600">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>

                {/* الفوتر */}
                <div className="p-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="text-white font-medium text-sm px-5 py-2.5 text-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 shadow-md shadow-gray-300 hover:scale-[1.02] transition-transform"
                  >
                    Save all
                  </button>
                </div>
              </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
