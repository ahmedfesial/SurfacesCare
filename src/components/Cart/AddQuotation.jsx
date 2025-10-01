import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useFormik } from "formik";
import { MdOutlineFileUpload } from "react-icons/md";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AddQuotation({
  products = [],
  localQuantities = {},
  assignedTo = null,
}) {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();

  // --- build payload and send request
  async function createQuote(values) {
    try {
      const formData = new FormData();
      formData.append("client_name", values.client_name);
      formData.append("client_email", values.client_email);
      formData.append("client_company", values.client_company);
      formData.append("client_phone", values.client_phone);

      if (values.client_logo) {
        formData.append("client_logo", values.client_logo);
      }

      const cart = Array.isArray(products) ? products : [];
      if (!cart.length) {
        toast.error("Cart is empty — لا يوجد منتجات في السلة");
        throw new Error("cart empty");
      }

      const productsPayload = cart
        .map((item) => {
          const p = item.product ?? item;
          const product_id = item.product_id ?? p?.id ?? item.id ?? null;
          const name_en =
            p?.name_en ?? p?.name ?? p?.specification ?? item?.product_name ?? "";
          const quantity = localQuantities?.[item.id] ?? item.quantity ?? 1;
          const price = item.price ?? item.unit_price ?? p?.price ?? 0;

          if (!product_id) return null;

          return {
            product_id,
            name_en,
            quantity,
            price,
          };
        })
        .filter(Boolean);

      if (!productsPayload.length) {
        toast.error("No valid products found in cart");
        throw new Error("No valid products");
      }

      productsPayload.forEach((p, index) => {
        formData.append(`products[${index}][product_id]`, p.product_id);
        formData.append(`products[${index}][quantity]`, p.quantity);
        formData.append(`products[${index}][price]`, p.price);
        formData.append(`products[${index}][name_en]`, p.name_en);
      });

      formData.append("status", "pending");

      const assigned =
        assignedTo ??
        localStorage.getItem("user_id") ??
        localStorage.getItem("userId");
      if (assigned) {
        formData.append("assigned_to", Number(assigned));
      }

      await axios.post(`${API_BASE_URL}quote-requests/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error("❌ Error creating quotation:", err);
      throw err;
    }
  }

  // --- form submit handler
  async function handleSubmit(values, { setSubmitting, resetForm }) {
    setSubmitting(true);
    try {
      toast.loading("Submitting...");
      await createQuote(values);

      toast.dismiss();
      toast.success("Quotation request created successfully");
      resetForm();
      setOpen(false);
      localStorage.removeItem("guest_token");
      queryClient.invalidateQueries(["AllCarts"]);
    } catch (err) {
      toast.dismiss();
      toast.error("Error Requesting Quotation: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      client_company: "",
      client_logo: null,
    },
    onSubmit: handleSubmit,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="bg-[#CB0022] text-white px-8 sm:px-20 cursor-pointer text-lg py-1 rounded-md hover:bg-white hover:text-[#CB0022] border duration-300 transition-all z-50">
        Request for Quotation - RFQ
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto p-4 md:p-6 z-50">
          <form onSubmit={formik.handleSubmit}>
            <Tabs.Root defaultValue="basic">
              <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-[50px] rounded-xl mb-6 text-[#1243AF]">
                <Tabs.Trigger
                  value="basic"
                  className="py-2 px-4 ms-4 text-lg md:text-2xl font-semibold border-b-2 "
                >
                  Add Quot
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="basic">
                <div className="space-y-4 px-2">
                  {/* Name & Email */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="w-full sm:w-1/2">
                      <label className="text-[#1243AF] font-medium">Name</label>
                      <input
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="client_name"
                        required
                        value={formik.values.client_name}
                        className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="text-[#1243AF] font-medium">Email</label>
                      <input
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="client_email"
                        required
                        value={formik.values.client_email}
                        className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="w-full sm:w-1/2">
                      <label className="text-[#1243AF] font-medium">
                        Company Name
                      </label>
                      <input
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="client_company"
                        required
                        value={formik.values.client_company}
                        className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="text-[#1243AF] font-medium">Phone</label>
                      <input
                        type="tel"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="client_phone"
                        required
                        value={formik.values.client_phone}
                        className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="w-full mx-auto mb-4">
                    <p className="textColor text-sm">Logo</p>
                    <label
                      htmlFor="file-upload"
                      className="textColor border p-2 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF]! hover:text-white! transition font-light w-full"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>Upload Photo Type</span>
                        <MdOutlineFileUpload className="text-2xl" />
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      name="client_logo"
                      required
                      onChange={(event) => {
                        formik.setFieldValue(
                          "client_logo",
                          event.currentTarget.files[0]
                        );
                      }}
                      type="file"
                      className="hidden"
                    />
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>

            <div className="flex justify-end gap-4 mt-6">
              <Dialog.Close className="px-4 bg-gray-200 rounded-md p-2 cursor-pointer">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
