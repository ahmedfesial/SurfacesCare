import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import CatalogsNavbar from "./CatalogsNavbar/CatalogsNavbar";
import DataTableCatalogs from "./DataTableCatalogs/DataTableCatalogs";

export default function Catalogs() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
          <CatalogsNavbar />
          {/* Content */}
          <div className="relative top-40">
            <DataTableCatalogs />
          </div>
        </div>
      </div>
    </section>
  );
}
