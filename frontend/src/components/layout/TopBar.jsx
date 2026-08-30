import {
  Search,
  Bell,
  Menu,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";
import userStore from "../../store/user.js";


const TopBar = ({ onMenuClick }) => {

  const { user } = userStore();


  const firstName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    "User";


  const lastName =
    user?.lastName ||
    user?.name?.split(" ").slice(1).join(" ") ||
    "";


  const fullName =
    `${firstName} ${lastName}`.trim();


  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();


  return (

    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">


      {/* ======================================
          LEFT SIDE
      ======================================= */}
      <div className="flex items-center gap-3">


        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition"
        >
          <Menu size={20} />
        </button>


        {/* Search */}
        <div className="hidden sm:flex items-center">

          <div className="relative">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search roommates..."
              className="w-56 md:w-72 pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />

          </div>

        </div>

      </div>


      {/* ======================================
          RIGHT SIDE
      ======================================= */}
      <div className="flex items-center gap-2 md:gap-4">


        {/* Mobile search */}
        <button
          type="button"
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition"
        >
          <Search size={19} />
        </button>


        {/* Notifications */}
        <button
          type="button"
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition"
        >

          <Bell size={19} />

          {/* Notification indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />

        </button>


        {/* Divider */}
        <div className="hidden sm:block h-7 w-px bg-slate-200" />


        {/* User */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 hover:bg-slate-50 rounded-xl px-2 py-1.5 transition"
        >

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-600 to-blue-500 flex items-center justify-center shrink-0">

            <span className="text-xs font-bold text-white">
              {initials || <UserRound size={16} />}
            </span>

          </div>


          {/* Name */}
          <div className="hidden md:block min-w-0">

            <p className="text-sm font-semibold text-slate-700 truncate max-w-32">
              {fullName || "User"}
            </p>

            <p className="text-[11px] text-slate-400 capitalize">
              {user?.role || "student"}
            </p>

          </div>

        </Link>

      </div>

    </header>
  );
};


export default TopBar;