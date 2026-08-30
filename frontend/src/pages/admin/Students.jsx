import {
  Users,
  Search,
  Eye,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Mail,
  Calendar,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import useAdminStore from "../../store/admin";


const Students = () => {

  const {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    deleteUser,
  } = useAdminStore();


  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);


  // ==========================================
  // FETCH USERS
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  // ==========================================
  // SEARCH USERS
  // ==========================================

  const filteredUsers = users.filter((student) => {

    const searchValue = search.toLowerCase();

    return (
      student.firstName?.toLowerCase().includes(searchValue) ||
      student.lastName?.toLowerCase().includes(searchValue) ||
      student.email?.toLowerCase().includes(searchValue)
    );

  });


  // ==========================================
  // VIEW USER
  // ==========================================

  const handleViewUser = async (userId) => {

    try {

      const data = await fetchUserById(userId);

      setSelectedUser(data.data || data);

      setShowUserModal(true);

    } catch (error) {

      console.error("Failed to fetch user", error);

    }

  };


  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (userId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;


    try {

      setDeletingUserId(userId);

      await deleteUser(userId);

    } catch (error) {

      console.error("Failed to delete user", error);

    } finally {

      setDeletingUserId(null);

    }

  };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };


  return (
    <AppLayout>

      <TopBar title="Students" />


      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Manage Students
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              View and manage registered users on RM Finder.
            </p>

          </div>


          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl">

            <Users className="w-5 h-5" />

            <span className="text-sm font-semibold">
              {users.length} Users
            </span>

          </div>

        </div>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">

            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />

            <div>

              <p className="text-sm font-medium text-red-700">
                Unable to load users
              </p>

              <p className="text-xs text-red-600 mt-1">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ==========================================
            SEARCH
        ========================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">

          <div className="relative max-w-md">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

          </div>

        </div>


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && users.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[300px] flex items-center justify-center">

            <div className="flex flex-col items-center gap-3">

              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

              <p className="text-sm text-slate-500">
                Loading users...
              </p>

            </div>

          </div>

        ) : (

          /* ==========================================
              USERS TABLE
          ========================================== */

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      User
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {filteredUsers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center"
                      >

                        <Users className="w-10 h-10 text-slate-300 mx-auto" />

                        <p className="text-sm font-medium text-slate-600 mt-3">
                          No users found
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Try changing your search.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredUsers.map((student) => (

                      <tr
                        key={student._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* USER */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">

                              <span className="text-sm font-semibold text-indigo-600">
                                {student.firstName?.charAt(0)}
                                {student.lastName?.charAt(0)}
                              </span>

                            </div>


                            <div>

                              <p className="text-sm font-medium text-slate-800">
                                {student.firstName} {student.lastName}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID: {student._id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            <Mail className="w-4 h-4 text-slate-400" />

                            <span className="text-sm text-slate-600">
                              {student.email}
                            </span>

                          </div>

                        </td>


                        {/* ROLE */}

                        <td className="px-6 py-4">

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">

                            <ShieldCheck className="w-3 h-3" />

                            {student.role || "Student"}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-4">

                          {student.isActive !== false ? (

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">

                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                              Active

                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">

                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />

                              Inactive

                            </span>

                          )}

                        </td>


                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end items-center gap-2">

                            


                            {/* DELETE */}

                            <button
                              onClick={() =>
                                handleDeleteUser(student._id)
                              }
                              disabled={
                                deletingUserId === student._id
                              }
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                              title="Delete user"
                            >

                              {deletingUserId === student._id ? (

                                <Loader2 className="w-4 h-4 animate-spin" />

                              ) : (

                                <Trash2 className="w-4 h-4" />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* ==========================================
            USER COUNT
        ========================================== */}

        {!loading && filteredUsers.length > 0 && (

          <p className="text-xs text-slate-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>

        )}

      </div>


      {/* ==========================================
          USER DETAILS MODAL
      ========================================== */}

      {showUserModal && selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  User Details
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Account information
                </p>

              </div>


              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >

                <X className="w-5 h-5 text-slate-500" />

              </button>

            </div>


            {/* MODAL BODY */}

            <div className="p-6 space-y-5">


              {/* AVATAR */}

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">

                  <span className="text-xl font-bold text-indigo-600">

                    {selectedUser.firstName?.charAt(0)}
                    {selectedUser.lastName?.charAt(0)}

                  </span>

                </div>


                <div>

                  <h3 className="text-lg font-semibold text-slate-900">

                    {selectedUser.firstName}{" "}
                    {selectedUser.lastName}

                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedUser.email}
                  </p>

                </div>

              </div>


              {/* DETAILS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={selectedUser.email}
                />


                <DetailItem
                  icon={ShieldCheck}
                  label="Role"
                  value={selectedUser.role || "Student"}
                />


                <DetailItem
                  icon={Calendar}
                  label="Joined"
                  value={
                    selectedUser.createdAt
                      ? new Date(
                          selectedUser.createdAt
                        ).toLocaleDateString()
                      : "N/A"
                  }
                />


                <DetailItem
                  icon={UserCheck}
                  label="Status"
                  value={
                    selectedUser.isActive !== false
                      ? "Active"
                      : "Inactive"
                  }
                />

              </div>


              {/* CLOSE */}

              <button
                onClick={closeModal}
                className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </AppLayout>
  );
};


// ==================================================
// DETAIL ITEM
// ==================================================

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {

  return (
    <div className="border border-slate-100 rounded-xl p-3">

      <div className="flex items-center gap-2">

        <Icon className="w-4 h-4 text-indigo-500" />

        <p className="text-xs text-slate-400">
          {label}
        </p>

      </div>

      <p className="text-sm font-medium text-slate-700 mt-2 break-words">
        {value || "N/A"}
      </p>

    </div>
  );
};


export default Students;
