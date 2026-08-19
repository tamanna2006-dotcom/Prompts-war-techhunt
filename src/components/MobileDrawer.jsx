import { useState } from 'react';
import { X, Menu } from 'lucide-react';

export default function MobileDrawer({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden p-2 text-slate-300"
        aria-label="Open navigation drawer"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-white text-lg font-bold">Menu</h2>
          <button onClick={() => setOpen(false)} className="text-slate-300" aria-label="Close drawer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">{children}</nav>
      </aside>
    </>
  );
}
