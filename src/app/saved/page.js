"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Play, Trash2, ArrowRight, Search } from "lucide-react";
import Link from 'next/link';

export default function SavedSearches() {
  const [searches, setSearches] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem('vc_saved_searches') || '[]');
    setSearches(saved);
  }, []);

  const deleteSearch = (idx) => {
    const updated = searches.filter((_, i) => i !== idx);
    localStorage.setItem('vc_saved_searches', JSON.stringify(updated));
    setSearches(updated);
  };

  if (!mounted) return null;

  return (
    // Changed p-10 to p-4 md:p-10 and added overflow-x-hidden
    <div className="p-4 md:p-10 max-w-4xl mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <History size={32} className="text-blue-600 shrink-0" /> Saved Searches
        </h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">Your library of custom sourcing queries.</p>
      </div>

      <div className="grid gap-4">
        {searches.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-white shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={32} />
            </div>
            <p className="text-slate-400 mb-6 px-4">You haven't saved any search queries yet.</p>
            <Link href="/">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Go to Discovery <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          searches.map((s, idx) => (
            <Card key={idx} className="hover:border-blue-300 transition-all shadow-sm group">
              {/* Changed flex-row to flex-col sm:flex-row to stack on mobile */}
              <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
                    Q
                  </div>
                  {/* Added break-words to ensure long queries don't push width */}
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-700 text-base md:text-lg italic block break-words leading-tight">
                      "{s}"
                    </span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Custom Query</p>
                  </div>
                </div>
                
                {/* Buttons stack or stay tight */}
                <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <Link href={`/?q=${encodeURIComponent(s)}`} className="flex-1 sm:flex-none">
                    <Button variant="secondary" size="sm" className="w-full gap-2 bg-slate-100 hover:bg-blue-600 hover:text-white transition-all text-xs h-9">
                      <Play size={14} /> Run Search
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteSearch(idx)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 h-9 w-9 p-0 shrink-0"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}