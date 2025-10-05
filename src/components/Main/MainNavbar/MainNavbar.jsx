import React, { useContext, useState } from "react";
import background from "../../../assets/Photos/backgroundNavbar.jpg";
import background2 from "../../../assets/Photos/backgroundDiv.jpg";
import { LuBellRing } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import { NotificationtContext } from "../../../Context/NotificationContext";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useTranslation } from "react-i18next";



export default function MainNavbar() {

  const { i18n, t } = useTranslation();
  let token = localStorage.getItem("userToken");
  const { notifications = [], markAllRead, switchLanguage } = useContext(NotificationtContext);
  const [open, setOpen] = useState(false);

  async function reedAllMessage() {
    if (notifications?.length > 0) {
      await markAllRead();
    }
    setOpen(prev => !prev);
  }

  const toggleLanguage = async () => {
    const currentLang = localStorage.getItem("lang") || i18n.language || "ar";
    const newLang = currentLang.startsWith("ar") ? "en" : "ar";

    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;

    try {
      if (switchLanguage) await switchLanguage(newLang);
      toast.success(newLang === "ar" ? "تم تغيير اللغة إلى العربية" : "Language switched to English");
    } catch (err) {
      console.error(err);
      toast.error(newLang === "ar" ? "فشل حفظ اللغة" : "Failed to save language");
    }
  };

  async function ApprovedPrice(client){
    try {
      await api.post(`clients/${client}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t('messages.approved_price') || 'Approved Price');
    } catch {
      toast.error(t('messages.error_approved_price') || 'Error Approved Price');
    }
  }

  async function RejectPrice(client){
    try {
      await api.post(`clients/${client}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(t('messages.rejected_price') || 'Reject Price');
    } catch {
      toast.error(t('messages.error_reject_price') || 'Error Reject Price');
    }
  }

  const lang = localStorage.getItem('lang') || i18n.language || 'ar';
  const unreadCount = notifications.filter(n => n.status === "unread").length;
  const isRTL = i18n.language === "ar";


  return (
    <nav>
      <div className={`
          rounded-2xl fixed pt-2 bg-white z-10
          ${isRTL ? "left-2 right-72" : "right-2 left-72"}
        `}>
        <div className="bg-center bg-cover bg-repeat w-full h-auto md:h-[190px] rounded-2xl animate-backgroundMove p-4"
             style={{ backgroundImage: `url(${background})` }}>
          <div className="flex justify-end items-center relative">
            <IoLanguageSharp
              onClick={toggleLanguage}
              className="text-white text-xl mt-3 me-2 cursor-pointer"
            />

            <div className="relative mt-4 me-4">
              <LuBellRing className="text-white text-xl cursor-pointer" onClick={reedAllMessage} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}

              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications.map((notif) => {
                      // الدعم لو content جاي كـ object باللغتين أو نص واحد
                      const content = (typeof notif.content === 'object')
                        ? (notif.content[lang] || notif.content.en || Object.values(notif.content)[0])
                        : notif.content;

                      return (
                        <div key={notif.id} className="px-4 py-2 border-b last:border-none hover:bg-gray-100 cursor-pointer">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {notif.type?.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-gray-700 font-medium">{content}</p>
                          <p className="text-[10px] text-gray-400">{new Date(notif.created_at).toLocaleString()}</p>

                          <div className="w-full flex mt-2 gap-2">
                            <div className="flex gap-2 mt-2 w-full">
                              <button onClick={() => ApprovedPrice(notif.related_entity_id)}
                                      className="w-full border rounded-md text-green-600 hover:bg-green-50">
                                {t('actions.approve') || 'Approve'}
                              </button>
                              <button onClick={() => RejectPrice(notif.related_entity_id)}
                                      className="w-full border rounded-md text-red-600 hover:bg-red-50">
                                {t('actions.reject') || 'Reject'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="p-4 text-center text-gray-500 text-sm">{t('notifications.no_notifications') || 'No notifications'}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* باقي الـ JSX كما هو */}
          <div className="w-[90%] mx-auto flex flex-col md:flex-row justify-between items-c md:mt-0 md:px-8 md:gap-16">
            <h1 className="text-3xl sm:text-4xl md:text-6xl text-white font-bold">{t('dashboard.title') || 'Dashboard'}</h1>
            <div className="mt-4 md:mt-0">
              <p className="uppercase text-white font-light text-xs sm:text-sm mb-2 ms-1 text-center md:text-left">{t('brand.name') || 'surfaces care'}</p>
              <div className="w-full max-w-md md:w-[400px] h-auto md:h-[80px] rounded-xl mb-4 flex items-center justify-center md:justify-around gap-2 p-3 md:p-0"
                   style={{ backgroundColor: `#ffffff99` }}>
                <div className="w-[60px] h-[60px] md:w-[80px] md:h-[60px] ms-3 rounded-lg bg-cover flex-shrink-0"
                     style={{ backgroundImage: `url(${background2})` }} />
                <div className="leading-4">
                  <p className="text-[#1243AF] mb-2 text-sm sm:text-base">{t('welcome.back') || 'Welcome Back,👋'}</p>
                  <p className="font-light text-xs sm:text-sm">{t('welcome.subtitle') || "Here’s your dashboard summary for today."}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
