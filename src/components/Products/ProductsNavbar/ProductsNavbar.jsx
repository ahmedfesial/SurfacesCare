import React, { useContext, useState } from "react";
import background from "../../../assets/Photos/backgroundNavbar.jpg";
import { LuBellRing } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import { NotificationtContext } from "../../../Context/NotificationContext";
import { API_BASE_URL } from "../../../../config";
import FilterPanel from "../../Products/FilterPanel/FilterPanel";
import { CartContext } from "../../../Context/CartContext";
import ButtonBaskets from "../ButtonBaskets/ButtonBaskets";
import { useTranslation } from "react-i18next";
import { createLanguageToggle, createNotificationActions } from "../../../utils/languageUtils";





export default function ProductsNavbar({onFilter}) {
  const { i18n, t } = useTranslation();
  let token = localStorage.getItem("userToken");

  let { notifications, markAllRead, switchLanguage, hideNotificationCount } =
    useContext(NotificationtContext);

  let { withPrice, setWithPrice } = useContext(CartContext);

  const [open, setOpen] = useState(false);

  // Create standardized language toggle and notification actions
  const toggleLanguage = createLanguageToggle(i18n, switchLanguage);
  const { ApprovedPrice, RejectPrice } = createNotificationActions(t, token, API_BASE_URL);

  // Open Menu
  function toggleDropdown() {
    setOpen((prev) => !prev);

    if (!open && notifications?.length > 0) {
      markAllRead();
      hideNotificationCount();
    }
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

                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {notif.type?.replace(/_/g, " ")}
                          </p>

                          <p className="text-sm text-gray-700 font-medium">
                            {notif.content}
                          </p>

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

          {/* title & filter */}
          <div className="mt-2 w-[95%] mx-auto">
            <div className="flex justify-between items-center mx-4">
              <h1 className="text-4xl ms-6 text-white font-bold">{t('products.title')}</h1>

              <div className="flex items-center">
                <label className="flex  items-center gap-2 bg-white textColor rounded-lg px-4 py-1 me-2 cursor-pointer mt-2">
                  {t('with_price')}
                  <input
                    type="checkbox"
                    checked={withPrice}
                    className="accent-[#1243AF] w-3 h-3 cursor-pointer"
                    onChange={(e) => setWithPrice(e.target.checked)}
                  />
                </label>
                <ButtonBaskets />
              </div>
            </div>

            <FilterPanel onFilter={onFilter} />
          </div>
        </div>
      </div>
    </nav>
  );
}
