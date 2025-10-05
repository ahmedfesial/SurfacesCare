import React, { useContext, useState } from "react";
import background from "../../../assets/Photos/backgroundNavbar.jpg";
import { LuBellRing } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import { NotificationtContext } from "../../../Context/NotificationContext";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config";
import axios from "axios";
import { useTranslation } from "react-i18next";
const SeacrhBar = React.lazy(() => import("../../SearchBar/SearchBar"));



export default function QuotationNavbar() {
  const { i18n, t } = useTranslation();
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
  const toggleLanguage = async () => {
    const currentLang = localStorage.getItem("lang") || i18n.language || "ar";
    const newLang = currentLang.startsWith("ar") ? "en" : "ar";

    // 1) غيّر الواجهة فورًا
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    // 2) حاول تخزن التفضيل في الباك ونعيد جلب النوتيفيكيشن لو موجود
    try {
      if (switchLanguage) await switchLanguage(newLang);
      toast.success(newLang === "ar" ? "تم تغيير اللغة إلى العربية" : "Language switched to English");
    } catch (err) {
      console.error(err);
      toast.error(newLang === "ar" ? "فشل حفظ اللغة" : "Failed to save language");
    }
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
        toast.success(t('messages.approved_price') || 'Approved Price');
      })
      .catch(() => {
        toast.error(t('messages.error_approved_price') || 'Error Approved Price');
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
        toast.success(t('messages.rejected_price') || 'Rejected Price');
      })
      .catch(() => {
        toast.error(t('messages.error_rejected_price') || 'Error Reject Price');
      });
  }

  //notifications unread count
  const unreadCount = notifications?.filter((n) => n.status !== "read").length;
  const isRTL = i18n.language === "ar";

  return (
    <nav>
      <div className={`
          rounded-2xl fixed pt-2 bg-white z-10
          ${isRTL ? "left-2 right-72" : "right-2 left-72"}
        `}>
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
                <div className={`absolute mt-3 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto 
                ${i18n.language === "ar" ? "left-0" : "right-0"}`}>
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
                                className="w-full border rounded-md text-green-600 hover:bg-green-50 cursor-pointer flex justify-center"
                              >
                                {t('actions.approve')}
                              </button>
                              <button
                                onClick={() =>
                                  RejectPrice(notif.related_entity_id)
                                }
                                className="w-full border rounded-md text-red-600 hover:bg-red-50 cursor-pointer flex justify-center"
                              >
                                {t('actions.reject')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500 text-sm">
                      {t('notifications.no_notifications')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* title & Input Search */}
          <div className="mt-2 w-[95%] mx-auto">
            <h1 className="text-4xl ms-6 text-white font-bold">{t('quotation')}</h1>
            <SeacrhBar />
          </div>
        </div>
      </div>
    </nav>
  );
}
