import React from "react";
import { Metadata } from "next";
import Admin from "./admin";

export const metadata: Metadata = {
  title: "Admin - Dinoverse",
  description: "Admin Dashboard for UCalgary Social Platform",
};

const Page = () => {
  return <Admin />
};

export default Page;
