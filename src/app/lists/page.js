"use client";
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, ArrowRight, Download, FileJson } from "lucide-react";
import Link from 'next/link';

export default function ListsPage() {
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem('vc_list') || '[]');
    setSavedCompanies(saved);
  }, []);

  const removeItem = (id) => {
    const updated = savedCompanies.filter(c => c.id !== id);
    localStorage.setItem('vc_list', JSON.stringify(updated));
    setSavedCompanies(updated);
  };

  // CSV Export Functionality (Requirement: Export list)
  const exportToCSV = () => {
    if (savedCompanies.length === 0) return;
    
    // 1. Define all headers you want in the file
    const headers = ["Name", "Sector", "Stage", "Website", "Description"];
    
    // 2. Map the data rows
    const rows = savedCompanies.map(c => [
      c.name,
      c.sector,
      c.stage,
      c.website,
      c.description || "" // Added description here
    ]);

    // 3. Convert to CSV string (handling commas in text via double quotes)
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
      
    // 4. Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vc_sourcing_list_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export Functionality
  const exportToJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedCompanies, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vc_sourcing_list.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Prevent "Hydration" errors by not rendering until client-side is ready
  if (!mounted) return null;

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* Header with Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Sourcing List</h1>
          <p className="text-slate-500 mt-2">High-signal companies moved to your internal triage queue.</p>
        </div>
        
        {savedCompanies.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToJSON} className="gap-2">
              <FileJson size={16} /> JSON
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
              <Download size={16} /> Export CSV
            </Button>
          </div>
        )}
      </div>

      {savedCompanies.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-white shadow-sm">
          <div className="max-w-sm mx-auto">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 mb-6 text-lg">Your sourcing list is empty. Start discovering companies to fill your pipeline.</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                Go to Discovery <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-md">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold">Company</TableHead>
                <TableHead className="font-bold">Sector</TableHead>
                <TableHead className="font-bold">Stage</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedCompanies.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell>
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors">{c.website}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[10px]">
                        {c.sector}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{c.stage}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/companies/${c.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <ExternalLink size={16} className="mr-2" /> View Profile
                        </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(c.id)}
                        className="text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="p-4 bg-slate-50/50 border-t flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              Total: {savedCompanies.length} {savedCompanies.length === 1 ? 'Company' : 'Companies'}
            </span>
            <span className="text-[10px] text-slate-400 italic">
              Data persisted in your local browser storage.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}