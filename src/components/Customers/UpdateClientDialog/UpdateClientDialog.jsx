/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useFormik } from "formik";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CiFolderOn } from "react-icons/ci";
import { BiEditAlt } from "react-icons/bi";
import { t } from "i18next";
const CompanyFolder = React.lazy(() => import("./CompanyFolder"));


export default function UpdateClientDialog({
  updateClient,
  setUpdateClient,
  clientId,
}) {
  const token = localStorage.getItem("userToken");
  const queryClient = useQueryClient();
  const queryFolder = useQueryClient();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showEditFolderCard, setShowEditFolderCard] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const inputRef = useRef(null);
  const [isLoading, setisLoading] = useState(false);


  // تحديث اسم فولدر
  function handleFolderNameUpdate(e) {
    e.preventDefault();
    if (!folderNameInput.trim() || !selectedFolder) return;
    axios
      .put(
        `${API_BASE_URL}folders/update/${selectedFolder.id}`,
        { name: folderNameInput },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Folder name updated");
        setShowEditFolderCard(false);
        setSelectedFolder({ ...selectedFolder, name: folderNameInput });
        queryClient.invalidateQueries(["client", clientId]);
      })
      .catch(() => toast.error("Failed to update folder name"));
  }

  // get client
  function getClientData() {
    return axios.get(`${API_BASE_URL}clients/show/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data } = useQuery({
    queryKey: ["client", clientId],
    queryFn: getClientData,
    select: (res) => res.data.data,
  });

  // get all prices
  function getAllPrices() {
    return axios.get(`${API_BASE_URL}product-prices/types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data: Price } = useQuery({
    queryKey: ["AllPrice"],
    queryFn: getAllPrices,
    select: (res) => res.data.data,
  });

  // Update Client
  function updateCustomer(values) {
    setisLoading(true)
    const formData = new FormData();
    formData.append("company", values.company);
    formData.append("default_price_type", values.default_price_type || "");
    if (values.logo) {
      formData.append("logo", values.logo);
    }

    axios
      .post(`${API_BASE_URL}clients/update/${clientId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Client updated successfully");
        queryClient.invalidateQueries(["AllCustomers"]);
        setUpdateClient(false);
        setisLoading(false)
      })
      .catch((error) => {
        toast.error("Failed to update client");
        setisLoading(false)
      });
  }

  // delete folder
  function deleteFolder(values) {
    axios
      .delete(`${API_BASE_URL}clients/${clientId}/delete-folder`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { folder_name: values.folder_name },
      })
      .then(() => {
        toast.success("Delete Folder");
        setShowEditFolderCard(false);
        setSelectedFolder(null);
        queryFolder.invalidateQueries(["ClientFolders"]);
      })
      .catch(() => toast.error("Error Delete Folder"));
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company: data?.company || "",
      default_price_type: data?.default_price_type || "",
      logo: "",
    },
    onSubmit: updateCustomer,
  });

  // delete client
  function deleteCustomer() {
    axios
      .delete(`${API_BASE_URL}clients/delete/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Client deleted successfully");
        queryClient.invalidateQueries(["Clients"]);
        setUpdateClient(false);
      })
      .catch(() => toast.error("Failed to delete client"));
  }

  // QR code client folder
  function QRCodeFolder() {
    return axios.get(`${API_BASE_URL}clients/${clientId}/qr`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "text",
    });
  }

  const { data: QR } = useQuery({
    queryKey: ["QRCodeFolder", clientId],
    queryFn: QRCodeFolder,
    select: (res) => res.data,
  });

  // edit folder
  function EditFolder(formvalue) {
    axios
      .put(`${API_BASE_URL}clients/${clientId}/rename-folder`, formvalue, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Update Folder Name");
        setShowEditFolderCard(false);
        setSelectedFolder((prev) => ({ ...prev, name: formvalue.new_name }));
      })
      .catch(() => toast.error("Error Update Folder Name"));
  }

  const formiks = useFormik({
    enableReinitialize: true,
    initialValues: {
      old_name: selectedFolder?.name || "",
      new_name: "",
    },
    onSubmit: EditFolder,
  });

  const formikDelete = useFormik({
    enableReinitialize: true,
    initialValues: {
      folder_name: selectedFolder?.name || "",
    },
    onSubmit: deleteFolder,
  });




  return (
    <Dialog.Root open={updateClient} onOpenChange={setUpdateClient}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50"/>
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[800px] h-[450px] pb-6 z-50">
          <Tabs.Root defaultValue="basic">
            {/* header */}
            {!selectedFolder ? (
              <div className="bg-[#E0E0E0] h-[120px] rounded-t-xl flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <img
                    src={data?.logo}
                    alt="logo"
                    className="w-[50px] h-[50px] object-cover rounded-full"
                  />
                  <h1 className="text-2xl font-bold textColor">
                    {data?.company}
                  </h1>
                </div>
                <div className="w-20 h-20 bg-white flex justify-center items-center rounded-md">
                  {QR && (
                    <div
                      className="w-15 h-15 [&>svg]:w-full [&>svg]:h-full "
                      dangerouslySetInnerHTML={{ __html: QR }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#E0E0E0] h-[120px] rounded-t-xl">
                <h1 className="textColor p-4 font-semibold flex items-center gap-2">
                  Customers
                </h1>
                <div className="ms-8 flex items-center justify-between w-full  gap-4 pb-18 h-full">
                  <div className="flex gap-2">
                    <CiFolderOn className="text-4xl textColor" />
                    <div className="flex gap-2 items-center">
                      <h1 className="text-2xl font-bold textColor flex gap-2">
                        {selectedFolder?.name}
                      </h1>
                      <span
                        onClick={() => {
                          setShowEditFolderCard(true);
                          setFolderNameInput(selectedFolder?.name || "");
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        className="cursor-pointer"
                      >
                        <BiEditAlt className="text-sm textColor" />
                      </span>
                    </div>
                    {showEditFolderCard && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1234AF]/30"
                        onClick={() => setShowEditFolderCard(false)}
                      >
                        <div
                          className="bg-white rounded-xl shadow-xl p-8 w-[80%] flex flex-col gap-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h2 className="text-md font-bold textColor mb-2">
                            Update Folder
                          </h2>
                          <form
                            onSubmit={formiks.handleSubmit}
                            className="flex flex-col gap-4 textColor"
                          >
                            <label>Old Name</label>
                            <input
                              ref={inputRef}
                              type="text"
                              name="old_name"
                              value={formiks.values.old_name}
                              onChange={formiks.handleChange}
                              readOnly
                              className="border rounded px-2 py-1 textColor"
                            />
                            <label>New Name</label>
                            <input
                              ref={inputRef}
                              type="text"
                              name="new_name"
                              value={formiks.values.new_name}
                              onChange={formiks.handleChange}
                              className="border rounded px-2 py-1 textColor"
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                type="submit"
                                className="bg-[#1243AF] text-white rounded px-4 py-1"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={formikDelete.handleSubmit}
                                className="text-[#DC2626] border border-[#DC2626] rounded px-4 py-1"
                              >
                                Delete
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className=" me-14 mb-10 w-20 h-20 bg-white flex justify-center items-center rounded-md">
                    {QR && (
                      <div
                        className="w-15 h-15 [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: QR }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs.List className="textColor flex space-x-4 mb-2 bg-[#f1f1f1]">
              <Tabs.Trigger
                value="basic"
                className="py-2 px-4 ms-4 data-[state=active]:border-b-2 data-[state=active]:font-bold"
              >
                {t("Customers.Basic Info")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="folder"
                className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:font-bold"
              >
                {t("Customers.Company Folder")}
              </Tabs.Trigger>
            </Tabs.List>

            {/* Basic Info */}
            <Tabs.Content value="basic" className="h-[250px]">
              {clientId && (
                <form className="p-6" onSubmit={formik.handleSubmit}>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2">
                      <label className="textColor ms-14 text-sm">
                        {t("Customers.Customer Name")}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formik.values.company}
                        onChange={formik.handleChange}
                        className="textColor w-[85%] border p-2 rounded-xl mx-auto"
                        placeholder="Customer Name"
                      />
                    </div>

                    <div className="flex w-[85%] mx-auto gap-4">
                      <div className="w-1/2 flex flex-col gap-2">
                        <p className="textColor text-sm">{t("Customers.Logo")}</p>
                        <label
                          htmlFor="file-upload"
                          className="textColor border p-2 rounded-xl flex items-center space-x-2 cursor-pointer hover:bg-[#1243AF] hover:text-white transition w-full"
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>Upload Photo</span>
                            <MdOutlineFileUpload className="text-2xl" />
                          </div>
                        </label>
                        <input
                          id="file-upload"
                          name="logo"
                          type="file"
                          onChange={(e) =>
                            formik.setFieldValue("logo", e.currentTarget.files[0])
                          }
                          className="hidden"
                        />
                      </div>

                      <div className="textColor w-1/2 flex flex-col justify-end">
                        <label className="text-sm mb-1">{t("Customers.Price Type")}</label>
                        <select
                          name="default_price_type"
                          value={formik.values.default_price_type}
                          onChange={formik.handleChange}
                          className="w-full p-2 rounded-xl border"
                        >
                          {Price?.map((price, i) => (
                            <option key={i} value={price}>
                              {price}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end me-14 gap-4 mt-8">
                    <button
                      type="submit"
                      className="px-8 text-[#1243AF] rounded-xl p-2 border cursor-pointer hover:text-white hover:bg-[#1243AF] duration-300"
                    >
                      {isLoading ? (<FaSpinner className="animate-spin text-2xl" />) : t("Update")}
                    </button>
                    <button
                      type="button"
                      onClick={deleteCustomer}
                      className="px-8 text-[#DC2626] rounded-xl p-2 border cursor-pointer hover:text-white hover:bg-[#DC2626] duration-300"
                    >
                     {t("Delete")}
                    </button>
                  </div>
                </form>
              )}
            </Tabs.Content>

            {/* Company Folder */}
            <Tabs.Content value="folder" className="h-[200px]">
              <CompanyFolder
                clientId={clientId}
                onFolderSelect={setSelectedFolder}
              />
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
