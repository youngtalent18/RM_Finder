import { create } from "zustand";
import { toast } from "react-hot-toast";
import api from "../lib/axios.js";

export const userStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  setUser: (user) => set({ user }),

  // ================= REGISTER =================
  register: async ({ firstName, lastName, phone, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      throw new Error("Passwords do not match");
    }

    try {
      const res = await api.post("/auth/register", {
        firstName,
        lastName,
        phone,
        email,
        password,
      });

      set({ loading: false });

      toast.success(res.data.message || "account created successfully");

      return res.data;
    } catch (error) {
      set({ loading: false });

      console.error("Register error:", error);
      throw error;
    }
  },

  // ================= LOGIN =================
  signIn: async ({ email, password }) => {
    set({ loading: true });

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const user = res.data.user || (await api.get("/auth/profile")).data;

      set({
        user,
        loading: false,
      });

      toast.success("Login successful", {
        duration: 3000,
        id: "login-success",
      });

      return res.data;
    } catch (error) {
      set({ loading: false });

      console.error("Login error:", error);

      throw error;
    }
  },

  // ================= LOGOUT =================
  logout: async () => {
    try {
      await api.post("/auth/logout");

      // 🔥 STEP 1: CLEAR USER
      set({ user: null });

      toast.success("Logged out", {
        duration: 3000,
        id: "logout-success",
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // ================= CHECK AUTH =================
  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const res = await api.get("/auth/profile");

      set({
        user: res.data,
        checkingAuth: false,
      });

    } catch (error) {
      set({
        user: null,
        checkingAuth: false,
      });
      console.log("Auth check failed:", error);
    }
  },
}));

export default userStore;
