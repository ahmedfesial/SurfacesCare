import React from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const BrandsNavbar = React.lazy(() => import("./BrandsNavbar/BrandsNavbar"));
const DataTableBrands = React.lazy(() =>
  import("./DataTableBrands/DataTableBrands")
);

export default function Brands() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
          <BrandsNavbar />
          {/* Content */}
          <div className="mt-52">
            <DataTableBrands />
          </div>
        </div>
      </div>
    </section>
  );
}
