import { create } from "zustand";
import api from "../lib/axios.js";


const useMessageStore = create((set) => ({

  loading: false,
  error: null,

  conversations: [],
  messages: [],

  selectedUser: null,
  student: [],

  currentUser: null,


 fetchStudents: async () => {
    set({
        loading: true,
        error: null,
    });

    try {
        const res = await api.get("/messages/users");

        set({
            students: res.data.users || [],
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
  fetchConversations: async () => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res = await api.get(
        "/messages/conversations"
      );

      set({
        conversations:
          res.data.conversations || [],
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


  // ==================================================
  // GET CONVERSATION
  // ==================================================

  fetchConversation: async (userId) => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res = await api.get(
        `/messages/${userId}`
      );

      set({
        selectedUser: res.data.user,
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


  // ==================================================
  // SEND MESSAGE
  // ==================================================

  sendMessage: async (data) => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res = await api.post(
        "/messages",
        data
      );


      set((state) => ({
        messages: [
          ...state.messages,
          res.data.data,
        ],
        loading: false,
      }));


      // Refresh conversations
      const conversations =
        await api.get(
          "/messages/conversations"
        );


      set({
        conversations:
          conversations.data.conversations || [],
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


  // ==================================================
  // CLEAR SELECTED USER
  // ==================================================

  clearSelectedUser: () => {

    set({
      selectedUser: null,
      messages: [],
    });

  },


  // ==================================================
  // CLEAR ERROR
  // ==================================================

  clearError: () => {

    set({
      error: null,
    });

  },

}));


export default useMessageStore;
