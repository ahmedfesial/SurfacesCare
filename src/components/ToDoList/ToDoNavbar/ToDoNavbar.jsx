  import React from 'react'
  import background from '../../../assets/Photos/backgroundNavbar.jpg'
  import { LuBellRing } from "react-icons/lu";
  import { IoLanguageSharp } from "react-icons/io5";
import FilterPanel from '../../Products/FilterPanel/FilterPanel';




  export default function ToDoNavbar() {
    return (
      <nav>
          <div className='h-[190px] rounded-2xl fixed pt-2 right-2 left-72 z-50 bg-white'>
              <div className='bg-center bg-cover bg-repeat w-full h-[190px] rounded-2xl animate-backgroundMove' style={{backgroundImage:`url(${background})`}}>

              {/* icons */}
              <div className='flex justify-end items-center'>
                  <IoLanguageSharp className='text-white text-2xl mt-3 me-2'/>
                  <LuBellRing className='text-white text-2xl mt-4 me-16'/>
              </div>

              {/* title & Input Search */}
              <div className='mt-4 w-[95%] mx-auto'>
                  <h1 className='text-4xl text-white font-bold ms-6'>To Do List</h1>

                  <FilterPanel/> 

              </div>

              </div>
          </div>
      </nav>
    )
  }
