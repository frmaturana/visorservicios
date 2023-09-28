"use client";

import React from "react";
import HeadFuction from "./components/headFunction/head";
import FooterFunction from "./components/footerFunction/footer";
import DashboardFunction from "./components/dashboardFunction/dashboard";

export default function Dashboard() {
  return (
    <div style={{ position: "relative" }}>
      <HeadFuction></HeadFuction>
      <DashboardFunction></DashboardFunction>
      <FooterFunction></FooterFunction>
    </div>
  );
}
