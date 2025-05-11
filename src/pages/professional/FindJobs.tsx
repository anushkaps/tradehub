// src/pages/professional/FindJobs.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import {
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaTools,
  FaExternalLinkAlt,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number | null;
  category: string;
  timeline: string;
  created_at: string;
  status: string;
  homeowner: {
    first_name: string;
    last_name: string;
  } | null;
  interested: boolean;
}

const FindJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [timelineFilter, setTimelineFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [tradeCategories, setTradeCategories] = useState<string[]>([]);
  const [userTradeCategories, setUserTradeCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [timelines, setTimelines] = useState<string[]>([]);
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);

  useEffect(() => {
    // 1) load your professional trade_categories from 'professionals'
    const fetchUserTradeCategories = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("professionals")
          .select("trade_categories")
          .eq("user_id", user.id)
          .single();
        if (error) throw error;

        if (data?.trade_categories) {
          setUserTradeCategories(data.trade_categories);
        }
      } catch (err) {
        console.error("Error fetching trade categories:", err);
      }
    };

    // 2) load global filter options from 'jobs'
    const fetchFilterOptions = async () => {
      try {
        const [{ data: cd }, { data: ld }, { data: td }] = await Promise.all([
          supabase.from("jobs").select("category").not("category", "is", null),
          supabase.from("jobs").select("location").not("location", "is", null),
          supabase.from("jobs").select("timeline").not("timeline", "is", null),
        ]);

        if (cd) setTradeCategories([...new Set(cd.map((j) => j.category))]);
        if (ld) setLocations([...new Set(ld.map((j) => j.location))]);
        if (td) setTimelines([...new Set(td.map((j) => j.timeline))]);
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };

    fetchUserTradeCategories();
    fetchFilterOptions();
    fetchJobs();
  }, []);

  // 3) fetch open jobs + your bids
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select(
          `
          *,
          homeowner:profiles!jobs_homeowner_id_fkey(
            first_name,
            last_name
          )
        `
        )
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (jobsError) throw jobsError;

      const { data: bidsData, error: bidsError } = await supabase
        .from("bids")
        .select("job_id")
        .eq("professional_id", user.id);
      if (bidsError) throw bidsError;

      const bidJobIds = bidsData?.map((b) => b.job_id) || [];

      setJobs(
        (jobsData || []).map((j) => ({
          ...j,
          interested: bidJobIds.includes(j.id),
        }))
      );
    } catch (err) {
      console.error("Failed to load jobs:", err);
      toast.error("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 4) express interest → insert into bids
  const handleExpressInterest = async (jobId: string) => {
    setProcessingJobId(jobId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existing } = await supabase
        .from("bids")
        .select("*")
        .eq("job_id", jobId)
        .eq("professional_id", user.id)
        .single();
      if (existing) return;

      const { error: insertError } = await supabase.from("bids").insert({
        job_id: jobId,
        professional_id: user.id,
        amount: null,
        status: "interested",
      });
      if (insertError) throw insertError;

      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, interested: true } : j))
      );
      toast.success("Interest expressed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to express interest.");
    } finally {
      setProcessingJobId(null);
    }
  };

  // filtering + helpers
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter ? job.category === categoryFilter : true;
    const matchesLoc = locationFilter ? job.location === locationFilter : true;
    const matchesTl = timelineFilter ? job.timeline === timelineFilter : true;
    return matchesSearch && matchesCat && matchesLoc && matchesTl;
  });
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setLocationFilter("");
    setTimelineFilter("");
  };

  // ——— render (unchanged) ———
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
        <p className="mt-2 text-gray-600">
          Browse available jobs that match your skills and expertise.
        </p>

        {/* search + filters */}
        <div className="bg-white shadow rounded-lg mt-6 mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border-gray-300 rounded w-full"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border rounded"
              >
                <FaFilter className="inline mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <button
                onClick={() => {
                  clearFilters();
                  fetchJobs();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Refresh Jobs
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm mb-1">Trade Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border-gray-300 rounded"
                  >
                    <option value="">All</option>
                    {(userTradeCategories.length
                      ? userTradeCategories
                      : tradeCategories
                    ).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm mb-1">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full border-gray-300 rounded"
                  >
                    <option value="">All</option>
                    {locations.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Timeline */}
                <div>
                  <label className="block text-sm mb-1">Timeline</label>
                  <select
                    value={timelineFilter}
                    onChange={(e) => setTimelineFilter(e.target.value)}
                    className="w-full border-gray-300 rounded"
                  >
                    <option value="">All</option>
                    {timelines.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* job cards */}
        {loading ? (
          <div className="text-center py-10">
            <div className="spinner mx-auto mb-2" />
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length ? (
          <ul className="bg-white shadow rounded divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <li key={job.id} className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-blue-600">
                    {job.title}
                  </h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    {job.status}
                  </span>
                </div>
                <p className="mt-2 text-gray-500 line-clamp-2">
                  {job.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
                  {job.location && (
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {job.location}
                    </span>
                  )}
                  {job.category && (
                    <span className="flex items-center">
                      <FaTools className="mr-1" />
                      {job.category}
                    </span>
                  )}
                  {job.budget != null && (
                    <span className="flex items-center">
                      <FaDollarSign className="mr-1" />$
                      {job.budget.toLocaleString()}
                    </span>
                  )}
                  {job.timeline && (
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {job.timeline}
                    </span>
                  )}
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    Posted {formatDate(job.created_at)}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {job.homeowner
                      ? `Posted by: ${
                          job.homeowner.first_name
                        } ${job.homeowner.last_name.charAt(0)}.`
                      : "Homeowner"}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/professional/job-details/${job.id}`}
                      className="px-3 py-1.5 border rounded text-gray-700 flex items-center"
                    >
                      <FaExternalLinkAlt className="mr-1" />
                      View Details
                    </Link>
                    {job.interested ? (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded flex items-center">
                        <FaCheck className="mr-1" />
                        Interested
                      </span>
                    ) : (
                      <button
                        onClick={() => handleExpressInterest(job.id)}
                        disabled={processingJobId === job.id}
                        className="px-3 py-1.5 bg-red-600 text-white rounded"
                      >
                        {processingJobId === job.id
                          ? "Processing…"
                          : "Express Interest"}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 bg-white rounded shadow">
            <FaSearch className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter || locationFilter || timelineFilter
                ? "Try adjusting your filters."
                : "There are no open jobs right now."}
            </p>
            {(searchTerm ||
              categoryFilter ||
              locationFilter ||
              timelineFilter) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 border rounded"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJobs;
