import React from "react";
const Dashboard = React.lazy(() => import("../Dashboard/Dashboard"));
const ToDoNavbar = React.lazy(() => import("./ToDoNavbar/ToDoNavbar"));
import TabsTable from "./TabsTable/TabsTable";
import LogicToDoList from "./LogicToDoList";

export default function ToDoList() {
  return (
    <section>
      <div className="grid grid-cols-[320px_1fr] me-4 ">
        {/*Slilde bar */}
        <div className="mb-14 me-8">
          <Dashboard />
        </div>

        {/*Navbar */}
        <div>
          <ToDoNavbar />

          {/* Content */}

          {/* Main Div */}
          <div className="my-60">
            <LogicToDoList/>
          </div>
        </div>
      </div>
    </section>
  );
}
