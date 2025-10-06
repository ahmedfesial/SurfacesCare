import React, { useState } from 'react'
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import axios from 'axios';
import { FaSpinner } from "react-icons/fa";
import { API_BASE_URL } from '../../../../config';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Form, useFormik } from 'formik';
import { t } from 'i18next';



export default function UpdataBaskts({updateBaskets , setUpdateBaskets , BasketsId  }) {

  let token = localStorage.getItem("userToken");
  let queryBaskets = useQueryClient(); 
  const [isLoading, setisLoading] = useState(false);

  //Update Baskets
  function updateBasket(value){
    setisLoading(true)
    axios.put(`${API_BASE_URL}baskets/update/${BasketsId}` , value,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(()=>{
        toast.success("Update Basket Name")
        queryBaskets.invalidateQueries(['AllBaskets'])
        setisLoading(false)
      })
      .catch(()=>{
        toast.error('error update Baskets Name')
        setisLoading(false)
    })
  }


  let formik = useFormik({
    initialValues:{
        name:''
    },
    onSubmit: updateBasket
  })




  return (
    <Dialog.Root open={updateBaskets} onOpenChange={setUpdateBaskets}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50 z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-[800px] h-[250px] pb-6 z-50">
              <Tabs.Root defaultValue="basic">
                {/* header */}
                
    
                {/* Tabs */}
                <Tabs.List className="textColor flex space-x-4 mb-2 bg-[#f1f1f1]">
                  <Tabs.Trigger
                    value="basic"
                    className="py-2 px-4 ms-4 data-[state=active]:border-b-2 data-[state=active]:font-bold"
                  >
                    {t("Basket.Update Basket")}
                  </Tabs.Trigger>
                
                </Tabs.List>
    
                {/* Basic Info */}
                <Tabs.Content value="basic" className="h-[250px]">
                    <form action="" onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col gap-2 w-[80%] mx-auto my-4">
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

                  <div className="flex justify-end p-6 pt-0">
              <button
                type="submit"
                className=" me-14 px-8 bg-[#1243AF] text-white rounded-md p-2 cursor-pointer hover:bg-white hover:text-[#1243AF] border duration-300 transition-all"
              >
                {isLoading ? (<FaSpinner className="animate-spin text-2xl" />) : t("Save")}
              </button>
            </div>
            </form>
                  
                </Tabs.Content>
    
                
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
  )
}
