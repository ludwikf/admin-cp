import React from "react";

export default function NotFound() {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <span className="text-5xl border-r-2 pr-4 mr-4 text-mainTheme">404</span>
      <p className="text-lg ">This page could not be found.</p>
    </div>
  );
}
