import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Loader2,
  MapPin,
  Home,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import useListingStore from "../../store/listing";
import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";

const initialForm = {
  title: "",
  description: "",

  location: {
    city: "",
    region: "",
  },

  roomType: "single",
  furnished: "unfurnished",
  availableRooms: 1,

  price: "",
  paymentPeriod: "monthly",

  amenities: "",
};

const Listings = () => {
  const {
    myListings,
    fetchMyListings,
    createListing,
    updateListing,
    deleteListing,
    loading,
  } = useListingStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  // =====================================================
  // LOAD MY LISTINGS
  // =====================================================

  useEffect(() => {
    fetchMyListings().catch((error) => {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load your listings"
      );
    });
  }, [fetchMyListings]);

  // =====================================================
  // NORMAL INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // LOCATION INPUT
  // =====================================================

  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Listing title is required");
      return;
    }

    if (formData.description.trim().length < 20) {
      toast.error(
        "Description must be at least 20 characters"
      );
      return;
    }

    if (!formData.location.city.trim()) {
      toast.error("City is required");
      return;
    }

    if (!formData.location.region.trim()) {
      toast.error("Region is required");
      return;
    }

    if (
      !formData.price ||
      Number(formData.price) < 0
    ) {
      toast.error("Enter a valid price");
      return;
    }

    if (
      !formData.availableRooms ||
      Number(formData.availableRooms) < 1
    ) {
      toast.error("Available rooms must be at least 1");
      return;
    }

    const payload = {
      title: formData.title.trim(),

      description: formData.description.trim(),

      location: {
        city: formData.location.city.trim(),
        region: formData.location.region.trim(),
      },

      roomType: formData.roomType,

      // IMPORTANT:
      // This is now a string instead of true/false
      furnished: formData.furnished,

      availableRooms: Number(
        formData.availableRooms
      ),

      price: Number(formData.price),

      paymentPeriod: formData.paymentPeriod,

      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateListing(editingId, payload);

        toast.success(
          "Listing updated successfully"
        );
      } else {
        await createListing(payload);

        toast.success(
          "Listing created successfully"
        );
      }

      setFormData(initialForm);
      setEditingId(null);
      setShowForm(false);

      // Get fresh data from database
      await fetchMyListings();

    } catch (error) {
      console.error(
        "Listing submit error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save listing"
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (listing) => {
    setEditingId(listing._id);

    setFormData({
      title: listing.title || "",

      description:
        listing.description || "",

      location: {
        city: listing.location?.city || "",
        region: listing.location?.region || "",
      },

      roomType:
        listing.roomType || "single",

      furnished:
        listing.furnished || "unfurnished",

      availableRooms:
        listing.availableRooms || 1,

      price:
        listing.price || "",

      paymentPeriod:
        listing.paymentPeriod || "monthly",

      amenities:
        Array.isArray(listing.amenities)
          ? listing.amenities.join(", ")
          : "",
    });

    setShowForm(true);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      await deleteListing(id);

      toast.success(
        "Listing deleted successfully"
      );

      await fetchMyListings();

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete listing"
      );
    }
  };

  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AppLayout>

      <TopBar title="My Listings" />

      <div className="min-h-screen bg-slate-50 p-4 md:p-6">

        <div className="max-w-6xl mx-auto">

          {/* ============================================
              HEADER
          ============================================ */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                My Listings
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage your accommodation listings.
              </p>

            </div>

            {!showForm && (
              <button
                onClick={() => {
                  setFormData(initialForm);
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                <Plus size={18} />

                Create Listing
              </button>
            )}

          </div>


          {/* ============================================
              FORM
          ============================================ */}

          {showForm && (

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8">

              <div className="flex items-center justify-between p-6 border-b border-slate-100">

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">

                    {editingId
                      ? "Edit Listing"
                      : "Create Listing"}

                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Add information about your accommodation.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X size={20} />
                </button>

              </div>


              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6"
              >

                {/* TITLE */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Listing Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Spacious room near UPSA"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>


                {/* DESCRIPTION */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the room, house, surroundings, rules, etc."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    Minimum 20 characters
                  </p>

                </div>


                {/* LOCATION */}

                <div>

                  <h3 className="font-semibold text-slate-900 mb-3">
                    Location
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={
                          formData.location.city
                        }
                        onChange={
                          handleLocationChange
                        }
                        placeholder="Accra"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                    </div>


                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Region
                      </label>

                      <input
                        type="text"
                        name="region"
                        value={
                          formData.location.region
                        }
                        onChange={
                          handleLocationChange
                        }
                        placeholder="Greater Accra"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                    </div>

                  </div>

                </div>


                {/* ROOM DETAILS */}

                <div>

                  <h3 className="font-semibold text-slate-900 mb-3">
                    Room Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* ROOM TYPE */}

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Room Type
                      </label>

                      <select
                        name="roomType"
                        value={
                          formData.roomType
                        }
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white"
                      >

                        <option value="single">
                          Single
                        </option>

                        <option value="shared">
                          Shared
                        </option>

                        <option value="studio">
                          Studio
                        </option>

                      </select>

                    </div>


                    {/* AVAILABLE ROOMS */}

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Available Rooms
                      </label>

                      <input
                        type="number"
                        name="availableRooms"
                        min="1"
                        value={
                          formData.availableRooms
                        }
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                      />

                    </div>


                    {/* PRICE */}

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price (GHS)
                      </label>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="1200"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                      />

                    </div>

                  </div>

                </div>


                {/* PAYMENT */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Period
                  </label>

                  <select
                    name="paymentPeriod"
                    value={
                      formData.paymentPeriod
                    }
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white"
                  >

                    <option value="monthly">
                      Monthly
                    </option>

                    <option value="semester">
                      Semester
                    </option>

                    <option value="yearly">
                      Yearly
                    </option>

                  </select>

                </div>


                {/* FURNISHED */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Furnishing
                  </label>

                  <select
                    name="furnished"
                    value={
                      formData.furnished
                    }
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white"
                  >

                    <option value="unfurnished">
                      Unfurnished
                    </option>

                    <option value="furnished">
                      Furnished
                    </option>

                  </select>

                </div>


                {/* AMENITIES */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amenities
                  </label>

                  <input
                    type="text"
                    name="amenities"
                    value={
                      formData.amenities
                    }
                    onChange={handleChange}
                    placeholder="WiFi, Water, Electricity, Parking"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    Separate amenities with commas.
                  </p>

                </div>


                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                  >

                    {loading && (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    )}

                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Listing"
                      : "Create Listing"}

                  </button>

                </div>

              </form>

            </div>

          )}


          {/* ============================================
              MY LISTINGS
          ============================================ */}

          {!showForm && (

            <>

              {loading && myListings.length === 0 ? (

                <div className="flex justify-center py-20">

                  <Loader2
                    className="animate-spin text-indigo-600"
                    size={30}
                  />

                </div>

              ) : myListings.length === 0 ? (

                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                  <Home
                    size={40}
                    className="mx-auto text-slate-300 mb-3"
                  />

                  <h2 className="text-lg font-semibold text-slate-800">
                    No listings yet
                  </h2>

                  <p className="text-sm text-slate-500 mt-1 mb-5">
                    Create your first accommodation listing.
                  </p>

                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    <Plus size={18} />
                    Create Listing
                  </button>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {myListings.map((listing) => (

                    <div
                      key={listing._id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                    >

                      {/* CARD HEADER */}

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <h2 className="font-semibold text-slate-900">
                              {listing.title}
                            </h2>

                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                              <MapPin size={14} />

                              {listing.location?.city},{" "}
                              {listing.location?.region}

                            </div>

                          </div>

                          <span className="text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 capitalize">
                            {listing.roomType}
                          </span>

                        </div>


                        <p className="text-sm text-slate-600 mt-4 line-clamp-3">
                          {listing.description}
                        </p>


                        <div className="mt-4 pt-4 border-t border-slate-100">

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="text-lg font-bold text-slate-900">
                                GHS{" "}
                                {Number(
                                  listing.price
                                ).toLocaleString()}
                              </p>

                              <p className="text-xs text-slate-400 capitalize">
                                per{" "}
                                {listing.paymentPeriod}
                              </p>

                            </div>


                            <div className="text-right">

                              <p className="text-sm font-medium text-slate-700">
                                {listing.availableRooms}
                              </p>

                              <p className="text-xs text-slate-400">
                                room(s) available
                              </p>

                            </div>

                          </div>

                        </div>


                        {/* FURNISHED */}

                        <div className="mt-3">

                          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 capitalize">
                            {listing.furnished}
                          </span>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex border-t border-slate-100">

                        <button
                          onClick={() =>
                            handleEdit(listing)
                          }
                          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>


                        <button
                          onClick={() =>
                            handleDelete(
                              listing._id
                            )
                          }
                          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:bg-red-50 border-l border-slate-100"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </>

          )}

        </div>

      </div>

    </AppLayout>
  );
};

export default Listings;
