import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Switch from "@radix-ui/react-switch";
import { useFormik } from "formik";
import axios from "axios";
import { API_BASE_URL } from "./../../../../config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function AddMember() {


  let token = localStorage.getItem("userToken"); // Token
  let {t} = useTranslation()
  let queryClient = useQueryClient(); // Query Client

  const [spinner, setSpinner] = useState(false); // spinner

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
      password: "",
      role: "",
    },
    onSubmit: handleAddMember,
  });

  function handleAddMember() {
    const formData = new FormData();

    formData.append("name", formik.values.name);
    formData.append("email", formik.values.email);
    formData.append("image", formik.values.image);
    formData.append("phone", formik.values.phone);
    formData.append("password", formik.values.password);
    formData.append("role", formik.values.role);

    if (formik.values.image) {
      formData.append("image", formik.values.image);
    }

    setSpinner(true);
    return axios
      .post(`${API_BASE_URL}users/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Member added successfully");
        queryClient.invalidateQueries(["AllMembers"]);
        setSpinner(false);
      })
      .catch(() => {
        toast.error("Failed to add member");
        setSpinner(false);
      });
  }

  return (
    <Dialog.Root>
      {/*Button Add  */}
      <Dialog.Trigger className="bg-white me-6 mt-2 text-[#1243AF] px-8 py-1 rounded-md cursor-pointer flex items-center gap-2">
        {t("Member.Add Member")} <FaPlus className="text-sm" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[90vw] max-w-4xl max-h-[85vh] overflow-y-auto z-50">
          <Tabs.Root defaultValue="basic">
            <Tabs.List className="flex space-x-4 bg-[#EBEBEB] rounded-t-md h-[70px] mb-6 text-[#1243AF]">
              <Tabs.Trigger
                value="basic"
                className="py-2 px-4 ms-4 text-lg font-bold border-b-2 "
              >
                {t("Member.Add Member")}
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="basic" className="p-6">
              <div className="space-y-4">
                <form
                  action=""
                  onSubmit={formik.handleSubmit}
                  className="text-sm space-y-4"
                >
                  {/*Members Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[#1243AF] font-light">{t("Name")}</label>
                    <input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="name"
                      value={formik.values.name}
                      type="text"
                      className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      placeholder="user name"
                    />
                  </div>

                  {/*Member Email  */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[#1243AF] font-light">{t("Email")}</label>
                    <input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="email"
                      value={formik.values.email}
                      type="email"
                      className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      placeholder="userName@email.com"
                    />
                  </div>

                  {/*Members Number */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[#1243AF] font-light">{t("Telephone")}</label>
                    <input
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="phone"
                      value={formik.values.phone}
                      type="text"
                      className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                      placeholder="055555555"
                    />
                  </div>

                  {/*Members Password & Image  */}
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Password */}
                    <div className="flex flex-col gap-1 w-full md:w-1/2">
                      <label className="text-[#1243AF] font-light">
                        {t("Member.Password")}
                      </label>
                      <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="password"
                        value={formik.values.password}
                        type="password"
                        className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                        placeholder="**********"
                      />
                    </div>

                    {/*Image  */}
                    <div className="flex flex-col gap-1 w-full md:w-1/2">
                      <p className="textColor ">{t("Member.Profile")}</p>
                      <label
                        htmlFor="file-upload"
                        className="textColor border p-2 rounded-md flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF]! hover:text-white! transition font-light"
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
                            "image",
                            event.currentTarget.files[0]
                          );
                        }}
                        type="file"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/*Role*/}
                  <div>
                    <h1 className="textColor text-sm mt-6 mb-4 font-bold">
                      {t("Member.Role")}:
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 textColor">
                      <div className="flex items-center">
                        <input
                          id="superAdmin"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.role === "super_admin"}
                          type="radio"
                          name="role"
                          value="super_admin"
                          className="textColor w-4 h-4 bg-gray-100 border-gray-300 "
                        />
                        <label
                          htmlFor="superAdmin"
                          className="ms-2 text-sm font-medium"
                        >
                          {t("Member.Super Admin")}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="admin"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.role === "admin"}
                          value="admin"
                          type="radio"
                          name="role"
                          className="textColor w-4 h-4 bg-gray-100 border-gray-300 "
                        />
                        <label
                          htmlFor="admin"
                          className="ms-2 text-sm font-medium"
                        >
                          {t("Member.Admin")}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="user"
                          type="radio"
                          value="user"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={formik.values.role === "user"}
                          name="role"
                          className="textColor w-4 h-4 bg-gray-100 border-gray-300 "
                        />
                        <label
                          htmlFor="user"
                          className="ms-2 text-sm font-medium"
                        >
                          {t("Member.User")}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-8 text-[#1243AF] bg-white rounded-md p-2 cursor-pointer hover:text-white hover:bg-[#1243AF] border duration-300 transition-all"
                    >
                      {spinner ? (
                        <FaSpinner className="animate-spin text-2xl text-blue-500" />
                      ) : (
                        t("Save")
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
