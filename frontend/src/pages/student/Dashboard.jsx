import { useEffect, useMemo } from "react";
import {
  Users,
  UserRound,
  Target,
  ArrowRight,
  MapPin,
  GraduationCap,
  Wallet,
  CheckCircle2,
  UserPlus,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import RoommateCard from "../../components/roommates/RoommateCard";
import userStore from "../../store/user";
import profileStore from "../../store/profile";


const Dashboard = () => {
  const user = userStore((state) => state.user);

  const profile = profileStore((state) => state.profile);
  const getMyProfile = profileStore((state) => state.getMyProfile);
  const roommates = profileStore((state) => state.roommates);

  useEffect(() => {
    if (!profile) {
      getMyProfile().catch(() => {
        // Profile may not exist yet.
        // The dashboard will show the profile completion card.
      });
    }
    const fetchRoommates = profileStore.getState().getRoommates;
    if (typeof fetchRoommates === "function") {
      fetchRoommates().catch(() => {});
    }
  }, [profile, getMyProfile]);


  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      profile.profileImage,
      profile.bio,
      profile.gender,
      profile.dateOfBirth,
      profile.school,
      profile.course,
      profile.level,
      profile.occupation,
      profile.moveInDate,
      profile.location?.city,
      profile.location?.region,
      profile.budget?.min,
      profile.budget?.max,
    ];

    const completed = fields.filter(
      (field) =>
        field !== undefined &&
        field !== null &&
        field !== ""
    ).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);


  const firstName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    "Student";


  return (
    <AppLayout>
      <TopBar title="Dashboard" />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6">

        <section className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-6 sm:p-8 text-white shadow-sm">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <p className="text-sm text-white/70 mb-2">
                Student Dashboard
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {firstName} 👋
              </h1>

              <p className="mt-2 text-sm sm:text-base text-white/80 max-w-xl">
                Find a roommate who matches your lifestyle,
                budget, location and preferences.
              </p>
            </div>


            <div className="flex flex-wrap gap-3">

              <Link
                to="/roommates"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-600 text-sm font-semibold hover:bg-white/90 transition"
              >
                <Search size={17} />
                Find Roommates
              </Link>

              <Link
                to="/preferences"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition"
              >
                <Target size={17} />
                Preferences
              </Link>

            </div>

          </div>

        </section>


        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <StatCard
            title="Profile Completion"
            value={`${profileCompletion}%`}
            description="Complete your profile"
            icon={UserRound}
            iconClass="bg-indigo-100 text-indigo-600"
            to="/profile"
          />

          <StatCard
            title="Potential Matches"
            value={roommates?.length || 0}
            description="Students available to explore"
            icon={Users}
            iconClass="bg-blue-100 text-blue-600"
            to="/roommates"
          />

          <StatCard
            title="Roommate Requests"
            value="—"
            description="No requests yet"
            icon={UserPlus}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          <StatCard
            title="Preferences"
            value={profile ? "Ready" : "Pending"}
            description={
              profile
                ? "Set your roommate preferences"
                : "Create your profile first"
            }
            icon={Target}
            iconClass="bg-orange-100 text-orange-600"
            to="/preferences"
          />

        </section>


        {/* ------------------------------------------------ */}
        {/* PROFILE COMPLETION */}
        {/* ------------------------------------------------ */}

        {!profile || profileCompletion < 100 ? (
          <ProfileCompletionCard
            profile={profile}
            completion={profileCompletion}
          />
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2
                size={21}
                className="text-emerald-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-emerald-800">
                Your profile is complete
              </h3>

              <p className="text-sm text-emerald-700">
                You're ready to discover compatible roommates.
              </p>
            </div>
          </div>
        )}


        {/* ------------------------------------------------ */}
        {/* PROFILE SNAPSHOT */}
        {/* ------------------------------------------------ */}

        {profile && (
          <section>

            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Your Roommate Profile
                </h2>

                <p className="text-sm text-slate-500">
                  A quick look at the information you're sharing.
                </p>
              </div>

              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Edit profile
                <ArrowRight size={15} />
              </Link>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <InfoCard
                icon={GraduationCap}
                label="School"
                value={profile.school}
              />

              <InfoCard
                icon={GraduationCap}
                label="Course"
                value={profile.course}
              />

              <InfoCard
                icon={MapPin}
                label="Location"
                value={[
                  profile.location?.city,
                  profile.location?.region,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />

              <InfoCard
                icon={Wallet}
                label="Budget"
                value={
                  profile.budget?.min != null &&
                  profile.budget?.max != null
                    ? `${profile.budget?.currency || "GHS"} ${profile.budget.min} - ${profile.budget.max}`
                    : null
                }
              />

            </div>

          </section>
        )}


        {/* ------------------------------------------------ */}
        {/* RECOMMENDED ROOMMATES */}
        {/* ------------------------------------------------ */}

        <section>

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Recommended Roommates
              </h2>

              <p className="text-sm text-slate-500">
                Roommates that could be a good fit for you.
              </p>
            </div>

            <Link
              to="/roommates"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
              <ArrowRight size={15} />
            </Link>

          </div>


          {roommates?.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {roommates.slice(0, 4).map((roommate) => (
                <RoommateCard key={roommate._id} roommate={roommate} onConnect={() => {}} />
              ))}
            </div>
          ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-sm">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <Users
                size={26}
                className="text-indigo-600"
              />
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Your roommate recommendations are coming
            </h3>

            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              Complete your profile and preferences so we
              can find students who match your needs.
            </p>

            <div className="mt-5">

              <Link
                to="/preferences"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                <Target size={16} />
                Set Preferences
              </Link>

            </div>

          </div>
          )}

        </section>


        {/* ------------------------------------------------ */}
        {/* QUICK ACTIONS */}
        {/* ------------------------------------------------ */}

        <section>

          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <ActionCard
              to="/roommates"
              icon={Users}
              title="Find Roommates"
              description="Browse students looking for roommates."
            />

            <ActionCard
              to="/preferences"
              icon={Target}
              title="Set Preferences"
              description="Tell us what you're looking for in a roommate."
            />

            <ActionCard
              to="/profile"
              icon={UserRound}
              title="Update Profile"
              description="Keep your information accurate and up to date."
            />

          </div>

        </section>

      </main>
    </AppLayout>
  );
};


