import { create } from "zustand";
import { toast } from "react-hot-toast";
import api from "../lib/axios.js";

const roommateStore = create((set) => ({
  requests: [],
  loading: false,
  error: null,

  getRequests: async (type = "all") => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/roommates/requests", { params: { type } });
      set({ requests: res.data.data || [], loading: false });
      return res.data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load roommate requests";
      set({ loading: false, error: message });
      throw error;
    }
  },

  sendRequest: async (recipientId, message = "") => {
    try {
      set({ loading: true, error: null });
      const res = await api.post(`/roommates/requests/${recipientId}`, { message });
      set((state) => ({ requests: [res.data.data, ...state.requests], loading: false }));
      toast.success("Roommate request sent");
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to send roommate request";
      set({ loading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  updateRequest: async (requestId, status) => {
    try {
      set({ loading: true, error: null });
      const res = await api.patch(`/roommates/requests/${requestId}`, { status });
      set((state) => ({ requests: state.requests.map((request) => request._id === requestId ? res.data.data : request), loading: false }));
      toast.success(res.data.message || "Roommate request updated");
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to update roommate request";
      set({ loading: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default roommateStore;
