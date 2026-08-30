import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Calendar, GraduationCap, Loader2, MapPin, UserRound, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import { formatBudget, formatLocation } from "../../components/roommates/RoommateCard";
import profileStore from "../../store/profile";
import roommateStore from "../../store/roommate";

const Detail = ({ icon: Icon, label, children }) => <div className="flex gap-3"><div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0"><Icon size={17} className="text-indigo-600" /></div><div><p className="text-xs text-slate-400">{label}</p><p className="text-sm font-medium text-slate-700">{children}</p></div></div>;

const RoommateProfile = () => {
  const { id } = useParams();
  const { getUserProfileById } = profileStore();
  const { sendRequest, loading: requestLoading } = roommateStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
     getUserProfileById(id).then(setProfile).catch((err) => setError(err.response?.data?.message || "Unable to load this profile.")).finally(() => setLoading(false)); 
    }, [getUserProfileById, id]);
  if (loading) return 
    <AppLayout>
      <TopBar />
        <div className="min-h-72 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    </AppLayout>;

  if (error || !profile) return 
  <AppLayout>
    <TopBar />
    <div className="p-6 max-w-5xl mx-auto">
      <Link to="/roommates" className="text-sm text-indigo-600 inline-flex gap-2 items-center"><ArrowLeft size={16} />Back to roommates</Link>
      <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-6 text-red-700">{error || "Profile not found."}</div>
    </div>
  </AppLayout>;
  const name = `${profile.user?.firstName || "Student"} ${profile.user?.lastName || ""}`.trim();
  const initials = `${profile.user?.firstName?.[0] || "S"}${profile.user?.lastName?.[0] || ""}`;
  const handleConnect = async () => {
    try {
      await sendRequest(profile.user?._id || profile.user);
    } catch {
      // The roommate store reports failures through toast notifications.
    }
  };
  return <AppLayout>
            <TopBar />
            <div className="p-4 md:p-6 max-w-5xl mx-auto">
              <Link to="/roommates" className="text-sm font-medium text-indigo-600 inline-flex gap-2 items-center hover:text-indigo-700"><ArrowLeft size={16} />Back to roommates</Link>
              <section className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-28 bg-linear-to-r from-indigo-600 to-violet-500" />
                  <div className="px-5 md:px-7 pb-7">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-11">
                      <div className="w-24 h-24 rounded-2xl p-1 bg-white shadow-md">
                        <div className="w-full h-full rounded-xl bg-indigo-50 overflow-hidden flex items-center justify-center">{profile.profileImage ? <img src={profile.profileImage} alt={name} className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-indigo-600">{initials}</span>}
                        </div>
                      </div>
                        <div className="flex-1 sm:mb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                            {profile.compatibility != null && <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">{profile.compatibility}% compatible</span>}
                    </div>
                      <p className="text-sm text-slate-500 mt-1">{profile.course || "Student"}{profile.school ? ` · ${profile.school}` : ""}</p>
                    </div><button onClick={handleConnect} disabled={requestLoading} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60">{requestLoading ? "Sending..." : "Connect"}</button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"><div className="lg:col-span-2"><h2 className="font-semibold text-slate-800">About {profile.user?.firstName || "this student"}</h2><p className="text-sm leading-7 text-slate-600 mt-3">{profile.bio || "This student has not added a bio yet."}</p></div><div className="rounded-xl bg-indigo-50 p-4"><p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Match insight</p><p className="text-sm text-indigo-900 mt-1">{profile.compatibility != null ? `${profile.compatibility}% based on available profile details.` : "Complete your profile to see a compatibility score."}</p>
                  </div>
                  </div>
                  </div>
              </section>
              <section className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
                  <h2 className="font-semibold text-slate-800 mb-5">Living details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Detail icon={GraduationCap} label="Education">{[profile.school, profile.course, profile.level].filter(Boolean).join(" · ") || "Not provided"}</Detail>
                    <Detail icon={MapPin} label="Location">{formatLocation(profile.location)}</Detail>
                    <Detail icon={Wallet} label="Budget">{formatBudget(profile.budget)}</Detail>
                    <Detail icon={Calendar} label="Move-in date">{profile.moveInDate ? new Date(profile.moveInDate).toLocaleDateString() : "Flexible"}</Detail>
                    <Detail icon={BriefcaseBusiness} label="Occupation">{profile.occupation || "Student"}</Detail>
                    <Detail icon={UserRound} label="Gender">{profile.gender ? profile.gender.replaceAll("-", " ") : "Not specified"}</Detail>
                </div>
              </section>
            </div>
          </AppLayout>;
};

export default RoommateProfile;
