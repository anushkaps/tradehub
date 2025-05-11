import React, { useState } from "react";
import { ClipboardList, Users, CheckCircle } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

export function PostJob() {
  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [debugView, setDebugView] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  const addLog = (message, type = "info") => {
    console.log(`[${type.toUpperCase()}]`, message);
    setLogs((prev) => [
      ...prev,
      { message, type, time: new Date().toISOString() },
    ]);
  };

  const handleDataSubmit = async (e) => {
    e.preventDefault();
    setLogs([]);
    setIsSubmitting(true);
    addLog("Starting job submission process...");

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      addLog(`Authenticated as user: ${user.id}`);
      addLog("Inserting job data into 'jobs' table...");

      // Step 1: Create the job record
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .insert([
          {
            title,
            trade_type: serviceType,
            location,
            description,
            budgetRange,
            timeline,
            status: "open",
            bids: 0,
            homeowner_id: user.id,
          },
        ])
        .select();

      if (jobError) {
        addLog(`Error creating job: ${jobError.message}`, "error");
        throw new Error(`Failed to create job: ${jobError.message}`);
      }

      if (!jobData || jobData.length === 0) {
        addLog("Job was created but no data was returned", "warning");
        throw new Error("Job was created but no data was returned");
      }

      const jobId = jobData[0].id;
      addLog(`✅ Job created successfully with ID: ${jobId}`);

      // Step 2: Check if we have photos to upload
      if (photos.length === 0) {
        addLog("No photos to upload, submission complete");
        navigate("/homeowner/dashboard");
        return;
      }

      addLog(`Starting upload of ${photos.length} photos...`);

      // Step 3: Upload each photo
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        addLog(`Processing photo ${i + 1}/${photos.length}: ${photo.name}`);

        // Create a unique filename
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 15)}.${fileExt}`;
        const filePath = `jobs/${user.id}/${jobId}/${fileName}`;

        addLog(`Uploading to path: ${filePath}`);

        // Step 3.1: Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("post-job")
          .upload(filePath, photo);

        if (uploadError) {
          addLog(
            `Failed to upload photo ${i + 1}: ${uploadError.message}`,
            "error"
          );
          continue; // Try the next photo
        }

        addLog(`✅ Photo ${i + 1} uploaded successfully`);

        // Step 3.2: Get public URL
        const { data: urlData } = supabase.storage
          .from("post-job")
          .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
          addLog(`Could not get public URL for photo ${i + 1}`, "error");
          continue;
        }

        const photoUrl = urlData.publicUrl;
        addLog(`Got public URL: ${photoUrl}`);

        // Step 3.3: Create job_photos record
        const { data: photoData, error: photoError } = await supabase
          .from("job_photos")
          .insert([
            {
              job_id: jobId,
              photo_url: photoUrl,
              file_path: filePath,
            },
          ]);

        if (photoError) {
          addLog(
            `Failed to create job_photos record: ${photoError.message}`,
            "error"
          );
        } else {
          addLog(`✅ Photo ${i + 1} linked to job successfully`);
        }
      }

      addLog("✅ All operations completed successfully");

      // Only navigate if we don't have debug view enabled
      if (!debugView) {
        navigate("/homeowner/dashboard");
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we can use Supabase storage
  const checkStorageAccess = async () => {
    try {
      addLog("Checking Supabase storage access...");

      // Check if the bucket exists
      const { data: buckets, error: bucketError } =
        await supabase.storage.listBuckets();

      if (bucketError) {
        addLog(`Error accessing storage: ${bucketError.message}`, "error");
        return false;
      }

      const postJobBucket = buckets.find((b) => b.name === "post-job");
      if (!postJobBucket) {
        addLog("The 'post-job' bucket doesn't exist", "error");
        return false;
      }

      addLog(`✅ Found 'post-job' bucket (ID: ${postJobBucket.id})`);
      return true;
    } catch (error) {
      addLog(`Storage check failed: ${error.message}`, "error");
      return false;
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post a Job</h1>
          <p className="text-xl text-gray-600">
            Find the right professional for your project
          </p>
          <button
            onClick={() => {
              setDebugView(!debugView);
              if (!debugView) {
                checkStorageAccess();
              }
            }}
            className="mt-4 text-sm text-gray-500 underline"
          >
            {debugView ? "Hide Debug Info" : "Show Debug Info"}
          </button>
        </div>

        {debugView && (
          <div className="mb-8 bg-gray-100 p-4 rounded-lg overflow-auto max-h-64">
            <h3 className="font-bold mb-2">Debug Information</h3>
            <div>
              <button
                onClick={checkStorageAccess}
                className="bg-blue-500 text-white px-4 py-1 rounded text-sm mb-2"
              >
                Test Storage Access
              </button>
            </div>
            {logs.map((log, i) => (
              <div
                key={i}
                className={`text-sm mb-1 ${
                  log.type === "error"
                    ? "text-red-600"
                    : log.type === "warning"
                    ? "text-yellow-600"
                    : "text-gray-800"
                }`}
              >
                [{log.time.split("T")[1].split(".")[0]}] {log.message}
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-gray-500">No logs yet.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Job Details</h2>

          <form onSubmit={handleDataSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Enter job title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                >
                  <option value="">Select a service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your postcode"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your project in detail..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                >
                  <option value="">Select budget range</option>
                  <option>Under £500</option>
                  <option>£500 - £1,000</option>
                  <option>£1,000 - £5,000</option>
                  <option>Over £5,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                >
                  <option value="">Select timeline</option>
                  <option>As soon as possible</option>
                  <option>Within 1 week</option>
                  <option>Within 2 weeks</option>
                  <option>Within 1 month</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photos (optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#105298] hover:text-[#0c3d72]"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={(e) => {
                          const selected = Array.from(e.target.files || []);
                          setPhotos(selected);
                          addLog(`Selected ${selected.length} files`);
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {photos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Selected Files:
                  </h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    {photos.map((file, index) => (
                      <li key={index}>
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#e20000] text-white px-8 py-3 rounded-md ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:bg-[#cc0000]"
                }`}
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Describe Your Project",
    description:
      "Tell us what you need done, and we'll help you find the right professional",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Get Quotes",
    description: "Receive quotes from qualified professionals in your area",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Hire the Best",
    description:
      "Compare quotes, reviews, and hire the best professional for your job",
  },
];

const services = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Landscaping",
  "Roofing",
  "HVAC",
  "General Maintenance",
  "Renovation",
  "Other",
];

export default PostJob;