/* ========================================================
   STAT CARD
======================================================== */

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  to,
}) => {

  const content = (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {value}
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {description}
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          <Icon size={19} />
        </div>

      </div>

    </div>
  );


  if (to) {
    return (
      <Link to={to}>
        {content}
      </Link>
    );
  }

  return content;
};


/* ========================================================
   PROFILE COMPLETION
======================================================== */

const ProfileCompletionCard = ({
  profile,
  completion,
}) => {

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">

            <UserRound
              size={21}
              className="text-indigo-600"
            />

          </div>

          <div>

            <h2 className="font-semibold text-slate-800">
              {profile
                ? "Complete your profile"
                : "Create your roommate profile"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add more information to improve your roommate matches.
            </p>

          </div>

        </div>


        <Link
          to="/profile"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          {profile ? "Complete Profile" : "Create Profile"}
          <ArrowRight size={16} />
        </Link>

      </div>


      {/* Progress */}

      <div className="mt-6">

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs font-medium text-slate-500">
            Profile completion
          </span>

          <span className="text-xs font-bold text-indigo-600">
            {completion}%
          </span>

        </div>


        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{
              width: `${completion}%`,
            }}
          />

        </div>

      </div>

    </section>
  );
};


/* ========================================================
   INFO CARD
======================================================== */

const InfoCard = ({
  icon: Icon,
  label,
  value,
}) => {

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">

          <Icon
            size={17}
            className="text-slate-600"
          />

        </div>

        <div className="min-w-0">

          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="text-sm font-semibold text-slate-700 truncate">
            {value || "Not provided"}
          </p>

        </div>

      </div>

    </div>
  );
};


/* ========================================================
   ACTION CARD
======================================================== */

const ActionCard = ({
  to,
  icon: Icon,
  title,
  description,
}) => {

  return (
    <Link
      to={to}
      className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition"
    >

      <div className="flex items-start justify-between gap-4">

        <div>

          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">

            <Icon
              size={19}
              className="text-indigo-600"
            />

          </div>

          <h3 className="font-semibold text-slate-800">
            {title}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>

        </div>


        <ArrowRight
          size={18}
          className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition"
        />

      </div>

    </Link>
  );
};


export default Dashboard;
