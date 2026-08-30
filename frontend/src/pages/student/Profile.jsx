import { useEffect, useMemo, useState } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Wallet,
  Pencil,
  Plus,
  Loader2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import profileStore from "../../store/profile";

const EMPTY_FORM = {
  bio: "",
  profileImage: "",
  gender: "",
  dateOfBirth: "",
  school: "",
  course: "",
  level: "",
  occupation: "",

  location: {
    city: "",
    region: "",
    country: "Ghana",
  },

  budget: {
    min: "",
    max: "",
    currency: "GHS",
  },

  moveInDate: "",
};

const getNestedValue = (value) => Array.isArray(value) ? value[0] || {} : value || {};

const profileToFormData = (profile) => {
  const location = getNestedValue(profile?.location);
  const budget = getNestedValue(profile?.budget);
  return {
    ...EMPTY_FORM,
    bio: profile?.bio || "",
    profileImage: profile?.profileImage || "",
    gender: profile?.gender || "",
    dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split("T")[0] : "",
    school: profile?.school || "",
    course: profile?.course || "",
    level: profile?.level || "",
    occupation: profile?.occupation || "",
    location: { city: location.city || "", region: location.region || "", country: location.country || "Ghana" },
    budget: { min: budget.min ?? "", max: budget.max ?? "", currency: budget.currency || "GHS" },
    moveInDate: profile?.moveInDate ? new Date(profile.moveInDate).toISOString().split("T")[0] : "",
  };
};

