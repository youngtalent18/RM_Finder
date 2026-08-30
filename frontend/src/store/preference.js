import { create } from "zustand";
import api from "../lib/axios.js";

const usePreferenceStore = create((set) => ({
    loading: false,
    error: null,
    preference: null,

    createPreference: async (data) => {
        set({ loading: true });

        try{
            const res = await api.post("/preferences", data);
            set({ preference: res.data.data, loading: false });
            return res.data;
        }catch (error){
            set({ loading: false, error: error.message });
            throw error;
        }

    },

    getPreferences: async () => {
        set({ loading: true });

        try{
            const res = await api.get("/preferences/me");
            set({ preference: res.data, loading: false });
            return res.data;
        }catch (error){
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    updatePreference: async (data) => {
        set({ loading: true });

        try{
            const res = await api.put("/preferences", data);
            set({ preference: res.data.data, loading: false });
            return res.data;
        }catch (error){
            set({ loading: false, error: error.message });
            throw error;
        }
    },

    deletePreference: async (preferenceId) => {
        set({ loading: true });

        try{
            await api.delete(`/preferences/${preferenceId}`);
            set({ preference: null, loading: false });
        }catch (error){
            set({ loading: false, error: error.message });
            throw error;
        }
    },

}));

export default usePreferenceStore;