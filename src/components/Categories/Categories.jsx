import React from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const CategoriesNavbar = React.lazy(() =>
  import("./CategoriesNavbar/CategoriesNavbar")
);
const Category = React.lazy(() => import("../Category/Category"));

export default function Categories() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr]">
        {/*Slilde bar */}
        <div className="mb-14">
          <Dashboard />
        </div>

        <div>
          {/*Navbar */}
          <CategoriesNavbar />
          {/* Content */}
          <div className="mt-52">
            <Category />
          </div>
        </div>

      </div>
    </section>
  );
}
