import React from "react";

export default function Analytics() {
  return (
    <main className="flex min-h-screen">
      <div className="w-screen flex my-[25px] justify-center items-center flex-col">
        <div className="w-[90%] h-[16vh] flex">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-mainTheme">Monitor your website performance</p>
          </div>
        </div>
        <div className="w-[90%] h-[100vh] flex"></div>
      </div>
    </main>
  );
}
