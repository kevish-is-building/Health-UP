import React, { useState } from "react";
import SidebarDemo from "./components/sidebar-demo";

function App({ children }) {
  return (
    <div className="flex bg-gray-50">
      <div className="h-screen fixed z-10">
        <SidebarDemo />
      </div>

      <main className="flex-1 flex flex-col bg-emerald-100 min-h-screen h-fit  pl-12">
        {children}
      </main>
    </div>
  );
}

export default App;
