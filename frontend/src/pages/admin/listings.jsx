import {
  AlertCircle,
  Home,
  Loader2,
  MapPin,
  Trash2,
  Eye,
  User,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import useListingStore from "../../store/listing";


const Listings = () => {
  const {
    listings,
    loading,
    error,
    fetchListings,
    deleteListing,
    clearError,
  } = useListingStore();

  const [deletingId, setDeletingId] = useState(null);
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteListing(id);

      toast.success("Listing deleted successfully");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to delete listing"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchListings();
      toast.success("Listings refreshed");
    } catch (error) {
      toast.error("Failed to refresh listings",error);
    }
  };


  if (loading && listings.length === 0) {
    return (
      <AppLayout>
        <TopBar title="Listings" />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">

            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading listings...
            </p>

          </div>
        </div>
      </AppLayout>
    );
  }

  if (error && listings.length === 0) {
    return (
      <AppLayout>
        <TopBar title="Listings" />

        <div className="min-h-[70vh] flex items-center justify-center p-6">

          <div className="max-w-md w-full text-center bg-white border border-red-200 rounded-2xl p-7 shadow-sm">

            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />

            <h1 className="font-semibold text-slate-800 mt-4">
              Unable to load listings
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              {error}
            </p>

            <button
              onClick={() => {
                clearError();
                fetchListings();
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>

        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <TopBar title="Listings" />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Manage Listings
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              View and manage all room listings on the platform.
            </p>

          </div>


          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />

            Refresh

          </button>

        </div>


        {/* ==========================================
            SUMMARY
        ========================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <SummaryCard
            icon={Home}
            title="Total Listings"
            value={listings.length}
          />

          <SummaryCard
            icon={User}
            title="Active Listings"
            value={
              listings.filter(
                (listing) =>
                  listing.status === "active" ||
                  listing.isActive === true
              ).length
            }
          />

          <SummaryCard
            icon={MapPin}
            title="Locations"
            value={
              new Set(
                listings
                  .map(
                    (listing) =>
                      listing.location?.city ||
                      listing.location
                  )
                  .filter(Boolean)
              ).size
            }
          />

        </div>


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {listings.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">

            <Home className="w-12 h-12 text-slate-300 mx-auto" />

            <h2 className="text-lg font-semibold text-slate-800 mt-4">
              No listings found
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              There are currently no room listings on the platform.
            </p>

          </div>

        ) : (

          /* ==========================================
             LISTINGS TABLE
          ========================================== */

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Listing
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {listings.map((listing) => {

                    const owner =
                      listing.user ||
                      listing.owner ||
                      {};

                    const location =
                      typeof listing.location === "string"
                        ? listing.location
                        : [
                            listing.location?.city,
                            listing.location?.region,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                          "Not specified";

                    const price =
                      listing.price ??
                      listing.budget ??
                      listing.rent ??
                      0;

                    const isActive =
                      listing.status === "active" ||
                      listing.isActive === true ||
                      !listing.status && listing.isActive !== false;


                    return (

                      <tr
                        key={listing._id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* LISTING */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">

                              <Home className="w-5 h-5 text-indigo-600" />

                            </div>

                            <div className="min-w-0">

                              <p className="font-medium text-slate-800 truncate max-w-[220px]">

                                {listing.title ||
                                  listing.name ||
                                  "Room Listing"}

                              </p>

                              <p className="text-xs text-slate-400 mt-0.5">

                                {listing.roomType ||
                                  listing.type ||
                                  "Room"}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* OWNER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">

                              <User className="w-4 h-4 text-indigo-600" />

                            </div>

                            <div>

                              <p className="text-sm font-medium text-slate-700">

                                {owner.name ||
                                  `${owner.firstName || ""} ${owner.lastName || ""}`.trim() ||
                                  "Unknown User"}

                              </p>

                              <p className="text-xs text-slate-400">

                                {owner.email || "No email"}

                              </p>

                            </div>

                          </div>

                        </td>


                        {/* LOCATION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <MapPin className="w-4 h-4 text-slate-400" />

                            {location}

                          </div>

                        </td>


                        {/* PRICE */}

                        <td className="px-5 py-4">

                          <p className="text-sm font-semibold text-slate-800">

                            GH₵ {Number(price || 0).toLocaleString()}

                          </p>

                          <p className="text-xs text-slate-400">
                            per month
                          </p>

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >

                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />

                            {isActive
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-2">

                            <Link
                              to={`/listings/${listing._id}`}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                              title="View listing"
                            >

                              <Eye size={16} />

                            </Link>


                            <button
                              onClick={() =>
                                handleDelete(listing._id)
                              }
                              disabled={
                                deletingId === listing._id
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                              title="Delete listing"
                            >

                              {deletingId === listing._id ? (

                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />

                              ) : (

                                <Trash2 size={16} />

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </AppLayout>
  );
};


// ======================================================
// SUMMARY CARD
// ======================================================

const SummaryCard = ({
  icon: Icon,
  title,
  value,
}) => {

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

          <Icon className="w-5 h-5 text-indigo-600" />

        </div>

        <div>

          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>

      </div>

    </div>

  );
};


export default Listings;