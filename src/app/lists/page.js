"use client";
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, FileJson, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function ListsPage() {
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [mounted, setMounted] = useState(false);

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

  const exportToCSV = () => {
    if (savedCompanies.length === 0) return;
    const headers = ["Name", "Sector", "Stage", "Website", "Description"];
    const rows = savedCompanies.map(c => [
      c.name, c.sector, c.stage, c.website, c.description || ""
    ]);
    const csvContent = [
      headers.join(","), 
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.body.appendChild(document.createElement('a'));
    link.href = url;
    link.download = `vc_sourcing_list.csv`;
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div className="p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Sourcing List</h1>
          <p className="text-slate-500 text-lg">High-signal companies moved to your internal queue.</p>
        </div>
        
        {savedCompanies.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2 border-slate-200">
              <Download size={16} /> Export CSV
            </Button>
          </div>
        )}
      </div>

      {savedCompanies.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-white shadow-sm">
          <p className="text-slate-400 mb-4">Your sourcing list is empty.</p>
          <Link href="/"><Button className="bg-slate-900">Go Discovery</Button></Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                {/* Match Discovery Page Headers */}
                <TableHead className="font-bold text-slate-900 pl-6">Company</TableHead>
                <TableHead className="font-bold text-slate-900">Sector</TableHead>
                <TableHead className="text-right font-bold text-slate-900 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedCompanies.map((c) => (
                <TableRow key={c.id} className="h-16 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="font-bold text-slate-900 pl-6">
                    <div className="flex flex-col">
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{c.website.replace('https://', '')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50">{c.sector}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/companies/${c.id}`}>
                        <Button variant="default" size="sm" className="bg-slate-900 text-white hover:bg-slate-800 h-8 px-3 text-xs font-semibold">
                          Open Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeItem(c.id)}
                        className="text-slate-300 hover:text-red-600 h-8 w-8 p-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="p-4 bg-slate-50/50 border-t flex justify-between items-center text-xs text-slate-500">
            <span>Total: {savedCompanies.length} {savedCompanies.length === 1 ? 'Company' : 'Companies'}</span>
            <span className="italic">Data persisted in LocalStorage</span>
          </div>
        </div>
      )}
    </div>
  );
}