import React from "react";
import ThemeSelector from "./themeSelector";
import { Home, Info, BarChart, UserRound } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { logoutMutation } = useLogout();
  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 z-99">
      <div className="navbar-start">
        <a className="btn btn-ghost text-2xl font-bold" href="/">
          CircleUp
        </a>
      </div>

      <div className="navbar-center">
        <ul className="menu menu-horizontal bg-base-100 rounded-box">
          <li className="px-2">
            <a className="tooltip tooltip-bottom" data-tip="Home">
              <Home className="h-5 w-5" />
            </a>
          </li>
          <li className="px-2">
            <a className="tooltip tooltip-bottom" data-tip="User Profile">
              <UserRound className="h-5 w-5" />
            </a>
          </li>
          <li className="px-2">
            <a className="tooltip tooltip-bottom" data-tip="Home">
              <BarChart className="h-5 w-5" />
            </a>
          </li>
          <li className="px-2">
            <a className="tooltip tooltip-bottom" data-tip="Home">
              <BarChart className="h-5 w-5" />
            </a>
          </li>
          <li className="px-2">
            <a className="tooltip tooltip-bottom" data-tip="Home">
              <BarChart className="h-5 w-5" />
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-4">
        <input
          type="text"
          placeholder="Search People"
          className="input input-bordered w-24 md:w-auto"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between" href="/profile">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button onClick={logoutMutation}>Logout</button>
            </li>
          </ul>
        </div>
        <ThemeSelector />
      </div>
    </div>
  );
};

export default Navbar;
