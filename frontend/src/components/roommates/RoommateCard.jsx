import { Calendar, GraduationCap, MapPin, UserRound, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const formatLocation = (location) => [location?.city, location?.region, location?.country].filter(Boolean).join(", ") || "Location not provided";
const formatBudget = (budget) => {
  if (budget?.min == null && budget?.max == null) return "Budget not provided";
  const currency = budget?.currency || "GHS";
  return `${currency} ${budget?.min?.toLocaleString?.() ?? "—"} – ${budget?.max?.toLocaleString?.() ?? "—"}`;
};
const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "Flexible";

const RoommateCard = ({ roommate, onConnect, connecting = false }) => {
  const name = `${roommate.user?.firstName || "Student"} ${roommate.user?.lastName || ""}`.trim();
  const initials = `${roommate.user?.firstName?.[0] || "S"}${roommate.user?.lastName?.[0] || ""}`;

  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm task-card-hover flex flex-col">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-indigo-50 flex items-center justify-center shrink-0">
          {roommate.profileImage ? <img src={roommate.profileImage} alt={`${name}'s profile`} className="w-full h-full object-cover" /> : <span className="font-semibold text-indigo-600">{initials}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-slate-800 truncate">{name}</h2>
            {roommate.compatibility != null && <span className="shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">{roommate.compatibility}% match</span>}
          </div>
          <p className="text-sm text-slate-500 truncate">{roommate.school || "School not provided"}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2.5 mt-5 text-sm text-slate-600">
        <p className="flex items-center gap-2"><GraduationCap size={16} className="text-indigo-500 shrink-0" />{[roommate.course, roommate.level].filter(Boolean).join(" · ") || "Academic details not provided"}</p>
        <p className="flex items-center gap-2"><MapPin size={16} className="text-rose-500 shrink-0" />{formatLocation(roommate.location)}</p>
        <p className="flex items-center gap-2"><Wallet size={16} className="text-amber-500 shrink-0" />{formatBudget(roommate.budget)}</p>
        <p className="flex items-center gap-2"><Calendar size={16} className="text-sky-500 shrink-0" />Move in: {formatDate(roommate.moveInDate)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100">
        <Link to={`/roommates/${roommate.user?._id || roommate.user}`} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"><UserRound size={16} />View Profile</Link>
        <button type="button" onClick={() => onConnect(roommate)} disabled={connecting} className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white disabled:opacity-60">{connecting ? "Sending..." : "Connect"}</button>
      </div>
    </article>
  );
};

export { formatBudget, formatLocation };
export default RoommateCard;
