"use client";

import "./globals.css";
import {
  Search,
  List,
  Database,
  LayoutDashboard,
  History,
  Menu,
  X
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {

  const [open, setOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>

      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-900 overflow-x-hidden"
      >

        {/* HAMBURGER */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="
            fixed
            top-4
            left-4
            z-50
            bg-white
            p-2
            rounded-lg
            shadow
            "
          >
            <Menu size={20}/>
          </button>
        )}

        {/* OVERLAY */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 z-40"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
          fixed
          top-0
          left-0
          h-full
          w-64
          bg-white
          border-r
          flex flex-col
          z-50
          transform
          transition-transform
          duration-300
          ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          `}
        >

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4"
          >
            <X size={22}/>
          </button>


          {/* LOGO */}
          <div className="p-6 border-b flex gap-2 text-blue-600 font-bold text-lg">

            <Database size={24}/>

            <span className="text-slate-900">
              VibeScout
            </span>

          </div>


          {/* Global Search Box - Mobile Optimized */}
          <form 
            onSubmit={(e) => {
              e.preventDefault(); // Stop the page from refreshing
              const formData = new FormData(e.currentTarget);
              const query = formData.get("globalSearch");
              if (query) {
                window.location.href = `/?q=${encodeURIComponent(query)}`;
                setIsMobileMenuOpen(false); // Close sidebar on mobile after searching
              }
            }}
            className="px-4 mb-4 mt-4"
          >
            <div className="flex items-center bg-slate-100 rounded-md px-3 h-10 border border-transparent focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <Search size={16} className="text-slate-400 mr-2" />
              <input
                name="globalSearch" // Name attribute is needed for FormData
                type="search"       // "search" type is better for mobile keyboards
                suppressHydrationWarning
                placeholder="Global Search..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>
            {/* Hidden submit button to allow Enter key to work on all browsers */}
            <button type="submit" className="hidden" />
          </form>


          {/* NAVIGATION */}
          <nav className="flex-1 p-4 space-y-3">

            <Link
              href="/"
              onClick={()=>setOpen(false)}
              className="flex gap-3 p-2 hover:bg-blue-50 rounded-lg"
            >
              <Search size={18}/>
              Discovery
            </Link>

            <Link
              href="/saved"
              onClick={()=>setOpen(false)}
              className="flex gap-3 p-2 hover:bg-blue-50 rounded-lg"
            >
              <History size={18}/>
              Saved
            </Link>

            <Link
              href="/lists"
              onClick={()=>setOpen(false)}
              className="flex gap-3 p-2 hover:bg-blue-50 rounded-lg"
            >
              <List size={18}/>
              Lists
            </Link>

            <Link
              href="/thesis"
              onClick={()=>setOpen(false)}
              className="flex gap-3 p-2 hover:bg-blue-50 rounded-lg"
            >
              <LayoutDashboard size={18}/>
              Thesis
            </Link>

          </nav>


          {/* CREDITS */}
          <div className="p-4 border-t">

            <div className="bg-slate-100 p-3 rounded-lg">

              <p className="text-xs text-slate-500">
                Credits
              </p>

              <p>
                1,240 left
              </p>

            </div>

          </div>

        </aside>



        {/* MAIN CONTENT */}
        <main className="px-4 pt-14 pb-6">

          {children}

        </main>

        <Toaster position="top-right" richColors />
      </body>

    </html>
  );
}