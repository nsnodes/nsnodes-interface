"use client";

import { Briefcase, ExternalLink, MapPin, DollarSign, Search, ChevronDown, ChevronUp, Building2, Tag, ArrowUpDown } from "lucide-react";
import { jobsDatabase } from "@/lib/data/jobs-database";
import { useState, useRef, useEffect } from "react";

type SortField = "title" | "company" | "location" | "type" | "salary";
type SortDirection = "asc" | "desc";

export default function JobsPage() {
  const [selectedEmployers, setSelectedEmployers] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [employerSearch, setEmployerSearch] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [keywordSearch, setKeywordSearch] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [allFiltersOpen, setAllFiltersOpen] = useState<boolean>(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking the clear button
      if (clearButtonRef.current && clearButtonRef.current.contains(event.target as Node)) {
        return;
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setAllFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleAllFilters = () => {
    setAllFiltersOpen(!allFiltersOpen);
  };

  const toggleFilter = (value: string, filterArray: string[], setFilter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(item => item !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get unique values for filters
  const uniqueEmployers = Array.from(new Set(jobsDatabase.map(job => job.company))).sort();
  const uniqueLocations = Array.from(new Set(jobsDatabase.map(job => job.location))).sort();
  const uniqueTags = Array.from(new Set(jobsDatabase.flatMap(job => job.tags))).sort();

  // Filter lists based on search
  const filteredEmployers = uniqueEmployers.filter(employer =>
    employer.toLowerCase().includes(employerSearch.toLowerCase())
  );
  const filteredLocations = uniqueLocations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );
  const filteredTags = uniqueTags.filter(tag =>
    tag.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  // Filter jobs based on selected filters and keyword search (without sorting)
  const filteredJobs = jobsDatabase.filter(job => {
    // Employer filter
    if (selectedEmployers.length > 0 && !selectedEmployers.includes(job.company)) {
      return false;
    }
    
    // Location filter
    if (selectedLocations.length > 0 && !selectedLocations.includes(job.location)) {
      return false;
    }
    
    // Tag filter
    if (selectedTags.length > 0 && !selectedTags.some(tag => job.tags.includes(tag))) {
      return false;
    }
    
    // Keyword search (searches title, description, and tags)
    if (keywordSearch) {
      const searchTerm = keywordSearch.toLowerCase();
      const searchableText = `${job.title} ${job.description} ${job.tags.join(' ')}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });

  // Calculate metrics from all jobs in database (not affected by filters)
  const liveMetrics = {
    totalJobs: jobsDatabase.length,
    uniqueEmployers: Array.from(new Set(jobsDatabase.map(job => job.company))).length,
    uniqueLocations: Array.from(new Set(jobsDatabase.map(job => job.location))).length,
    remoteJobs: jobsDatabase.filter(job => 
      job.location.toLowerCase().includes('remote') || 
      job.location.toLowerCase().includes('global') ||
      job.location.toLowerCase().includes('worldwide')
    ).length,
    fullTimeJobs: jobsDatabase.filter(job => 
      job.type.toLowerCase().includes('full-time')
    ).length,
    contractJobs: jobsDatabase.filter(job => 
      job.type.toLowerCase().includes('contract')
    ).length
  };

  // Sort the filtered jobs for display
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case "title":
        compareValue = a.title.localeCompare(b.title);
        break;
      case "company":
        compareValue = a.company.localeCompare(b.company);
        break;
      case "location":
        compareValue = a.location.localeCompare(b.location);
        break;
      case "type":
        compareValue = a.type.localeCompare(b.type);
        break;
      case "salary":
        // Extract numeric values from salary strings for comparison
        const aSalary = a.salary.replace(/[^0-9]/g, '');
        const bSalary = b.salary.replace(/[^0-9]/g, '');
        compareValue = parseInt(aSalary || '0') - parseInt(bSalary || '0');
        break;
    }

    return sortDirection === "asc" ? compareValue : -compareValue;
  });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 text-center lg:text-left space-y-4">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">

          </pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ NETWORK STATE JOBS ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base">
            Find job opportunities in the emerging Network State ecosystem. Remote as well as on-site opportunities are available.
          </p>
          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start pt-4">
            <button className="border-2 border-border px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
              [ POST A JOB ] →
            </button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="/job-openings-meme.png" 
            alt="Job openings everywhere meme" 
            className="w-full h-auto border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{liveMetrics.totalJobs}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Open Positions</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{liveMetrics.uniqueEmployers}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Companies Hiring</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{liveMetrics.uniqueLocations}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Locations</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{liveMetrics.remoteJobs}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Remote Jobs</div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Search className="h-6 w-6" />
          [ FILTER JOBS ]
        </h2>
        
        <div ref={filtersRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Employer Filter */}
          <div className="border-2 border-border bg-card">
            <button
              type="button"
              onClick={toggleAllFilters}
              className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                [ EMPLOYER ]
              </div>
              {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {allFiltersOpen && (
              <div className="px-4 pb-4 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50" />
                  <input
                    type="text"
                    value={employerSearch}
                    onChange={(e) => setEmployerSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search employers..."
                    className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredEmployers.map(employer => (
                    <label key={employer} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedEmployers.includes(employer)}
                        onChange={() => toggleFilter(employer, selectedEmployers, setSelectedEmployers)}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      />
                      <span className="text-xs font-mono">{employer}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="border-2 border-border bg-card">
            <button
              type="button"
              onClick={toggleAllFilters}
              className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                [ LOCATION ]
              </div>
              {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {allFiltersOpen && (
              <div className="px-4 pb-4 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50" />
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search locations..."
                    className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredLocations.map(location => (
                    <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      />
                      <span className="text-xs font-mono">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keyword Filter */}
          <div className="border-2 border-border bg-card">
            <button
              type="button"
              onClick={toggleAllFilters}
              className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                [ KEYWORD ]
              </div>
              {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {allFiltersOpen && (
              <div className="px-4 pb-4 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50" />
                  <input
                    type="text"
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search keywords..."
                    className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredTags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleFilter(tag, selectedTags, setSelectedTags)}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      />
                      <span className="text-xs font-mono">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedEmployers.length > 0 || selectedLocations.length > 0 || selectedTags.length > 0 || keywordSearch || sortField !== "title" || sortDirection !== "asc") && (
          <button
            ref={clearButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling to parent elements
              setSelectedEmployers([]);
              setSelectedLocations([]);
              setSelectedTags([]);
              setKeywordSearch("");
              setEmployerSearch("");
              setLocationSearch("");
              setSortField("title");
              setSortDirection("asc");
              setAllFiltersOpen(false); // Close the filters dropdown
            }}
            className="font-mono text-xs border-2 border-border px-4 py-2 bg-card hover:bg-accent transition-colors"
          >
            [ CLEAR ALL FILTERS]
          </button>
        )}
      </section>

      {/* Job Listings */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            [ LATEST OPPORTUNITIES ]
          </h2>
          
          {/* Sorting Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-mono">
            <span className="text-muted-foreground">Sort by:</span>
            <div className="flex flex-wrap gap-1">
              {[
                { field: "title" as SortField, label: "Title" },
                { field: "company" as SortField, label: "Company" },
                { field: "location" as SortField, label: "Location" },
                { field: "type" as SortField, label: "Type" },
                { field: "salary" as SortField, label: "Salary" }
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-2 py-1 text-xs border border-border hover:bg-accent transition-colors flex items-center gap-1 whitespace-nowrap ${
                    sortField === field ? 'bg-accent' : 'bg-background'
                  }`}
                >
                  {label}
                  {sortField === field && (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedJobs.map((job, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4 overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-mono">
                    <span className="font-semibold bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20 font-mono text-xs truncate max-w-[200px]">
                      {job.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="truncate">{job.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500 font-mono text-sm sm:text-base font-bold">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{job.salary}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground">{job.description}</p>

              {/* Tags and Apply Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-mono border border-border bg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-border px-4 py-2 bg-background font-mono text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  APPLY
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">

        </pre>
      </section>
    </div>
  );
}
