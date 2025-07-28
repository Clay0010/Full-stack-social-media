import React, { useState } from "react";
import { Home, BarChart, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useGetAllUsers from "../hooks/useGetAllUsers";
import ThemeSelector from "./themeSelector";

const Navbar = () => {
  const navigate = useNavigate();
  const { logoutMutation } = useLogout();
  const { allUsers, isLoading, error } = useGetAllUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchUsers = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = allUsers.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    console.log(results);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50">
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
            <a className="tooltip tooltip-bottom" data-tip="Stats">
              <BarChart className="h-5 w-5" />
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-4">
        {/* Search Dropdown */}
        <div className="dropdown dropdown-end">
          <input
            type="text"
            placeholder="Search People"
            className="input input-bordered w-24 md:w-auto"
            value={searchQuery}
            onChange={handleSearchUsers}
            tabIndex={0}
          />
          {searchResults.length > 0 && (
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-md bg-base-200 rounded-box mt-1 w-100 p-2 shadow"
            >
              {searchResults.map((user) => (
                <li key={user.id} className="m-1 p-1">
                  <button
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="rounded-full p-2"
                    title="View Profile"
                  >
                    <img
                      src={user.profilePicUrl}
                      alt="user's image"
                      className="w-6 h-6 rounded-full "
                    />
                    <h1>{user.username}</h1>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile Dropdown */}
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
            className="menu menu-sm dropdown-content bg-base-200 rounded-box mt-3 w-52 p-2 shadow"
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
