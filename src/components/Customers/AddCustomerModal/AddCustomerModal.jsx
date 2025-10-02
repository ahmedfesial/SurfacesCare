import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Switch from "@radix-ui/react-switch";
import FolderCreator from "../FolderCreator/FolderCreator";
import { MdOutlineFileUpload } from "react-icons/md";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

export default function AddCustomerModal() {
  let token = localStorage.getItem("userToken");
  let queryClient = useQueryClient();

  // Open & Close Dialog
  const [open, setOpen] = useState(false);

  const addCustomerMutation = useMutation({
    mutationFn: (formData) =>
      axios.post(`${API_BASE_URL}clients/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "multipart/form-data",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["AllCustomers"]); // هيرجع fetch جديد للجدول
      toast.success("Customer added successfully");
      formik.resetForm();
      setOpen(false); // Close Dialog
    },
    onError: (err) => {
      toast.error("Failed to add customer");
      console.log(err);
    },
  });

  const handleAddCustomer = (valus) => {
    const formData = new FormData();
    formData.append("company", valus.company);
    formData.append("logo", valus.logo);
    formData.append("default_price_type", valus.default_price_type);

    addCustomerMutation.mutate(formData);
  };

  // Add Customer
  function AddCustomer(formValue) {
    const formData = new FormData();

    formData.append("name", formValue.name);
    formData.append("phone", formValue.phone);
    formData.append("email", formValue.email);
    formData.append("company", formValue.company);
    formData.append("logo", formValue.logo);
    formData.append("default_price_type", formValue.default_price_type);

    return axios
      .post(`${API_BASE_URL}clients/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Customer added successfully");
          formik.resetForm();
          queryClient.invalidateQueries(["AllCustomers"]);
        }
      })
      .catch((err) => {
        toast.error("Failed to add customer");
        console.log(err);
      });
  }

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      default_price_type: "",
      logo: "",
    },
    onSubmit: AddCustomer,
  });

  // Get All Prices
  function getAllPrices() {
    return axios.get(`${API_BASE_URL}product-prices/types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data: Price } = useQuery({
    queryKey: ["AllPrice"],
    queryFn: getAllPrices,
    select: (res) => res.data.data,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/*Button Add  */}
      <Dialog.Trigger className="textColor bg-white flex items-center gap-2 px-8 py-1 mt-2 me-6 rounded-md cursor-pointer hover:bg-gray-300 duration-300 transition-all">
        Add Customer <FaPlus className="text-sm" />
      </Dialog.Trigger>

      {/*Taps  */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[800px] pb-8 z-50 h-[400px]">
          <Tabs.Root defaultValue="basic">
            {/* Tabs */}
            <Tabs.List className="textColor flex space-x-4 bg-[#EBEBEB] mb-6 rounded-t-md text-sm font-medium h-[50px]">
              <Tabs.Trigger
                value="basic"
                className="py-2 px-4 ms-4  data-[state=active]:border-b-2 data-[state=active]:font-bold"
              >
                Basic Info
              </Tabs.Trigger>
              <Tabs.Trigger
                value="folder"
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:font-bold"
              >
                Company Folder
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="basic" className="h-[230px]">
              <form action="" onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="textColor ms-14 text-sm">
                      Customer name
                    </label>
                    <input
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="company"
                      value={formik.values.company}
                      className="textColor w-[85%] border-1 p-2 rounded-xl mx-auto focus:outline-none"
                      placeholder="Customer Name"
                    />
                  </div>

                  {/* Logo & Price side by side */}
                  <div className="flex w-[85%] mx-auto gap-4">
                    {/* Logo */}
                    <div className="w-1/2 flex flex-col gap-2">
                      <p className="textColor text-sm">Logo</p>
                      <label
                        htmlFor="file-upload"
                        className="textColor border p-2 rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF]! hover:text-white! transition font-light w-full"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span>Upload Photo Type</span>
                          <MdOutlineFileUpload className="text-2xl" />
                        </div>
                      </label>
                      <input
                        id="file-upload"
                        name="logo"
                        onChange={(event) => {
                          formik.setFieldValue(
                            "logo",
                            event.currentTarget.files[0]
                          );
                        }}
                        type="file"
                        className="hidden"
                      />
                    </div>
                    {/* Price */}
                    <div className="textColor w-1/2 flex flex-col justify-end">
                      <label className="text-sm mb-1">Price Type</label>
                      <select
                        name="default_price_type"
                        value={formik.values.default_price_type}
                        onChange={formik.handleChange}
                        className="w-full p-2 rounded-xl border"
                      >
                        <option value="">Select Price</option>
                        {Price?.map((price) => (
                          <option key={price.id} value={price}>
                            {price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-24 me-8">
                  <button
                    type="submit"
                    onClick={() => handleAddCustomer}
                    className="px-8 backGroundColor text-white rounded-md p-2 cursor-pointer hover:bg-white! hover:text-[#1243AF] border duration-300 transition-all"
                  >
                    Save
                  </button>
                </div>
              </form>
            </Tabs.Content>

            {/* Company Folder */}
            <Tabs.Content value="folder" className="h-[200px]">
              <div className="flex justify-between ">
                {/*Search Bar */}
                <div className="relative ">
                  <div className="absolute inset-y-0 ms-4 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 textColor"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="block w-[410px] p-1 ms-4 ps-10 textColor border  rounded-lg focus:outline-none"
                    placeholder="Search Files"
                  />
                </div>

                <div className="flex items-center gap-4 me-8">
                  <FolderCreator />
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
