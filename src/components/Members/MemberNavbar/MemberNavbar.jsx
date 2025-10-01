import React, { useContext, useState } from "react";
import background from "../../../assets/Photos/backgroundNavbar.jpg";
import { LuBellRing } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import { NotificationtContext } from "../../../Context/NotificationContext";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import AddMember from "../AddMember/AddMember";
const SearchBar = React.lazy(() => import("../../SearchBar/SearchBar"));










export default function MembersNavbar() {


  let token = localStorage.getItem("userToken");

  let { notifications, markAllRead, switchLanguage, hideNotificationCount } =
    useContext(NotificationtContext);

  const [open, setOpen] = useState(false);

  // Open Menu
  function toggleDropdown() {
    setOpen((prev) => !prev);

    if (!open && notifications?.length > 0) {
      markAllRead();
      hideNotificationCount();
    }
  }

  //Switch Language
  const toggleLanguage = () => {
    const currentLang = localStorage.getItem("lang") || "ar";
    const newLang = currentLang === "ar" ? "en" : "ar";

    switchLanguage(newLang);
    localStorage.setItem("lang", newLang);

    toast.success(`Language switched to ${newLang.toUpperCase()}`);
  };

  // Approved Change Price
  function ApprovedPrice(client) {
    axios
      .post(
        `${API_BASE_URL}clients/${client}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Approved Price");
      })
      .catch(() => {
        toast.error("Error Approved Price");
      });
  }

  // Reject Change Price
  function RejectPrice(client) {
    axios
      .post(
        `${API_BASE_URL}clients/${client}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Reject Price");
      })
      .catch(() => {
        toast.error("Error Reject Price");
      });
  }

  //notifications unread count
  const unreadCount = notifications?.filter((n) => n.status !== "read").length;

  return (
    <nav>
      <div className="rounded-2xl fixed pt-2 right-2 left-72 bg-white z-10">
        <div
          className="bg-center bg-cover bg-repeat w-full h-[190px] rounded-2xl animate-backgroundMove"
          style={{ backgroundImage: `url(${background})` }}
        >
          {/* icons */}
          <div className="flex justify-end items-center relative">
            {/* Switch language */}
            <IoLanguageSharp
              onClick={toggleLanguage}
              className="text-white text-xl mt-3 me-2 cursor-pointer"
            />

            {/* Notification */}
            <div className="relative mt-4 me-4">
              <LuBellRing
                onClick={toggleDropdown}
                className="text-white text-xl cursor-pointer"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}

              {/* Dropdown notifications */}
              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id}>
                        <div className="px-4 py-2 border-b last:border-none hover:bg-gray-100 cursor-pointer">
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

                          <div className="w-full flex mt-2 gap-2">
                            <div className="flex gap-2 mt-2 w-full">
                              <button
                                onClick={() =>
                                  ApprovedPrice(notif.related_entity_id)
                                }
                                className="w-full border rounded-md text-green-600 hover:bg-green-50 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  RejectPrice(notif.related_entity_id)
                                }
                                className="w-full border rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
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

          {/* title & Input Search */}
          <div className="mt-2 w-[95%] mx-auto">
            <div className="flex justify-between items-center mx-4">
              <h1 className="text-4xl text-white font-bold ms-6">Members</h1>
              <AddMember/>
            </div>
            {/*Input Search  */}
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}
