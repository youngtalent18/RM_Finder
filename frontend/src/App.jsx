import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

import userStore from "./store/user";


// STUDENT PAGES

import StudentDashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Roommates from "./pages/student/Roommates";
import RoommateProfile from "./pages/student/RoommateProfile";
import Preferrences from "./pages/student/Preferrences";
import Messages from "./pages/student/Messages";
import Listings from "./pages/student/Listings";


// ADMIN PAGES

import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import AdminMessages from "./pages/admin/Messages";
import AdminListings from "./pages/admin/Listings";


// AUTH PAGES
import AuthPage from "./pages/auth/AuthPage";
import NotFound from "./pages/auth/NotFound";


// LOADING SCREEN
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="flex flex-col items-center gap-3">

        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

        <p className="text-sm text-slate-500">
          Loading...
        </p>

      </div>

    </div>
  );
}


// ADMIN ROUTE
function AdminRoute({ children }) {

  const user = userStore((state) => state.user);
  const checkingAuth = userStore((state) => state.checkingAuth);


  // Still checking authentication
  if (checkingAuth) {
    return <LoadingScreen />;
  }


  // User is not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }


  // User is logged in but not an admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }


  return children;
}


// STUDENT ROUTE
function StudentRoute({ children }) {

  const user = userStore((state) => state.user);
  const checkingAuth = userStore((state) => state.checkingAuth);


  // Still checking authentication
  if (checkingAuth) {
    return <LoadingScreen />;
  }


  // User is not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }


  // Admin trying to access student pages
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }


  return children;
}

// PUBLIC ROUTE
// Login / Register
function PublicRoute({ children }) {

  const user = userStore((state) => state.user);
  const checkingAuth = userStore((state) => state.checkingAuth);


  // Still checking authentication
  if (checkingAuth) {
    return <LoadingScreen />;
  }


  // User is already logged in
  if (user) {

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }


  return children;
}


function App() {

  const checkAuth = userStore((state) => state.checkAuth);


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  return (
    <>

      <BrowserRouter>

        <Routes>


          {/* 
              STUDENT DASHBOARD
           */}

          <Route
            path="/"
            element={
              <StudentRoute>
                <StudentDashboard />
              </StudentRoute>
            }
          />


          {/* 
              STUDENT PROFILE
           */}

          <Route
            path="/profile"
            element={
              <StudentRoute>
                <Profile />
              </StudentRoute>
            }
          />

          <Route
            path="/listings"
            element={
              <StudentRoute>
                <Listings />
              </StudentRoute>
            }
          />


          {/*  STUDENT ROOMMATES */}

          <Route
            path="/roommates"
            element={
              <StudentRoute>
                <Roommates />
              </StudentRoute>
            }
          />


          {/* 
              ROOMMATE PROFILE
           */}

          <Route
            path="/roommates/:id"
            element={
              <StudentRoute>
                <RoommateProfile />
              </StudentRoute>
            }
          />


          {/* 
              STUDENT PREFERENCES
           */}

          <Route
            path="/preferences"
            element={
              <StudentRoute>
                <Preferrences />
              </StudentRoute>
            }
          />



          {/* 
              STUDENT MESSAGES
           */}

          <Route
            path="/messages"
            element={
              <StudentRoute>
                <Messages />
              </StudentRoute>
            }
          />


          {/* 
              ADMIN DASHBOARD
           */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />


          {/* 
              ADMIN - MANAGE STUDENTS
           */}

          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <Students />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                <AdminMessages />
              </AdminRoute>
            }
          />


          {/* 
              ADMIN - MANAGE LISTINGS
           */}

          <Route
            path="/admin/listings"
            element={
              <AdminRoute>
                <AdminListings />
              </AdminRoute>
            }
          />


          {/* 
              AUTH
           */}

          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />


          {/* 
              404
           */}

          <Route
            path="*"
            element={<NotFound />}
          />


        </Routes>

      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

    </>
  );
}


export default App;