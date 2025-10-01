/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { useFormik } from "formik";
import { MdOutlineFileUpload } from "react-icons/md";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../../../config";

export default function AddCertificates({ addCertificates, setCertificates }) {
  let token = localStorage.getItem("userToken");
  const query = useQueryClient();

  // Add Certificates
  function addCertificate(formvalue) {
    let formData = new FormData();

    formData.append("name", formik.values.name);
    formData.append("image", formik.values.image);

    axios
      .post(`${API_BASE_URL}certificates/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Certificates Added Successfully");
        query.invalidateQueries(["AllCertificates"]);
      })
      .catch(() => {
        toast.error("Something went wrong while adding the Certificates");
      });
  }

  let formik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },
    onSubmit: addCertificate,
  });

  return (
    <Dialog.Root open={addCertificates} onOpenChange={setCertificates}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[800px] h-[450px] pb-6 z-50">
          <Tabs.Root defaultValue="basic">
            {/* Tabs */}
            <Tabs.List className="textColor flex space-x-4 mb-2 bg-[#f1f1f1]">
              <Tabs.Trigger
                value="basic"
                className="py-2 px-4 ms-4 data-[state=active]:border-b-2 data-[state=active]:font-bold"
              >
                Add Certificates
              </Tabs.Trigger>
            </Tabs.List>
            {/* Form */}
            <Tabs.Content value="basic" className="h-[250px]">
              <form onSubmit={formik.handleSubmit}>
                {/*Name  */}
                <div className="w-[80%] mx-auto">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#1243AF] text-md font-light">
                      Certificates name
                    </label>
                    <input
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="name"
                      value={formik.values.name}
                      className="w-full border-1 border-[#1243AF] p-2 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image */}
                <div className="w-[80%] mx-auto mt-4 flex flex-col gap-2">
                  <p className="textColor text-sm">Image</p>
                  <label
                    htmlFor="file-upload"
                    className="textColor border p-2 rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-[#1243Ahoverext-white! transition font-light w-full"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>Upload Photo Type</span>
                      <MdOutlineFileUpload className="text-2xl" />
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    name="image"
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

                <div className="w-[80%] mx-auto flex justify-end mt-24 ">
                  <button
                    type="submit"
                    className="px-8 backGroundColor text-white rounded-md p-2 cursor-pointer hover:bg-white! hover:text-[#1243AF] border duration-300 transition-all"
                  >
                    Add Certificates
                  </button>
                </div>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
