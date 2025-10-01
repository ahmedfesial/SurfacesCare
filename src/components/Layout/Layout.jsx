import React from "react";
import { Outlet } from "react-router-dom";
const Footer = React.lazy(() => import("../Footer/Footer"));

export default function Layout() {
  return (
    <>
      <div>
        <Outlet></Outlet>
      </div>
    </>
  );
}
