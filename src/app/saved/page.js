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

  // Prevent hydration flicker
  if (!mounted) return null;

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <History size={32} className="text-blue-600" /> Saved Searches
        </h1>
        <p className="text-slate-500 mt-2">Your library of custom sourcing queries and thesis filters.</p>
      </div>

      <div className="grid gap-4">
        {searches.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-white shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={32} />
            </div>
            <p className="text-slate-400 mb-6 text-lg">You haven't saved any search queries yet.</p>
            <Link href="/">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Go to Discovery <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          searches.map((s, idx) => (
            <Card key={idx} className="hover:border-blue-300 transition-all shadow-sm group">
              <CardContent className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Q
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 text-lg italic">"{s}"</span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Custom Query</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/?q=${encodeURIComponent(s)}`}>
                    <Button variant="secondary" size="sm" className="gap-2 bg-slate-100 hover:bg-blue-600 hover:text-white transition-all">
                      <Play size={14} /> Run Search
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteSearch(idx)}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {searches.length > 0 && (
        <p className="mt-8 text-center text-xs text-slate-400 italic">
          Tip: Saving a search allows you to quickly re-run complex filters on your sourcing feed.
        </p>
      )}
    </div>
  );
}