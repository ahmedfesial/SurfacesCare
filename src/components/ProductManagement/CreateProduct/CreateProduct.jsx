import React from "react";
import Dashboard from "./../../Dashboard/Dashboard";
import ManagementNav from "../ManagementNav/ManagementNav";
import CreateProducts from "./CreateProducts/CreateProducts";

export default function CreateProduct() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
          <ManagementNav />
          {/* Content */}
          <div className="mt-52">
            <CreateProducts />
          </div>
        </div>
      </div>
    </section>
  );
}
