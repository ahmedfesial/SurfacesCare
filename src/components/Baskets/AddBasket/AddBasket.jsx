import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from "axios";
import { API_BASE_URL } from "./../../../../config";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function AddBasket() {

  let {t} = useTranslation();
  let token = localStorage.getItem("userToken");
  let queryClient = useQueryClient(); //Update UI

  function getAllClient() {
    return axios.get(`${API_BASE_URL}clients`, {
      headers: {  
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const { data } = useQuery({
    queryKey: ["AllClients"],
    queryFn: getAllClient,
    select: (res) => res.data,
  });

  // Add Basket
  function addBasket(formvalue) {
    axios
      .post(`${API_BASE_URL}baskets/create`, formvalue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Basket Added Successfully");
        queryClient.invalidateQueries(["AllBaskets"]);
      })
      .catch(() => {
        toast.error("Something went wrong while adding the basket");
      });
  }

  // get all Client

  let formik = useFormik({
    initialValues: {
      name: "",
      client_id: "",
    },
    onSubmit: addBasket,
  });

  return (
    <Dialog.Root>
      {/*Button Add  */}
      <Dialog.Trigger className="bg-white flex items-center gap-2 text-[#1243AF] px-4 sm:px-8 py-1 rounded-md mt-2 cursor-pointer hover:bg-gray-300 duration-300 transition-all me-6 z-40">
        {t("Basket.Add Basket")} <FaPlus className="text-sm" />
      </Dialog.Trigger>

      {/*Taps  */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto z-50">
          <form onSubmit={formik.handleSubmit}>
            <Tabs.Root defaultValue="basic">
              <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-[50px] rounded-t-md mb-6 text-[#1243AF]">
                <Tabs.Trigger
                  value="basic"
                  className="py-2 px-4 ms-4 text-sm font-medium border-b-2 "
                >
                  {t("Basket.Add Basket")}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="basic" className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#1243AF] text-md font-light">
                      {t("Basket.Basket Name")}
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

                  {/* Client Id */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#1243AF] text-md font-light">
                      {t("Basket.Assign to Customer")}
                    </label>
                    <select
                      name="client_id"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.client_id}
                      className="w-full p-2.5 border-1 textColor border-[#1243AF] rounded-md focus:outline-none"
                    >
                      <option className="p-2">{t("Basket.Choose Customer")}</option>
                      {data?.data?.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.company}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
            <div className="flex justify-end p-6 pt-0">
              <button
                type="submit"
                className="px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
              >
                {t("Basket.Add Basket")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
