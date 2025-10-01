import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import axios from 'axios';
import { API_BASE_URL } from './../../../../config';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { FaPlus } from "react-icons/fa6";
import { useQuery } from '@tanstack/react-query';





export default function UploadImage() {


  let token = localStorage.getItem('userToken');


  //Get All Sub Category   
  function getAllSubCategory() {
    return axios.get(`${API_BASE_URL}sub-categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const { data } = useQuery({ 
    queryKey: ['AllSubCategories'],
    queryFn: getAllSubCategory,
    select: (data) => data.data.data
  });



  // Add Image to sub category
  function addImageSubCategory(values){

    let formData = new FormData();

    
  // رفع صورة واحدة
    if (values.cover_image) {
     formData.append("cover_image", values.cover_image);
    }
    
    axios.post(`${API_BASE_URL}sub-categories/${formik.values.subCategoryId}/upload-images`, formData,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      toast.success("Upload Image Sub Category Successfully");
      
    })
    .catch(() => {
      toast.error("Something went wrong while Upload Image Sub Category");
    });
  }


  let formik = useFormik({
    initialValues:{
        cover_image:'',
        subCategoryId :''
    },
    onSubmit:addImageSubCategory
  })


  return (
    <Dialog.Root>
      {/*Button Add  */}
      <Dialog.Trigger className="bg-white flex items-center gap-2 text-[#1243AF] px-8 py-1 rounded-md mt-2 cursor-pointer hover:bg-gray-300 duration-300 transition-all me-6 z-50">  
        Upload Image
      </Dialog.Trigger>

      {/*Taps  */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#1234AF]/50"/>
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-xl w-[800px]">

        <form onSubmit={formik.handleSubmit}>
          <Tabs.Root defaultValue="basic">
            <Tabs.List className="flex space-x-4 bg-[#EBEBEB] h-[50px] rounded-t-md mb-6 text-[#1243AF]">
              <Tabs.Trigger value="basic" className="py-2 px-4 ms-4 text-sm font-medium border-b-2 ">Upload Image Sub Category</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="basic">

              <div className="space-y-4"> 

                {/* Sub Category Nmae */}
                <select
                  name="subCategoryId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subCategoryId}
                  className="w-[85%] ms-15 mb-4 p-2.5 border-1 textColor border-[#1243AF] rounded-md focus:outline-none">
                  <option className='p-2'>Choose Sub Category</option>
                  {data?.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name_en}</option>
                  ))}
                </select>


                {/*Image Cover*/}
                <div className='flex flex-col gap-2'>
                  <label className='text-[#1243AF] ms-15 text-md font-light'>SubCategory Name</label>
                  <input type="file" onChange={(e) => formik.setFieldValue("cover_image", e.currentTarget.files[0])} onBlur={formik.handleBlur} name='cover_image' className="w-[85%] border-1 border-[#1243AF] p-2 rounded-md mx-auto focus:outline-none"/>
                  <div className="flex gap-2 mt-3 flex-wrap ms-14">
                     {formik.values.cover_image && Array.from(formik.values.cover_image).map((file, idx) => (
                       <img
                         key={idx}
                         src={URL.createObjectURL(file)}
                         alt={`start-${idx}`}
                         className="w-14 h-14 object-cover rounded-lg border"
                       />
                     ))}
                   </div>
                </div>

              </div>
            </Tabs.Content>
          </Tabs.Root>
          <div className="flex justify-end me-8">
            <button className="px-8 mb-6 me-7 bg-white text-[#1243AF] rounded-md p-2 cursor-pointer hover:bg-[#1243AF] hover:text-white border duration-300 transition-all">Send</button>
          </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
