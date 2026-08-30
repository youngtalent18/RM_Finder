import { create } from "zustand";
import api from "../lib/axios.js";


const useListingStore = create((set) => ({

  listings: [],

  myListings: [],

  listing: null,

  loading: false,

  error: null,


  fetchListings: async () => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res =
        await api.get("/listings");

      set({

        listings:
          res.data.data || [],

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


  fetchMyListings: async () => {
  set({
    loading: true,
    error: null,
  });

  try {
    const res = await api.get("/listings/mine");

    set({
      myListings: res.data.listings || [],
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

  fetchListingById: async (id) => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res =
        await api.get(
          `/listings/${id}`
        );

      set({

        listing:
          res.data.data,

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
  createListing: async (data) => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res =
        await api.post(
          "/listings",
          data
        );


      set((state) => ({

        listings: [
          res.data.data,
          ...state.listings,
        ],

        myListings: [
          res.data.data,
          ...state.myListings,
        ],

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

  updateListing: async (id, data) => {

    set({
      loading: true,
      error: null,
    });

    try {

      const res =
        await api.put(
          `/listings/${id}`,
          data
        );


      set((state) => ({

        listings:
          state.listings.map(
            (item) =>
              item._id === id
                ? res.data.data
                : item
          ),

        myListings:
          state.myListings.map(
            (item) =>
              item._id === id
                ? res.data.data
                : item
          ),

        listing:
          res.data.data,

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

  deleteListing: async (id) => {

    set({
      loading: true,
      error: null,
    });

    try {

      await api.delete(
        `/listings/${id}`
      );


      set((state) => ({

        listings:
          state.listings.filter(
            (item) =>
              item._id !== id
          ),

        myListings:
          state.myListings.filter(
            (item) =>
              item._id !== id
          ),

        listing:
          state.listing?._id === id
            ? null
            : state.listing,

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


  clearError: () => {

    set({
      error: null,
    });

  },


  clearListing: () => {

    set({
      listing: null,
    });

  },

}));


export default useListingStore;
