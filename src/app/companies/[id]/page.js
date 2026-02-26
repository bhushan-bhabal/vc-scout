"use client";
import React, { useState, useEffect } from 'react';
import { mockCompanies } from "@/lib/mockData";
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

export default function CompanyProfile({ params }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const company = mockCompanies.find(c => c.id === id);

  // States
  const [enrichment, setEnrichment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notes, setNotes] = useState("");

  // 1. Load Persistence (Saved status and Notes)
  useEffect(() => {
    if (!id) return;
    
    // Check if saved to list
    const saved = JSON.parse(localStorage.getItem('vc_list') || '[]');
    setIsSaved(saved.some(c => c.id === id));

    // Load notes
    const savedNotes = localStorage.getItem(`notes_${id}`);
    if (savedNotes) setNotes(savedNotes);
  }, [id]);

  // 2. Actions
  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('vc_list') || '[]');
    if (isSaved) {
      const filtered = saved.filter(c => c.id !== id);
      localStorage.setItem('vc_list', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      saved.push(company);
      localStorage.setItem('vc_list', JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  const saveNote = (val) => {
    setNotes(val);
    localStorage.setItem(`notes_${id}`, val);
  };

  const handleEnrich = async () => {
    setLoading(true);
    const currentThesis = localStorage.getItem('vc_thesis') || "High-efficiency SaaS and AI tools";
    
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: company.website, thesis: currentThesis }),
      });
      const data = await response.json();
      setEnrichment(data);
    } catch (err) {
      console.error("Enrichment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!company) return <div className="p-10 text-center text-slate-400">Company not found.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Top Navigation Row */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Back to Discovery
        </Link>
        <Button 
          variant={isSaved ? "secondary" : "outline"} 
          onClick={handleSave}
          className="gap-2"
        >
          {isSaved ? <Check size={16} className="text-green-600" /> : <BookmarkPlus size={16} />}
          {isSaved ? "Saved to List" : "Save to List"}
        </Button>
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">{company.name}</h1>
            <Badge variant="outline" className="mt-1">{company.stage}</Badge>
          </div>
          <a href={company.website} target="_blank" className="text-blue-600 flex items-center gap-1 hover:underline text-lg">
            <Globe size={16} /> {company.website.replace('https://', '')}
          </a>
        </div>

        <Button 
          size="lg" 
          onClick={handleEnrich} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {loading ? "Analyzing..." : "Enrich with AI Scout"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Overview & Notes */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Info size={14} /> Basic Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-xs text-slate-400 uppercase tracking-wider">Sector</p><p className="font-medium">{company.sector}</p></div>
              <div><p className="text-xs text-slate-400 uppercase tracking-wider">Description</p><p className="text-sm text-slate-600">{company.description}</p></div>
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
                className="w-full h-40 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50"
                placeholder="Why does this company fit your thesis? Add internal context here..."
                value={notes}
                onChange={(e) => saveNote(e.target.value)}
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">Notes are saved automatically to local storage.</p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: AI Analysis Result (The SPEC code) */}
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          ) : enrichment ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Summary Section */}
              <Card className="border-blue-200 bg-blue-50/30 overflow-hidden">
                <div className="bg-blue-600 h-1 w-full" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Sparkles size={16} /> AI Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-slate-800 leading-relaxed">
                    {enrichment.summary}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* What They Do (Bullets) */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase">What they do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {enrichment.whatTheyDo?.map((item, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2">
                          <span className="text-blue-500">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Derived Signals */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase">Derived Signals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {enrichment.derivedSignals?.map((signal, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                          {signal}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Keywords Tags */}
              <div className="flex flex-wrap gap-2">
                {enrichment.keywords?.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white border-slate-200 text-slate-600 px-3 py-1">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Sources (Requirement: Exact URL + Timestamp) */}
              <div className="pt-6 border-t">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Data Attribution</h4>
                <div className="bg-slate-50 border rounded-lg p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Globe size={12} />
                    <span className="font-mono truncate max-w-[250px] md:max-w-none">{enrichment.scrapedUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock size={12} />
                    Scraped on: {enrichment.timestamp}
                  </div>
                </div>
              </div>

              {/* Activity Timeline (Keep for workflow) */}
              <Card>
                <CardHeader className="pb-2 text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                  <Clock size={14} /> Activity Timeline
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex gap-4 border-l-2 border-blue-100 pl-6 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7.5px] ring-4 ring-white"></div>
                    <div>
                      <p className="text-sm font-bold">Company Discovery</p>
                      <p className="text-xs text-slate-400">Feb 20, 2026 • 10:45 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-4 border-l-2 border-slate-100 pl-6 relative">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7.5px] ring-4 ring-white"></div>
                    <div>
                      <p className="text-sm font-bold">Site Scrape & AI Analysis</p>
                      <p className="text-xs text-slate-400">{enrichment.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          ) : (
            <div className="border-2 border-dashed rounded-2xl p-20 text-center bg-white shadow-sm">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Run Live Enrichment</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">
                Click the button above to fetch the latest summary, signals, and keyword tags from the web.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}