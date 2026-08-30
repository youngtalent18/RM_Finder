import RMF from "../../assets/RMF.png";

import {
  Users,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  Target,
  ChevronRight,
  UserRound,
  Search,
  FileCheck,
  Home,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import userStore from "../../store/user";

const STUDENT_NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Roommates",
    path: "/roommates",
    icon: Search,
  },
  {
    label: "Listings",
    path: "/listings",
    icon: Home,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Preferences",
    path: "/preferences",
    icon: Target,
  },
  {
    label: "Chat",
    path: "/messages",
    icon: MessageCircle,
  },
];


const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: Users,
  },
  {
    label: "Listings",
    path: "/admin/listings",
    icon: FileCheck,
  },
  {
    label: "Chat",
    path: "/admin/messages",
    icon: MessageCircle,
  },
];

const Sidebar = ({ onNavigate }) => {

  const { user, logout } = userStore();

  const location = useLocation();

  const handleLogout = async (e) => {

    e.preventDefault();

    try {

      await logout();

    } catch (error) {

      console.error("Logout failed", error);

    }

  };

  const navItems =
    user?.role === "admin"
      ? ADMIN_NAV_ITEMS
      : STUDENT_NAV_ITEMS;

  const isActiveRoute = (path) => {

    if (path === "/") {

      return location.pathname === "/";

    }

    if (path === "/admin") {

      return location.pathname === "/admin";

    }


 
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );

  };


  return (

    <div className="flex flex-col h-full shadow-lg">

      <div className="flex items-center gap-2 px-3 py-4 border-b border-slate-400">

        <img
          src={RMF}
          className="w-8 h-8 rounded-lg object-cover"
          alt="Roommate Finder logo"
        />


        <div>

          <span className="font-bold text-base text-slate-400">
            Roommate Finder
          </span>


          <p className="text-[10px] text-slate-400">

            {user?.role === "admin"
              ? "Admin Dashboard"
              : "Student Dashboard"}

          </p>

        </div>

      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">

        {navItems.map(
          ({ label, path, icon: Icon }) => {

            const active =
              isActiveRoute(path);


            return (

              <Link
                key={path}
                to={path}
                onClick={onNavigate}
                className={`
                  flex items-center gap-3
                  px-3 py-2.5
                  rounded-lg
                  text-sm font-medium
                  transition-all

                  ${
                    active
                      ? "bg-indigo-400/60 text-white"
                      : "text-slate-600 hover:bg-indigo-500 hover:text-white"
                  }
                `}
              >

                <Icon size={16} />


                <span>
                  {label}
                </span>


                {active && (

                  <ChevronRight
                    size={14}
                    className="ml-auto text-white"
                  />

                )}

              </Link>

            );

          }
        )}

        <div className="pt-5 pb-1 px-3">

          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">

            {user?.role === "admin"
              ? "Administration"
              : "Roommate Finder"}

          </p>

        </div>

      </nav>

      <div className="px-2 py-3 border-t border-slate-400">

        <Link
          to={
            user?.role === "admin"
              ? "/admin/profile"
              : "/profile"
          }
          className="flex items-center gap-3 px-3 py-2 mb-2"
        >


          {/* AVATAR */}

          <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-blue-500 flex items-center justify-center shrink-0">

            <span className="text-xs font-bold text-white">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </span>

          </div>


          {/* USER INFO */}

          <div className="min-w-0">

            <p className="text-sm text-slate-600 truncate">

              {user?.name || "User"}

            </p>


            <p className="text-xs text-slate-600 capitalize">

              {user?.role || "student"}

            </p>

          </div>

        </Link>

        <button
          onClick={handleLogout}
          className="
            w-full
            flex items-center gap-3
            px-3 py-2.5
            text-sm
            text-slate-400
            hover:text-red-400
            hover:bg-red-500/10
            rounded-lg
            transition
          "
        >

          <LogOut size={16} />

          Sign out

        </button>

      </div>

    </div>

  );

};


export default Sidebar;