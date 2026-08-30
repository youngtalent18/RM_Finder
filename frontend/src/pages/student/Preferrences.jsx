import {
  AlertCircle,
  Loader2,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import usePreferenceStore from "../../store/preference";

const Preferrences = () => {
  const {
    loading,
    error,
    preference,
    createPreference,
    updatePreference,
    getPreferences,
    deletePreference,
  } = usePreferenceStore();

  const [showForm, setShowForm] = useState(false);
  const [isEditting, setIsEditting] = useState(false);

  // FORM DATA
  const [formData, setFormData] = useState({
    preferrenceGender: "any",

    preferrenceAgeRange: {
      min: "",
      max: "",
    },

    preferredLocation: "",

    budget: {
      min: "",
      max: "",
    },

    smoking: "indifferent",
    drinking: "indifferent",
    pets: "indifferent",
    cleanliness: "indifferent",
    sleepHours: "flexible",
  });

  // ==========================================
  // GET PREFERENCES ON PAGE LOAD
  // ==========================================
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        await getPreferences();
      } catch (err) {
        // and should display the create form.
      }
    };

    loadPreferences();
  }, [getPreferences]);

  // ==========================================
  // IF NO PREFERENCE -> SHOW CREATE FORM
  // ==========================================
  useEffect(() => {
    if (!loading && !preference) {
      setShowForm(true);
      setIsEditting(false);
    }
  }, [loading, preference]);

  // ==========================================
  // HANDLE SIMPLE INPUTS
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE AGE RANGE
  // ==========================================
  const handleAgeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      preferrenceAgeRange: {
        ...prev.preferrenceAgeRange,
        [name]: value,
      },
    }));
  };

  // ==========================================
  // HANDLE BUDGET
  // ==========================================
  const handleBudgetChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        [name]: value,
      },
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================
  const resetForm = () => {
    setFormData({
      preferrenceGender: "any",

      preferrenceAgeRange: {
        min: "",
        max: "",
      },

      preferredLocation: "",

      budget: {
        min: "",
        max: "",
      },

      smoking: "indifferent",
      drinking: "indifferent",
      pets: "indifferent",
      cleanliness: "indifferent",
      sleepHours: "flexible",
    });

    setShowForm(false);
    setIsEditting(false);
  };

  // CREATE PREFERENCE
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const data = {
        preferrenceGender: formData.preferrenceGender,

        preferrenceAgeRange: {
          min:
            formData.preferrenceAgeRange.min === ""
              ? undefined
              : Number(formData.preferrenceAgeRange.min),

          max:
            formData.preferrenceAgeRange.max === ""
              ? undefined
              : Number(formData.preferrenceAgeRange.max),
        },

        preferredLocation: formData.preferredLocation,

        budget: {
          min:
            formData.budget.min === ""
              ? undefined
              : Number(formData.budget.min),

          max:
            formData.budget.max === ""
              ? undefined
              : Number(formData.budget.max),
        },

        smoking: formData.smoking,
        drinking: formData.drinking,
        pets: formData.pets,
        cleanliness: formData.cleanliness,
        sleepHours: formData.sleepHours,
      };

      await createPreference(data);

      toast.success("Preferences created successfully");

      setShowForm(false);
      setIsEditting(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create preferences"
      );
    }
  };

  // ==========================================
  // START EDITING
  // ==========================================
  const startEditing = () => {
    setFormData({
      preferrenceGender:
        preference?.preferrenceGender || "any",

      preferrenceAgeRange: {
        min: preference?.preferrenceAgeRange?.min ?? "",
        max: preference?.preferrenceAgeRange?.max ?? "",
      },

      preferredLocation:
        preference?.preferredLocation || "",

      budget: {
        min: preference?.budget?.min ?? "",
        max: preference?.budget?.max ?? "",
      },

      smoking: preference?.smoking || "indifferent",
      drinking: preference?.drinking || "indifferent",
      pets: preference?.pets || "indifferent",
      cleanliness:
        preference?.cleanliness || "indifferent",
      sleepHours:
        preference?.sleepHours || "flexible",
    });

    setIsEditting(true);
    setShowForm(true);
  };

  // ==========================================
  // UPDATE PREFERENCE
  // ==========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = {
        preferrenceGender: formData.preferrenceGender,

        preferrenceAgeRange: {
          min:
            formData.preferrenceAgeRange.min === ""
              ? undefined
              : Number(formData.preferrenceAgeRange.min),

          max:
            formData.preferrenceAgeRange.max === ""
              ? undefined
              : Number(formData.preferrenceAgeRange.max),
        },

        preferredLocation: formData.preferredLocation,

        budget: {
          min:
            formData.budget.min === ""
              ? undefined
              : Number(formData.budget.min),

          max:
            formData.budget.max === ""
              ? undefined
              : Number(formData.budget.max),
        },

        smoking: formData.smoking,
        drinking: formData.drinking,
        pets: formData.pets,
        cleanliness: formData.cleanliness,
        sleepHours: formData.sleepHours,
      };

      // Your Zustand updatePreference only accepts data
      await updatePreference(data);

      toast.success("Preferences updated successfully");

      setShowForm(false);
      setIsEditting(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update preferences"
      );
    }
  };

  // ==========================================
  // DELETE PREFERENCE
  // ==========================================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your preferences?"
    );

    if (!confirmed) return;

    try {
      await deletePreference(preference._id);

      toast.success("Preferences deleted successfully");

      // The store sets preference to null.
      // This effect will automatically show the form.
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete preferences"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading && !preference && !showForm) {
    return (
      <AppLayout>
        <TopBar title="Preferences" />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading preferences...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (
    !preference &&
    error &&
    !showForm &&
    !error.toLowerCase().includes("not found")
  ) {
    return (
      <AppLayout>
        <TopBar title="Preferences" />

        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="max-w-md text-center bg-white border border-red-200 rounded-2xl p-7 shadow-sm">

            <AlertCircle className="w-9 h-9 text-red-500 mx-auto" />

            <h1 className="font-semibold text-slate-800 mt-3">
              Unable to load your preferences
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {error}
            </p>

          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TopBar title="Preferences" />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* ==========================================
            HEADER
        ========================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2 md:px-6">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Preferences
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Tell us what you are looking for in a roommate.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          {preference && !showForm && (
            <div className="flex gap-2">

              <button
                onClick={startEditing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

            </div>
          )}
        </div>

        {/* ==========================================
            CREATE / EDIT FORM
        ========================================== */}
        {showForm && (
          <section className="mt-8 px-2 md:px-6">

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-7">

              {/* FORM HEADER */}
              <div className="flex items-center justify-between mb-7">

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {isEditting
                      ? "Edit Preferences"
                      : "Create Your Preferences"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Help us understand what kind of roommate
                    you are looking for.
                  </p>
                </div>

                {isEditting && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setIsEditting(false);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                )}

              </div>

              <form
                onSubmit={
                  isEditting
                    ? handleUpdate
                    : handleCreate
                }
                className="space-y-7"
              >

                {/* ======================================
                    GENDER
                ====================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Gender
                  </label>

                  <select
                    name="preferrenceGender"
                    value={formData.preferrenceGender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="any">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* ======================================
                    AGE RANGE
                ====================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Age Range
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      type="number"
                      name="min"
                      min="18"
                      value={
                        formData.preferrenceAgeRange.min
                      }
                      onChange={handleAgeChange}
                      placeholder="Minimum age"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                      type="number"
                      name="max"
                      max="100"
                      value={
                        formData.preferrenceAgeRange.max
                      }
                      onChange={handleAgeChange}
                      placeholder="Maximum age"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>
                </div>

                {/* ======================================
                    LOCATION
                ====================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Location
                  </label>

                  <input
                    type="text"
                    name="preferredLocation"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    placeholder="e.g. Accra, East Legon"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* ======================================
                    BUDGET
                ====================================== */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget Range (GHS)
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      type="number"
                      name="min"
                      min="0"
                      value={formData.budget.min}
                      onChange={handleBudgetChange}
                      placeholder="Minimum budget"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                      type="number"
                      name="max"
                      min="0"
                      value={formData.budget.max}
                      onChange={handleBudgetChange}
                      placeholder="Maximum budget"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>
                </div>

                {/* ======================================
                    LIFESTYLE PREFERENCES
                ====================================== */}
                <div>

                  <h3 className="text-base font-semibold text-slate-900 mb-4">
                    Lifestyle Preferences
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* SMOKING */}
                    <PreferenceSelect
                      label="Smoking"
                      name="smoking"
                      value={formData.smoking}
                      onChange={handleChange}
                    />

                    {/* DRINKING */}
                    <PreferenceSelect
                      label="Drinking"
                      name="drinking"
                      value={formData.drinking}
                      onChange={handleChange}
                    />

                    {/* PETS */}
                    <PreferenceSelect
                      label="Pets"
                      name="pets"
                      value={formData.pets}
                      onChange={handleChange}
                    />

                    {/* CLEANLINESS */}
                    <PreferenceSelect
                      label="Cleanliness"
                      name="cleanliness"
                      value={formData.cleanliness}
                      onChange={handleChange}
                    />

                    {/* SLEEP */}
                    <PreferenceSelect
                      label="Sleep Schedule"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      sleep
                    />

                  </div>

                </div>

                {/* ======================================
                    BUTTONS
                ====================================== */}
                <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">

                  {isEditting && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditting(false);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >

                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}

                    {isEditting
                      ? "Update Preferences"
                      : "Save Preferences"}

                  </button>

                </div>

              </form>
            </div>
          </section>
        )}

        {/* ==========================================
            DISPLAY EXISTING PREFERENCE
        ========================================== */}
        {!showForm && preference && (
          <section className="mt-8 px-2 md:px-6">

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              <div className="p-6 border-b border-slate-100">

                <h2 className="text-lg font-semibold text-slate-900">
                  Your Preferences
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your current roommate preferences.
                </p>

              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                <PreferenceItem
                  label="Preferred Gender"
                  value={
                    preference.preferrenceGender
                  }
                />

                <PreferenceItem
                  label="Age Range"
                  value={
                    preference.preferrenceAgeRange?.min &&
                    preference.preferrenceAgeRange?.max
                      ? `${preference.preferrenceAgeRange.min} - ${preference.preferrenceAgeRange.max}`
                      : "Not specified"
                  }
                />

                <PreferenceItem
                  label="Location"
                  value={
                    preference.preferredLocation ||
                    "Not specified"
                  }
                />

                <PreferenceItem
                  label="Budget"
                  value={
                    preference.budget?.min !== undefined &&
                    preference.budget?.max !== undefined
                      ? `GHS ${preference.budget.min} - GHS ${preference.budget.max}`
                      : "Not specified"
                  }
                />

                <PreferenceItem
                  label="Smoking"
                  value={preference.smoking}
                />

                <PreferenceItem
                  label="Drinking"
                  value={preference.drinking}
                />

                <PreferenceItem
                  label="Pets"
                  value={preference.pets}
                />

                <PreferenceItem
                  label="Cleanliness"
                  value={preference.cleanliness}
                />

                <PreferenceItem
                  label="Sleep Schedule"
                  value={preference.sleepHours}
                />

              </div>

            </div>

          </section>
        )}

      </div>
    </AppLayout>
  );
};


// =====================================================
// PREFERENCE SELECT
// =====================================================
const PreferenceSelect = ({
  label,
  name,
  value,
  onChange,
  sleep = false,
}) => {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
      >

        {!sleep ? (
          <>
            <option value="indifferent">
              Indifferent
            </option>

            <option value="yes">
              Yes
            </option>

            <option value="no">
              No
            </option>
          </>
        ) : (
          <>
            <option value="flexible">
              Flexible
            </option>

            <option value="early">
              Early
            </option>

            <option value="late">
              Late
            </option>
          </>
        )}

      </select>

    </div>
  );
};


// =====================================================
// DISPLAY ITEM
// =====================================================
const PreferenceItem = ({ label, value }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">

      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">
        {value || "Not specified"}
      </p>

    </div>
  );
};

export default Preferrences;
