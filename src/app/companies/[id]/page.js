"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, Globe, ArrowLeft, Loader2, 
  BookmarkPlus, Check, CheckCircle2, 
  Clock, FileText, Info 
} from "lucide-react";
import Link from 'next/link';
import { mockCompanies } from '@/lib/mockData';

export default function CompanyProfile({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const company = mockCompanies.find(c => c.id === id);

  const [enrichment, setEnrichment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    const saved = JSON.parse(localStorage.getItem('vc_list') || '[]');
    setIsSaved(saved.some(c => c.id === id));
    setNotes(localStorage.getItem(`notes_${id}`) || "");
  }, [id]);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('vc_list') || '[]');
    const updated = isSaved ? saved.filter(c => c.id !== id) : [...saved, company];
    localStorage.setItem('vc_list', JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  const handleEnrich = async () => {
    setLoading(true);
    const thesis = localStorage.getItem('vc_thesis') || "Early stage AI";
    try {
      const res = await fetch('/api/enrich', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: company.website, thesis }) 
      });
      setEnrichment(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!company) return <div className="p-10 text-center">Company not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* Top Navigation Row - Wrap on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> <span className="text-sm font-medium">Back to Discovery</span>
        </Link>
        <Button 
          variant={isSaved ? "secondary" : "outline"} 
          onClick={handleSave}
          className="w-full sm:w-auto gap-2"
        >
          {isSaved ? <Check size={16} className="text-green-600" /> : <BookmarkPlus size={16} />}
          {isSaved ? "Saved to List" : "Save to List"}
        </Button>
      </div>

      {/* Header Info - Now using 'sm' to match the top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{company.name}</h1>
            <Badge variant="outline" className="mt-1">{company.stage}</Badge>
          </div>
          <a href={company.website} target="_blank" className="text-blue-600 flex items-center gap-1 hover:underline text-lg break-all">
            <Globe size={16} className="shrink-0" /> {company.website.replace('https://', '')}
          </a>
        </div>

        <Button 
          size="lg" 
          onClick={handleEnrich} 
          disabled={loading}
          /* Changed md:w-auto to sm:w-auto to match the Save button */
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg gap-2 shrink-0"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? "Analyzing..." : "Enrich with AI Scout"}
        </Button>
      </div>

      {/* Grid - 1 column on mobile, 3 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Basic Profile & Notes */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Info size={14} /> Basic Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Sector</p><p className="font-medium">{company.sector}</p></div>
              <div><p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Description</p><p className="text-slate-600 leading-relaxed">{company.description}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <FileText size={14} /> Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full h-32 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
                placeholder="Add context..."
                value={notes}
                onChange={(e) => {setNotes(e.target.value); localStorage.setItem(`notes_${id}`, e.target.value)}}
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : enrichment ? (
            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50/30 overflow-hidden">
                <div className="bg-blue-600 h-1 w-full" />
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><CheckCircle2 size={18} /> AI Intelligence</span>
                    <Badge className="bg-blue-600">{enrichment.matchScore}% Match</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-base md:text-lg font-medium text-slate-800 italic">"{enrichment.summary}"</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Capabilities</h4>
                      <ul className="text-sm space-y-2">
                        {enrichment.whatTheyDo?.map((item, i) => (
                          <li key={i} className="flex gap-2 text-slate-600">
                            <span className="text-blue-400 shrink-0">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Signals</h4>
                      <div className="flex flex-wrap gap-2">
                        {enrichment.derivedSignals?.map((s, i) => (
                          <Badge key={i} variant="secondary" className="bg-white border-blue-100 text-blue-700 text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Attribution Info - Fixed for mobile overflow */}
                  <div className="pt-4 border-t flex flex-col sm:flex-row justify-between gap-2 text-[10px] text-slate-400 uppercase tracking-tighter">
                    <span className="truncate max-w-full break-all">Source: {enrichment.scrapedUrl}</span>
                    <span className="shrink-0">Scraped: {enrichment.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-xl p-12 text-center bg-white text-slate-400">
              Click Enrich to fetch live signals.
            </div>
          )}
          
          {/* Timeline - Stacked */}
          <Card>
            <CardHeader className="pb-2 text-xs font-bold text-slate-400 uppercase"><div className="flex items-center gap-2"><Clock size={14} /> Activity Timeline</div></CardHeader>
            <CardContent className="space-y-6 pt-4 text-sm">
              <div className="flex gap-4 border-l-2 border-blue-100 pl-6 relative">
                <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[6px] ring-4 ring-white"></div>
                <div><p className="font-bold">Discovery</p><p className="text-xs text-slate-400">Feb 2026</p></div>
              </div>
              <div className="flex gap-4 border-l-2 border-slate-100 pl-6 relative">
                <div className={`absolute w-2.5 h-2.5 rounded-full -left-[6px] ring-4 ring-white ${enrichment ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                <div><p className="font-bold">AI Scrape</p><p className="text-xs text-slate-400">{enrichment ? enrichment.timestamp : 'Pending'}</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}