const Profile = () => {
  const { profile, loading, error, getMyProfile, createProfile, updateProfile } = profileStore();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const location = getNestedValue(profile.location);
    const budget = getNestedValue(profile.budget);
    const fields = [profile.profileImage, profile.bio, profile.gender, profile.school, profile.course, profile.level, profile.occupation, location.city, location.region, budget.min, budget.max, profile.moveInDate];
    return Math.round((fields.filter((field) => field !== undefined && field !== null && field !== "").length / fields.length) * 100);
  }, [profile]);

  // FETCH PROFILE

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await getMyProfile();
      } catch {
        // The render branch below presents the creation form for that case.
      }
    };

    loadProfile();
  }, [getMyProfile]);

  // HANDLE INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    // -----------------------------
    // LOCATION
    // -----------------------------

    if (
      name === "city" ||
      name === "region" ||
      name === "country"
    ) {
      setFormData((prev) => ({
        ...prev,

        location: {
          ...prev.location,
          [name]: value,
        },
      }));

      return;
    }

    // BUDGET

    if (
      name === "min" ||
      name === "max" ||
      name === "currency"
    ) {
      setFormData((prev) => ({
        ...prev,

        budget: {
          ...prev.budget,

          [name]:
            name === "currency"
              ? value
              : value === ""
              ? ""
              : Number(value),
        },
      }));

      return;
    }

    // NORMAL INPUT

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // IMAGE

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    // Check image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // CREATE / UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.budget.min !== "" && formData.budget.max !== "" && Number(formData.budget.min) > Number(formData.budget.max)) {
      toast.error("Your minimum budget cannot be higher than your maximum budget");
      return;
    }

    try {
      if (isEditing) {
        await updateProfile(formData);

        toast.success("Profile updated successfully");

        setIsEditing(false);
        setShowForm(false);

        await getMyProfile();
      } else {
        await createProfile(formData);

        toast.success("Profile created successfully");

        setShowForm(false);

        await getMyProfile();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // OPEN EDIT FORM
  const handleEdit = () => {
    setFormData(profileToFormData(profile));
    setIsEditing(true);
    setShowForm(true);
  };

  // CANCEL FORM
  const handleCancel = () => {
    setIsEditing(false);
    setShowForm(false);

    setFormData(profile ? profileToFormData(profile) : EMPTY_FORM);
  };

  // LOADING SCREEN
  if (loading && !profile && !showForm) {
    return (
      <AppLayout>
        <TopBar title="Profile" />

        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">

            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading profile...
            </p>

          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profile && error && !showForm && error !== "Profile not found") {
    return (
      <AppLayout>
        <TopBar title="Profile" />
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="max-w-md text-center bg-white border border-red-200 rounded-2xl p-7 shadow-sm">
            <AlertCircle className="w-9 h-9 text-red-500 mx-auto" />
            <h1 className="font-semibold text-slate-800 mt-3">Unable to load your profile</h1>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
            <button onClick={() => getMyProfile()} className="mt-5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Try again</button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // CREATE / EDIT FORM

  if (!profile || showForm) {
    return (
      <AppLayout>
        <TopBar title="Profile" />

        <div className="p-6 max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              {isEditing
                ? "Edit your profile"
                : "Create your profile"}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Tell other students about yourself so you
              can find a suitable roommate.
            </p>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* PROFILE PHOTO */}
            <div className="p-6 border-b border-slate-200">

              <div className="flex items-center gap-4">

                <div className="relative">

                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">

                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}

                  </div>

                  <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition">

                    <Plus size={14} />

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                </div>

                <div>
                  <h2 className="font-semibold text-slate-800">
                    Profile photo
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    JPG, PNG or WEBP. Maximum 2MB.
                  </p>
                </div>

              </div>

            </div>

            {/* FORM CONTENT */}

            <div className="p-6 space-y-8">

              {/* ABOUT */}

              <section>

                <h3 className="font-semibold text-slate-800 mb-4">
                  About You
                </h3>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Tell potential roommates a little about yourself..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <p className="text-right text-xs text-slate-400 mt-1">{formData.bio.length}/500</p>

              </section>

              {/* BASIC INFORMATION */}

              <section>

                <h3 className="font-semibold text-slate-800 mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* GENDER */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender
                    </label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">
                        Select gender
                      </option>
                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                      <option value="other">
                        Other
                      </option>

                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>

                    </select>
                  </div>

                  {/* DOB */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                </div>

              </section>

              {/* EDUCATION */}

              <section>

                <h3 className="font-semibold text-slate-800 mb-4">
                  Education
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* SCHOOL */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      School
                    </label>

                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="University / School"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                  {/* COURSE */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Course
                    </label>

                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                  {/* LEVEL */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Level
                    </label>

                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      placeholder="e.g. Level 300"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                  {/* OCCUPATION */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Occupation
                    </label>

                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="e.g. Student"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                </div>

              </section>

              {/* LOCATION */}

              <section>

                <h3 className="font-semibold text-slate-800 mb-4">
                  Location
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                  {/* CITY */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.location.city}
                      onChange={handleChange}
                      placeholder="e.g. Accra"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                  {/* REGION */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Region
                    </label>

                    <input
                      type="text"
                      name="region"
                      value={formData.location.region}
                      onChange={handleChange}
                      placeholder="e.g. Greater Accra"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                  {/* COUNTRY */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={formData.location.country}
                      onChange={handleChange}
                      placeholder="e.g. Ghana"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                </div>

              </section>

              {/* BUDGET */}

              <section>

                <h3 className="font-semibold text-slate-800 mb-4">
                  Roommate Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* BUDGET */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Budget
                    </label>

                    <div className="grid grid-cols-3 gap-2">

                      <input
                        type="number"
                        min="0"
                        name="min"
                        value={formData.budget.min}
                        onChange={handleChange}
                        placeholder="Min"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <input
                        type="number"
                        min="0"
                        name="max"
                        value={formData.budget.max}
                        onChange={handleChange}
                        placeholder="Max"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <input
                        type="text"
                        name="currency"
                        value={formData.budget.currency}
                        onChange={handleChange}
                        placeholder="GHS"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                    </div>

                  </div>

                  {/* MOVE IN */}

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Move-in Date
                    </label>

                    <input
                      type="date"
                      name="moveInDate"
                      value={formData.moveInDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                  </div>

                </div>

              </section>

            </div>

            {/* FORM FOOTER */}

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium disabled:opacity-50"
              >

                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEditing ? (
                  <Save size={16} />
                ) : (
                  <Plus size={16} />
                )}

                {isEditing
                  ? "Save Changes"
                  : "Create Profile"}

              </button>

            </div>

          </form>

        </div>
      </AppLayout>
    );
  }

  // SAFE PROFILE VALUES

  const location = getNestedValue(profile.location);

  const budget = getNestedValue(profile.budget);

  const locationText = [
    location.city,
    location.region,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");

  let budgetText = "Not provided";

  if (
    budget.min !== undefined &&
    budget.min !== "" &&
    budget.max !== undefined &&
    budget.max !== ""
  ) {
    budgetText = `${budget.currency || "GHS"} ${Number(
      budget.min
    ).toLocaleString()} - ${Number(
      budget.max
    ).toLocaleString()}`;
  } else if (
    budget.min !== undefined &&
    budget.min !== ""
  ) {
    budgetText = `${budget.currency || "GHS"} ${Number(
      budget.min
    ).toLocaleString()}+`;
  } else if (
    budget.max !== undefined &&
    budget.max !== ""
  ) {
    budgetText = `Up to ${
      budget.currency || "GHS"
    } ${Number(budget.max).toLocaleString()}`;
  }

  // PROFILE DISPLAY

  return (
    <AppLayout>

      <TopBar title="Profile" />

      <div className="p-6 max-w-6xl mx-auto">
        {/* PROFILE HEADER */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="h-32 bg-linear-to-r from-indigo-600 to-blue-500" />

          <div className="px-6 pb-6">

            <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12">

              {/* IMAGE */}

              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">

                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">

                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}

                </div>

              </div>

              {/* NAME */}

              <div className="flex-1">

                <h1 className="text-2xl font-bold text-slate-800">

                  {profile.user?.firstName || "User"}{" "}

                  {profile.user?.lastName || ""}

                </h1>

                <p className="text-sm text-slate-500">
                  {profile.course || "Student"}
                </p>

                {locationText && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <MapPin size={13} />
                    {locationText}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 max-w-xs">
                  <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${profileCompletion}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{profileCompletion}% complete</span>
                </div>

              </div>

              {/* EDIT */}

              <button
                onClick={handleEdit}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >

                <Pencil size={16} />

                Edit Profile

              </button>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* PROFILE CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

          {/* ABOUT */}

          <ProfileCard
            icon={
            <User className="w-5 h-5 text-indigo-600" />

            }
            iconBg="bg-indigo-50"
            title="About"
            subtitle="Personal information"
          >

            <p className="text-sm text-slate-600 leading-6">
              {profile.bio || "No bio added yet."}
            </p>

          </ProfileCard>

          {/* LOCATION */}

          <ProfileCard
            icon={
              <MapPin className="w-5 h-5 text-emerald-600" />
            }
            iconBg="bg-emerald-50"
            title="Location"
            subtitle="Current location"
          >

            <p className="text-sm text-slate-600">
              {locationText || "Not provided"}
            </p>

          </ProfileCard>

          {/* EDUCATION */}

          <ProfileCard
            icon={
              <GraduationCap className="w-5 h-5 text-blue-600" />
            }
            iconBg="bg-blue-50"
            title="Education"
            subtitle="Academic information"
          >

            <div className="space-y-2">

              <p className="text-sm font-medium text-slate-700">
                {profile.school ||
                  "School not provided"}
              </p>

              <p className="text-sm text-slate-500">
                {profile.course ||
                  "Course not provided"}
              </p>

              <p className="text-sm text-slate-500">
                {profile.level ||
                  "Level not provided"}
              </p>

            </div>

          </ProfileCard>

          {/* OCCUPATION */}

          <ProfileCard
            icon={
              <Briefcase className="w-5 h-5 text-orange-600" />
            }
            iconBg="bg-orange-50"
            title="Occupation"
            subtitle="Work information"
          >

            <p className="text-sm text-slate-600">
              {profile.occupation ||
                "Not provided"}
            </p>

          </ProfileCard>

          {/* BUDGET */}

          <ProfileCard
            icon={
              <Wallet className="w-5 h-5 text-purple-600" />
            }
            iconBg="bg-purple-50"
            title="Budget"
            subtitle="Roommate budget"
          >

            <p className="text-sm font-medium text-slate-700">
              {budgetText}
            </p>

          </ProfileCard>

          {/* MOVE IN */}

          <ProfileCard
            icon={
              <Calendar className="w-5 h-5 text-pink-600" />
            }
            iconBg="bg-pink-50"
            title="Move-in Date"
            subtitle="Preferred move-in"
          >

            <p className="text-sm text-slate-600">

              {profile.moveInDate
                ? new Date(
                    profile.moveInDate
                  ).toLocaleDateString()
                : "Not provided"}

            </p>

          </ProfileCard>

          {/* GENDER */}

          <ProfileCard
            icon={
              <User className="w-5 h-5 text-cyan-600" />
            }
            iconBg="bg-cyan-50"
            title="Gender"
            subtitle="Personal information"
          >

            <p className="text-sm text-slate-600 capitalize">

              {profile.gender
                ? profile.gender.replaceAll("-", " ")
                : "Not provided"}

            </p>

          </ProfileCard>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Profile visibility</h3>
                <p className="text-xs text-emerald-700 mt-0.5">Your details help generate better roommate matches.</p>
              </div>
            </div>
            <button onClick={handleEdit} className="mt-4 text-sm font-semibold text-emerald-800 hover:text-emerald-950">Improve profile</button>
          </div>

        </div>

      </div>

    </AppLayout>
  );
};

// REUSABLE PROFILE CARD

const ProfileCard = ({
  icon,
  iconBg,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center gap-3 mb-4">

        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-slate-800">
            {title}
          </h3>

          <p className="text-xs text-slate-400">
            {subtitle}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
};

export default Profile;
