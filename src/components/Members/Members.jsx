import React from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const MemberNavbar = React.lazy(() => import("./MemberNavbar/MemberNavbar"));
const DataTableMembers = React.lazy(() =>
  import("./DataTableMembers/DataTableMembers")
);

export default function Members() {
  return (
    <section>
      <div className="grid grid-cols-[270px_1fr] me-4">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Main Div  */}
        <div>
          {/*Navbar */}
          <MemberNavbar />

          {/* Content */}
          <div className="mt-52">
            <DataTableMembers />
          </div>
        </div>
      </div>
    </section>
  );
}
