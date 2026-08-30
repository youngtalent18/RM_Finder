import { create } from "zustand";
import api from "../lib/axios.js";

const useAdminStore = create((set) => ({
  loading: false,
  error: null,

  user: null,
  users: [],

  profile: null,
  profiles: [],

  preferences: [],

  adminStats: null,
  messages: [],


  // FETCH ALL USERS
  fetchUsers: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get("/admin/users");

      set({
        users: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // FETCH USER BY ID
  // ==========================================
  fetchUserById: async (userId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get(
        `/admin/users/${userId}`
      );

      set({
        user: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // DELETE USER
  // ==========================================
  deleteUser: async (userId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.delete(
        `/admin/users/${userId}`
      );

      set((state) => ({
        users: state.users.filter(
          (user) => user._id !== userId
        ),
        user: null,
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // FETCH ALL PROFILES
  // ==========================================
  fetchProfiles: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get(
        "/admin/profiles"
      );

      set({
        profiles: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // FETCH PROFILE BY ID
  // ==========================================
  fetchProfileById: async (profileId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get(
        `/admin/profiles/${profileId}`
      );

      set({
        profile: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // DELETE PROFILE
  // ==========================================
  deleteProfile: async (profileId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.delete(
        `/admin/profiles/${profileId}`
      );

      set((state) => ({
        profiles: state.profiles.filter(
          (profile) => profile._id !== profileId
        ),
        profile: null,
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // FETCH ADMIN DASHBOARD STATS
  // ==========================================
  fetchAdminStats: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get("/admin");

      set({
        adminStats: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // FETCH ALL PREFERENCES
  // ==========================================
  fetchPreferences: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get(
        "/admin/preferences"
      );

      set({
        preferences: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // FETCH PREFERENCES BY USER ID
  // ==========================================
  fetchPreferencesByUserId: async (userId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get(
        `/admin/preferences/users/${userId}`
      );

      set({
        preferences: res.data.data,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },


  // ==========================================
  // DELETE PREFERENCE
  // ==========================================
  deletePreference: async (preferenceId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.delete(
        `/admin/preferences/${preferenceId}`
      );

      set((state) => ({
        preferences: state.preferences.filter(
          (preference) =>
            preference._id !== preferenceId
        ),
        loading: false,
      }));

      return res.data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message,
      });

      throw error;
    }
  },

fetchMessages: async () => {
    set({
        loading: true,
        error: null,
    });

    try {

        const res = await api.get(
            "/admin/messages"
        );

        set({
            messages: res.data.messages || [],
            loading: false,
        });

        return res.data;

    } catch (error) {

        set({
            loading: false,
            error:
                error.response?.data?.message ||
                error.message,
        });

        throw error;
    }
},


deleteMessage: async (messageId) => {
    set({
        loading: true,
        error: null,
    });

    try {

        await api.delete(
            `/admin/messages/${messageId}`
        );

        set((state) => ({
            messages: state.messages.filter(
                (message) =>
                    message._id !== messageId
            ),
            loading: false,
        }));

    } catch (error) {

        set({
            loading: false,
            error:
                error.response?.data?.message ||
                error.message,
        });

        throw error;
    }
},


  // CLEAR ERROR
  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useAdminStore;
