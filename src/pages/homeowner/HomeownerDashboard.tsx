// src/pages/homeowner/HomeownerDashboard.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUser } from "../../contexts/UserContext";
import { supabase } from "../../services/supabaseClient";

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  pendingBids: number;
}

interface RecentJob {
  id: string;
  title: string;
  status: string;
  created_at: string;
  bids_count: number; // We'll store the final number here
}

interface RecentMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export function HomeownerDashboard() {
  // const { user, profile } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    pendingBids: 0,
  });
  const userId = localStorage.getItem("user_id");
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", userId)
      .single();
    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
    console.log("User profile:", data);
    setProfile(data);
  };

  useEffect(() => {
    // console.log("UserId: "+userId)
    // if (!user) return;
    // if (!profile) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all jobs for stats
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("id, status")
          .eq("homeowner_id", userId);

        if (jobsError) throw jobsError;

        // Calculate stats
        const totalJobs = jobsData?.length || 0;
        const activeJobs =
          jobsData?.filter(
            (job) => job.status === "open" || job.status === "in_progress"
          ).length || 0;
        const completedJobs =
          jobsData?.filter((job) => job.status === "completed").length || 0;

        // 2. Fetch pending bids count
        const { count: pendingBids, error: bidsError } = await supabase
          .from("bids")
          .select("id", { count: "exact" })
          .eq("status", "pending")
          .in("job_id", jobsData?.map((job) => job.id) || []);

        if (bidsError) throw bidsError;

        setStats({
          totalJobs,
          activeJobs,
          completedJobs,
          pendingBids: pendingBids || 0,
        });

        // 3. Fetch recent jobs (with bids_count)
        //    NOTE: 'bids(count)' returns an array of objects like [{ count: number }]
        //    We'll transform that array to a single number.
        const { data: recentJobsData, error: recentJobsError } = await supabase
          .from("jobs")
          .select(
            `
            id,
            title,
            status,
            created_at,
            bids(count)
          `
          )
          .eq("homeowner_id", userId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (recentJobsError) throw recentJobsError;

        // Transform the array to get bids_count as a number
        const transformedJobs: RecentJob[] = (recentJobsData || []).map(
          (job: any) => {
            const bidsCountArr = job.bids || [];
            // If there's at least one object in the array, get .count, else 0
            const count =
              bidsCountArr.length > 0 && bidsCountArr[0].count
                ? bidsCountArr[0].count
                : 0;
            return {
              id: job.id,
              title: job.title,
              status: job.status,
              created_at: job.created_at,
              bids_count: count,
            };
          }
        );

        setRecentJobs(transformedJobs);

        // 4. Fetch recent messages (with sender)
        //    'sender:profiles!sender_id(...)' can return an array if there's more than one match,
        //    so we'll transform that as well.
        // const { data: messagesData, error: messagesError } = await supabase
        //   .from('messages')
        //   .select(`
        //     id,
        //     sender_id,
        //     content,
        //     created_at,
        //     sender:profiles!sender_id(
        //       first_name,
        //       last_name,
        //       avatar_url
        //     )
        //   `)
        //   .eq('receiver_id', user.id)
        //   .order('created_at', { ascending: false })
        //   .limit(5);
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(
            `
            id,
            sender_id,
            content,
            created_at
          `
          )
          .eq("receiver_id", userId)
          .order("created_at", { ascending: false })
          .limit(5);

        if (messagesError) throw messagesError;

        const transformedMessages: RecentMessage[] = (messagesData || []).map(
          (msg: any) => {
            // Check if 'sender' is an array
            const singleSender = Array.isArray(msg.sender)
              ? msg.sender[0]
              : msg.sender;

            return {
              id: msg.id,
              sender_id: msg.sender_id,
              content: msg.content,
              created_at: msg.created_at,
              sender: {
                first_name: singleSender?.first_name || "",
                last_name: singleSender?.last_name || "",
                avatar_url: singleSender?.avatar_url,
              },
            };
          }
        );

        setRecentMessages(transformedMessages);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchUserProfile();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Homeowner Dashboard - TradeHub24</title>
        <meta
          name="description"
          content="Manage your home improvement projects, track job progress, and communicate with professionals all in one place."
        />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.first_name || "Homeowner"}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your projects
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/homeowner/post-job"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Post New Job
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <p className="text-2xl font-semibold">{stats.totalJobs}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Jobs</p>
                    <p className="text-2xl font-semibold">{stats.activeJobs}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Completed Jobs</p>
                    <p className="text-2xl font-semibold">
                      {stats.completedJobs}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Pending Bids</p>
                    <p className="text-2xl font-semibold">
                      {stats.pendingBids}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Jobs</h2>
                  <Link
                    to="/homeowner/my-jobs"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y">
                {recentJobs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    You haven't posted any jobs yet.
                  </div>
                ) : (
                  recentJobs.map((job) => (
                    <div key={job.id} className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          to={`/homeowner/job/${job.id}`}
                          className="text-lg font-medium hover:text-blue-500"
                        >
                          {job.title}
                        </Link>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            job.status
                          )}`}
                        >
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Posted on {formatDate(job.created_at)}</span>
                        <span>{job.bids_count || 0} bids</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Messages</h2>
                  {/* <Link
                    to="/homeowner/messages"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View All
                  </Link> */}
                </div>
              </div>
              <div className="divide-y">
                {recentMessages.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    You don't have any messages yet.
                  </div>
                ) : (
                  recentMessages.map((message) => (
                    <div key={message.id} className="p-6">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3">
                          {message.sender.avatar_url ? (
                            <img
                              src={message.sender.avatar_url}
                              alt="Sender"
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            message.sender.first_name[0]
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium">
                              {message.sender.first_name}{" "}
                              {message.sender.last_name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-600 line-clamp-2">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeownerDashboard;
