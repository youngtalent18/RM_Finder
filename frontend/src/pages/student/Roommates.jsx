
import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, SlidersHorizontal, UsersRound } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import TopBar from "../../components/layout/TopBar";
import RoommateCard from "../../components/roommates/RoommateCard";
import profileStore from "../../store/profile";
import roommateStore from "../../store/roommate";

const Roommates = () => {
  const { roommates, loading, error, getRoommates } = profileStore();
  const { sendRequest, loading: requestLoading } = roommateStore();
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ school: "", course: "", level: "", city: "" });

  useEffect(() => { getRoommates().catch(() => {}); }, [getRoommates]);

  const filteredRoommates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return roommates;
    return roommates.filter((roommate) => [roommate.user?.firstName, roommate.user?.lastName, roommate.school, roommate.course, roommate.level, roommate.location?.city, roommate.location?.region, roommate.location?.country].filter(Boolean).join(" ").toLowerCase().includes(term));
  }, [roommates, search]);

  const applyFilters = async (event) => {
    event.preventDefault();
    try { await getRoommates(filters); } catch { /* Error state is displayed below. */ }
  };
  const handleConnect = async (roommate) => {
    try {
      await sendRequest(roommate.user?._id || roommate.user);
    } catch {
      // My Zustand store displays an actionable error toast.
    }
  };

  return <AppLayout>
    <TopBar />
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-indigo-600">DISCOVER</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Find your roommate</h1>
          <p className="text-sm text-slate-500 mt-1">Explore student profiles that fit your living plans.</p>
        </div>
        <p className="text-sm font-medium text-slate-500">{filteredRoommates.length} student{filteredRoommates.length === 1 ? "" : "s"} found</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3"><div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, school, course, or location" className="pl-10 py-2.5 text-sm" /></div><button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"><SlidersHorizontal size={17} />Filters</button></div>
        {filtersOpen && <form onSubmit={applyFilters} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 mt-4 border-t border-slate-100">{Object.entries({ school: "School", course: "Course", level: "Level", city: "City" }).map(([key, label]) => <input key={key} value={filters[key]} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })} placeholder={label} className="px-3 py-2 text-sm" />)}<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium">Apply filters</button></form>}
      </div>
      {loading ? <div className="min-h-72 flex flex-col items-center justify-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /><p className="text-sm text-slate-500">Finding students...</p></div> : error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"><p className="font-medium text-red-700">We couldn't load roommates.</p><button onClick={() => getRoommates()} className="mt-3 text-sm font-medium text-red-700 underline">Try again</button></div> : filteredRoommates.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{filteredRoommates.map((roommate) => <RoommateCard key={roommate._id} roommate={roommate} onConnect={handleConnect} connecting={requestLoading} />)}</div> : <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center"><UsersRound className="w-10 h-10 text-indigo-400 mx-auto" /><h2 className="font-semibold text-slate-800 mt-3">No roommates found</h2><p className="text-sm text-slate-500 mt-1">Try clearing a filter or check back as more students complete their profiles.</p></div>}
    </div>
  </AppLayout>;
};

export default Roommates;
