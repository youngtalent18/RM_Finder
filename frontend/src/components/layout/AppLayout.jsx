import { Children, cloneElement, isValidElement, useState } from "react";
import { X } from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const content = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === TopBar) {
      return cloneElement(child, { onMenuClick: () => setSidebarOpen(true) });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50">
        <Sidebar />
      </aside>


      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          bottom-0
          w-72
          bg-white
          z-[60]
          shadow-2xl
          lg:hidden
          transform
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <Sidebar
          onNavigate={() => setSidebarOpen(false)}
        />

      </aside>


      {/* Main */}
      <div className="lg:ml-64 min-h-screen">

        {/* ONLY ONE TOPBAR */}
        

        <main>
          {content}
        </main>

      </div>

    </div>
  );
};

export default AppLayout;
