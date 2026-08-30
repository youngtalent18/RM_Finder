import { create } from "zustand";
import api from "../lib/axios.js";


const profileStore = create((set) => ({
  profile: null,
  roommates: [],
  roommateCount: 0,
  loading: false,
  error: null,


  createProfile: async (formData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await api.post(
        "/profile/createProfile",
        formData
      );

      set({
        profile: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile creation failed";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },


  getMyProfile: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await api.get(
        "/profile/personal"
      );

      set({
        profile: res.data.data,
        loading: false,
      });

      return res.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile fetch failed";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },



  getUserProfileById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await api.get(
        `/profile/personal/${id}`
      );

      set({
        loading: false,
      });

      return res.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile fetch failed";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  getRoommates: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/profile/roommates");
      set({ roommates: res.data.data || [], roommateCount: res.data.count || 0, loading: false });
      return res.data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Unable to load roommates";
      set({ loading: false, error: message });
      throw error;
    }
  },



  updateProfile: async (formData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await api.put(
        "/profile/personal",
        formData
      );

      set({
        profile: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile update failed";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },


  deleteProfile: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      await api.delete(
        "/profile/personal"
      );

      set({
        profile: null,
        loading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile deletion failed";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },


  clearProfile: () => {
    set({
      profile: null,
      error: null,
    });
  },


  clearError: () => {
    set({
      error: null,
    });
  },
}));


export default profileStore;
