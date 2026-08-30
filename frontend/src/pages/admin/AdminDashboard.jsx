import {
  Users,
  Home,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useEffect } from "react";
import { Link } from "react-router-dom";

import useAdminStore from "../../store/admin";
import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";


const AdminDashboard = () => { 
  const {  adminStats, loading, error, fetchAdminStats  } = useAdminStore();


  // ==================================================
  // FETCH DASHBOARD STATS
  // ==================================================

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);


  return (
    <AppLayout>

      <TopBar title="Admin Dashboard" />


      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Overview of your RM Finder platform.
          </p>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">

            <AlertCircle className="w-5 h-5 text-red-500" />

            <div>

              <p className="text-sm font-medium text-red-700">
                Unable to load dashboard statistics
              </p>

              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


          <StatCard
            title="Total Users"
            value={adminStats?.totalUsers ?? 0}
            change="+12.5%"
            icon={Users}
          />


          <StatCard
            title="Total Profiles"
            value={adminStats?.totalUserProfiles ?? 0}
            change="+8.2%"
            icon={UserCheck}
          />


          <StatCard
            title="Total Preferences"
            value={adminStats?.totalPreference ?? 0}
            change="+5.4%"
            icon={TrendingUp}
          />


          <StatCard
            title="Total Roommates"
            value={adminStats?.totalRoommate ?? 0}
            change="+15.8%"
            icon={MessageSquare}
          />

        </div>


        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* ==================================================
              PLATFORM OVERVIEW
          ================================================== */}

          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm">


            <div className="p-6 border-b border-slate-100 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Platform Overview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Current platform statistics.
                </p>

              </div>


              <TrendingUp className="w-5 h-5 text-indigo-600" />

            </div>


            <div className="p-6">

              {loading ? (

                <div className="h-64 flex items-center justify-center">

                  <div className="flex flex-col items-center gap-3">

                    <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />

                    <p className="text-sm text-slate-500">
                      Loading statistics...
                    </p>

                  </div>

                </div>

              ) : (

                <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-xl">

                  <div className="text-center">

                    <TrendingUp className="w-10 h-10 text-slate-300 mx-auto" />

                    <p className="text-sm text-slate-500 mt-3">
                      Analytics chart will appear here
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Connect your analytics API to display activity.
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">


            <div className="p-6 border-b border-slate-100">

              <h2 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Common administrative tasks.
              </p>

            </div>


            <div className="p-4 space-y-2">


              {/* MANAGE USERS */}

              <QuickAction
                to="/admin/students"
                icon={Users}
                title="Manage Users"
                description="View and manage users"
              />


              {/* MANAGE LISTINGS */}

              <QuickAction
                to="/admin/listings"
                icon={Home}
                title="Manage Listings"
                description="Review room listings"
              />


              {/* VIEW MESSAGES */}

              <QuickAction
                to="/admin/messages"
                icon={MessageSquare}
                title="View Messages"
                description="Monitor platform messages"
              />


              {/* REVIEW ACCOUNTS */}

              <QuickAction
                to="/admin/students"
                icon={UserCheck}
                title="Review Accounts"
                description="Check user accounts"
              />

            </div>

          </div>

        </div>


        {/* ==================================================
            RECENT ACTIVITY
        ================================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">


          <div className="p-6 border-b border-slate-100 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Recent Activity
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest activity on the platform.
              </p>

            </div>


            <Link
              to="/admin/students"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >

              View all

              <ArrowUpRight className="w-4 h-4" />

            </Link>

          </div>


          <div className="divide-y divide-slate-100">


            <Activity
              title="New user registered"
              description="A new user joined RM Finder."
              time="5 minutes ago"
            />


            <Activity
              title="New listing submitted"
              description="A new room listing was submitted."
              time="25 minutes ago"
            />


            <Activity
              title="Profile updated"
              description="A user updated their profile."
              time="1 hour ago"
            />


            <Activity
              title="New conversation"
              description="Two users started a conversation."
              time="2 hours ago"
            />

          </div>

        </div>

      </div>

    </AppLayout>
  );
};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
}) => {

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

          <Icon className="w-5 h-5 text-indigo-600" />

        </div>


        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {change}
        </span>

      </div>


      <p className="text-sm text-slate-500 mt-5">
        {title}
      </p>


      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>

  );
};


// ======================================================
// QUICK ACTION
// ======================================================

const QuickAction = ({
  to,
  icon: Icon,
  title,
  description,
}) => {

  return (

    <Link
      to={to}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition text-left group"
    >

      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">

        <Icon className="w-5 h-5 text-indigo-600" />

      </div>


      <div className="flex-1 min-w-0">

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          {description}
        </p>

      </div>


      <ArrowUpRight
        className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition"
      />

    </Link>

  );
};


// ======================================================
// ACTIVITY
// ======================================================

const Activity = ({
  title,
  description,
  time,
}) => {

  return (

    <div className="p-5 flex items-center gap-4">

      <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">

        <Plus className="w-4 h-4 text-indigo-600" />

      </div>


      <div className="flex-1">

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>

      </div>


      <p className="text-xs text-slate-400 whitespace-nowrap">
        {time}
      </p>

    </div>

  );
};


export default AdminDashboard;