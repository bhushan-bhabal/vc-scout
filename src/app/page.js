"use client";
import React, { useState, useEffect, Suspense } from "react";
import { mockCompanies } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus
} from "lucide-react";

import { useSearchParams } from "next/navigation";



function DiscoveryContent() {

  const searchParams = useSearchParams();
  const queryFromUrl = searchParams ? searchParams.get('q') || "" : "";


  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc"
  });

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;


  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);



  const saveCurrentSearch = () => {

    if (!searchTerm.trim()) return;

    const saved = JSON.parse(
      localStorage.getItem("vc_saved_searches") || "[]"
    );

    if (!saved.includes(searchTerm)) {

      const updated = [...saved, searchTerm];

      localStorage.setItem(
        "vc_saved_searches",
        JSON.stringify(updated)
      );

      alert(`Search "${searchTerm}" saved!`);
    }

  };



  const handleSort = (key) => {

    let direction = "asc";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    )
      direction = "desc";

    setSortConfig({ key, direction });

  };



  const sorted = [...mockCompanies].sort((a, b) => {

    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;

    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;

    return 0;

  });



  const filtered = sorted.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const totalPages = Math.ceil(filtered.length / itemsPerPage);


  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  return (

    <div className="p-4 md:p-8 max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Discovery
      </h1>



      {/* Search */}

      <div className="flex flex-col md:flex-row gap-2 max-w-md mb-8">

        <div className="relative flex-1">

          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />

          <Input
            placeholder="Search companies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

        </div>


        <Button
          variant="outline"
          onClick={saveCurrentSearch}
          className="flex gap-2 items-center"
        >

          <BookmarkPlus size={16}/>

          Save Search

        </Button>

      </div>



      {/* Table */}

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">

        <Table>

          <TableHeader className="bg-slate-50">

            <TableRow>


              {/* Company */}

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >

                <div className="flex items-center gap-1">

                  Company

                  <span className="w-4 flex justify-center">

                    {sortConfig.key === "name" ? (

                      sortConfig.direction === "asc"
                        ? <ChevronUp size={14}/>
                        : <ChevronDown size={14}/>

                    ) : (

                      <span className="opacity-0">
                        <ChevronUp size={14}/>
                      </span>

                    )}

                  </span>

                </div>

              </TableHead>



              {/* Sector */}

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("sector")}
              >

                <div className="flex items-center gap-1">

                  Sector

                  <span className="w-4 flex justify-center">

                    {sortConfig.key === "sector" ? (

                      sortConfig.direction === "asc"
                        ? <ChevronUp size={14}/>
                        : <ChevronDown size={14}/>

                    ) : (

                      <span className="opacity-0">
                        <ChevronUp size={14}/>
                      </span>

                    )}

                  </span>

                </div>

              </TableHead>



              {/* Action Column FIXED */}

              <TableHead className="text-right pr-6">

                Action

              </TableHead>


            </TableRow>

          </TableHeader>



          <TableBody>

            {paginated.map((c) => (

              <TableRow key={c.id}>


                <TableCell className="font-bold">

                  {c.name}

                </TableCell>


                <TableCell>

                  <Badge variant="outline">

                    {c.sector}

                  </Badge>

                </TableCell>



                {/* Action Cell FIXED */}

                <TableCell className="text-right pr-6">

                  <Link href={`/companies/${c.id}`}>

                    <Button size="sm">

                      Open Profile

                    </Button>

                  </Link>

                </TableCell>


              </TableRow>

            ))}

          </TableBody>

        </Table>



        {/* Pagination */}

        <div className="p-4 border-t flex justify-between items-center text-sm text-slate-500">

          <span>

            Page {currentPage} of {totalPages}

          </span>



          <div className="flex gap-2">


            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(prev =>
                  Math.max(1, prev - 1)
                )
              }
              disabled={currentPage === 1}
            >

              <ChevronLeft size={16}/>

            </Button>



            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(prev =>
                  Math.min(totalPages, prev + 1)
                )
              }
              disabled={currentPage === totalPages}
            >

              <ChevronRight size={16}/>

            </Button>


          </div>

        </div>


      </div>

    </div>

  );

}



export default function DiscoveryPage() {

  return (

    <Suspense fallback={
      <div className="p-10 text-slate-400">
        Loading Discovery Engine...
      </div>
    }>

      <DiscoveryContent/>

    </Suspense>

  );

}