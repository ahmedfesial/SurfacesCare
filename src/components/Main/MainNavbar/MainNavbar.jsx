import React, { useContext, useState } from "react";
import background from "../../../assets/Photos/backgroundNavbar.jpg";
import background2 from "../../../assets/Photos/backgroundDiv.jpg";
import { LuBellRing } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import { NotificationtContext } from "../../../Context/NotificationContext";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../../../config";

export default function MainNavbar() {

  let token = localStorage.getItem("userToken");

  let { notifications, markAllRead, switchLanguage } =
    useContext(NotificationtContext);
  const [open, setOpen] = useState(false);

  async function reedAllMessage() {
    if (notifications?.length > 0) {
      await markAllRead(); // هيحدث الداتا
    }
    setOpen((prev) => !prev); // يفتح أو يقفل بعد التحديث
  }

  //Switch Language

  const toggleLanguage = () => {
    // قراءة اللغة الحالية من localStorage
    const currentLang = localStorage.getItem("lang") || "ar";
    const newLang = currentLang === "ar" ? "en" : "ar";

    // تحديث اللغة في backend وlocalStorage
    switchLanguage(newLang);
    localStorage.setItem("lang", newLang);

    toast.success(`Language switched to ${newLang.toUpperCase()}`);
  };




  // Aprroved Change Price
  function ApprovedPrice(client){
    axios.post(`${API_BASE_URL}clients/${client}/approve`, {},{
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(()=>{
      toast.success('Approved Price')
    })
    .catch(()=>{
      toast.error('Error Approved Price')
    })
  }


  // Reject Change Price
  function RejectPrice(client){
    axios.post(`${API_BASE_URL}clients/${client}/reject`, {} ,{
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(()=>{
      toast.success('Reject Price')
    })
    .catch(()=>{
      toast.error('Error Reject Price')
    })
  }

  return (
    <nav>
      <div className="bg-white rounded-2xl fixed pt-2 right-2 left-2 md:left-72 z-50">
        <div
          className="bg-center bg-cover bg-repeat w-full h-auto md:h-[190px] rounded-2xl animate-backgroundMove p-4"
          style={{ backgroundImage: `url(${background})` }}
        >
          {/* icons */}

          <div className="flex justify-end items-center relative">
            <IoLanguageSharp
              onClick={toggleLanguage}
              className="text-white text-xl mt-3 me-2 cursor-pointer"
            />

            {/* notification icon with badge */}
            <div className="relative mt-4 me-4">
              <LuBellRing
                className="text-white text-xl cursor-pointer"
                onClick={reedAllMessage}
              />
              {notifications?.filter((n) => n.status === "unread").length >
                0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.filter((n) => n.status === "unread").length}
                </span>
              )}

              {/* Dropdown notifications */}
{open && (
  <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
    {notifications?.length > 0 ? (
      notifications.map((notif) => (
        <div
          key={notif.id}
          className="px-4 py-2 border-b last:border-none hover:bg-gray-100 cursor-pointer"
        >
          {/* نوع الإشعار */}
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {notif.type?.replace(/_/g, " ")}
          </p>

          {/* محتوى الإشعار */}
          <p className="text-sm text-gray-700 font-medium">
            {notif.content}
          </p>

          {/* وقت الإنشاء */}
          <p className="text-[10px] text-gray-400">
            {new Date(notif.created_at).toLocaleString()}
          </p>

          {/* أزرار الأكشن */}
          <div className="w-full flex mt-2 gap-2">
          <div className="flex gap-2 mt-2 w-full">
          <button
          onClick={() => ApprovedPrice(notif.related_entity_id)}
          className="w-full border rounded-md text-green-600 hover:bg-green-50 cursor-pointer"
          >
           Approve
         </button>
          <button
           onClick={() => RejectPrice(notif.related_entity_id)}
           className="w-full border rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
           >
           Reject
          </button>
          </div>
          </div>
          </div>
      ))
    ) : (
      <p className="p-4 text-center text-gray-500 text-sm">
        No notifications
      </p>
    )}
  </div>
)}

            </div>
          </div>

          {/* title & Box */}
          <div className="w-[90%] mx-auto flex flex-col md:flex-row justify-between items-c md:mt-0 md:px-8 md:gap-16">
            <h1 className="text-3xl sm:text-4xl md:text-6xl text-white font-bold">
              Dashboard
            </h1>

            <div className="mt-4 md:mt-0">
              <p className="uppercase text-white font-light text-xs sm:text-sm mb-2 ms-1 text-center md:text-left">
                surfaces care
              </p>
              <div
                className="w-full max-w-md md:w-[400px] h-auto md:h-[80px] rounded-xl mb-4 flex items-center justify-center md:justify-around gap-2 p-3 md:p-0"
                style={{ backgroundColor: `#ffffff99` }}
              >
                <div
                  className="w-[60px] h-[60px] md:w-[80px] md:h-[60px] ms-3 rounded-lg bg-cover flex-shrink-0"
                  style={{ backgroundImage: `url(${background2})` }}
                ></div>
                <div className="leading-4">
                  <p className="text-[#1243AF] mb-2 text-sm sm:text-base">
                    Welcome Back,👋
                  </p>
                  <p className="font-light text-xs sm:text-sm">
                    Here’s your dashboard summary for today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
