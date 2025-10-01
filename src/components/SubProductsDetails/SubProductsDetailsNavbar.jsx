import React, { useContext, useState } from "react";
import background from "../../assets/Photos/backgroundNavbar.jpg";
import { LuBellRing } from "react-icons/lu";
import { IoLanguageSharp } from "react-icons/io5";
import FilterPanel from "../Products/FilterPanel/FilterPanel";
import { NotificationtContext } from "../../Context/NotificationContext";
import { NavLink } from "react-router-dom";

export default function SubProductsDetailsNavbar({ onFilter }) {
  const { notifications } = useContext(NotificationtContext);
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="h-[175px] bg-white rounded-2xl fixed pt-2 right-2 left-54 z-50">
        <div
          className="bg-center bg-cover bg-repeat w-full h-[175px] rounded-2xl animate-backgroundMove"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="flex justify-end items-center relative">
            <IoLanguageSharp className="text-white text-2xl mt-3 me-2" />

            {/* notification */}
            <div className="relative mt-4 me-4">
              <LuBellRing
                className="text-white text-2xl cursor-pointer"
                onClick={() => setOpen(!open)}
              />
              {notifications?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}

              {open && (
                <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications.map((notif) => (
                      <NavLink key={notif.id} to={"/Customers"}>
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
                        </div>
                      </NavLink>
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

          {/* title & filter */}
          <div className="mt-2 w-[95%] mx-auto">
            <h1 className="text-4xl ms-6 text-white font-bold">
              Products Details
            </h1>

            <FilterPanel onFilter={onFilter} />
          </div>
        </div>
      </div>
    </nav>
  );
}
