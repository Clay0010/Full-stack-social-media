import React from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import Suggestions from "./Suggestions";

const Layout = ({ showSidebar = false, showSuggestions = false, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main area: sidebar + content */}
      <div className="flex flex-1">
        {showSidebar && (
          <div className="w-75 shadow-2xl bg-base-100 h-[91vh] sticky top-16 rounded-t-lg mr-5">
            <Sidebar />
          </div>
        )}

        <main className="flex-1 overflow-y-auto ">{children}</main>
        {showSuggestions && (
          <div className="w-75 shadow-2xl bg-base-100 h-[91vh] sticky top-16 rounded-t-lg ml-5">
            <Suggestions />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
