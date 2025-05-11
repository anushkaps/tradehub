import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import {
  MapPin,
  DollarSign,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchJobDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJobDetails();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6 text-center text-gray-500">
        Job not found or something went wrong.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <div className="mt-1 flex items-center">
            {getStatusBadge(job.status)}
            <span className="ml-2 text-sm text-gray-500">
              Posted on {formatDate(job.created_at)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 mt-2">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50">
            <Edit className="w-4 h-4 mr-1 text-gray-500" />
            Edit
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50">
            <Trash2 className="w-4 h-4 mr-1 text-red-500" />
            Cancel Job
          </button>
        </div>
      </div>

      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
          {["details", "quotes", "messages"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab === "details"
                ? "Job Details"
                : tab === "quotes"
                ? "Quotes (0)"
                : "Messages"}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "details" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Job Information
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Details about your job request.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {[
                ["Category", job.trade_type],
                ["Description", job.description],
                ["Location", job.location, MapPin],
                ["Budget Range", job.budgetRange, DollarSign],
                ["Timeline", job.timeline, Calendar],
              ].map(([label, value, Icon], idx) => (
                <div
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                >
                  <dt className="text-sm font-medium text-gray-500">
                    {Icon ? (
                      <Icon className="inline-block h-4 w-4 mr-1" />
                    ) : null}
                    {label}
                  </dt>
                  <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {value || "N/A"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {activeTab === "quotes" && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No quotes received yet.
        </div>
      )}

      {activeTab === "messages" && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No messages yet.
        </div>
      )}
    </div>
  );
};

export default JobDetails;
