"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Save, Sparkles } from "lucide-react";

export default function ThesisPage() {
  const [thesis, setThesis] = useState("We invest in early-stage B2B SaaS and AI-driven automation tools with high capital efficiency.");
  const [mounted, setMounted] = useState(false);

  // Load the thesis from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('vc_thesis');
    if (saved) setThesis(saved);
  }, []);

  const saveThesis = () => {
    localStorage.setItem('vc_thesis', thesis);
    alert("Thesis updated! Your AI Scout will now use this strategy to score companies.");
  };

  if (!mounted) return null;

  return (
    <div className="p-10 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <LayoutDashboard size={32} className="text-blue-600" /> Fund Thesis
        </h1>
        <p className="text-slate-500 mt-2">Define your investment strategy to power the AI scoring engine.</p>
      </div>

      <Card className="border-blue-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-blue-50/50 border-b border-blue-100">
          <CardTitle className="text-sm font-bold text-blue-800 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={16} /> Strategy Definition
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-sm text-slate-500 italic">
            Describe your ideal founder, market, and product stage. The more specific you are, the better the AI can triage your sourcing feed.
          </p>
          
          <textarea 
            value={thesis} 
            onChange={(e) => setThesis(e.target.value)}
            className="w-full h-64 p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50/30 text-slate-700 leading-relaxed font-serif"
            placeholder="Enter your fund's unique thesis..."
          />
          
          <Button onClick={saveThesis} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg">
            <Save size={18} /> Update Investment Strategy
          </Button>
        </CardContent>
      </Card>
      
      <div className="mt-8 bg-slate-100 p-4 rounded-lg flex gap-3 items-start">
        <div className="bg-white p-1 rounded border border-slate-200">💡</div>
        <p className="text-xs text-slate-600 leading-normal">
          <strong>Pro-Tip:</strong> Mention specific sectors (e.g. Fintech), stages (e.g. Seed), or business models (e.g. Marketplace) to see the "Thesis Match" score on company profiles adjust automatically.
        </p>
      </div>
    </div>
  );
}