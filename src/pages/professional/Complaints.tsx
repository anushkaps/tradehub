import { MessageSquare, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Complaints() {
  return (
    <div>
      <Helmet>
        <title>Professional Complaints - TradeHub24</title>
        <meta
          name="description"
          content="Submit and manage any complaints as a professional on TradeHub24 to ensure fair dispute resolution."
        />
        <meta
          name="keywords"
          content="professional complaints, tradehub24, dispute resolution"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Professional Complaints - TradeHub24"
        />
        <meta
          property="og:description"
          content="Submit and manage any complaints as a professional on TradeHub24 to ensure fair dispute resolution."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tradehub24.com/professional/complaints"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Professional Complaints - TradeHub24"
        />
        <meta
          name="twitter:description"
          content="Submit and manage any complaints as a professional on TradeHub24 to ensure fair dispute resolution."
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Professional Complaints - TradeHub24",
            url: "https://www.tradehub24.com/professional/complaints",
            description:
              "Submit and manage any complaints as a professional on TradeHub24 to ensure fair dispute resolution.",
            publisher: {
              "@type": "Organization",
              name: "TradeHub24",
              url: "https://www.tradehub24.com",
            },
          })}
        </script>
      </Helmet>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Complaints Resolution</h1>
            <p className="text-xl text-gray-600">We're here to help resolve any issues</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">File a Complaint</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type of Issue</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]">
                    <option>Select issue type</option>
                    {issueTypes.map((type, index) => (
                      <option key={index}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order/Project Reference</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                    placeholder="Enter reference number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
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
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#105298] hover:text-[#0c3d72] focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#e20000] text-white px-6 py-3 rounded-md hover:bg-[#cc0000] transition-colors"
                >
                  Submit Complaint
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Resolution Process</h2>
                <div className="space-y-4">
                  {resolutionSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#105298] text-white rounded-full">
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-center bg-[#105298] text-white px-6 py-3 rounded-md hover:bg-[#0c3d72] transition-colors">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Live Chat
                  </button>
                  <button className="w-full flex items-center justify-center border border-[#105298] text-[#105298] px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const issueTypes = [
  "Service Quality",
  "Communication Issues",
  "Payment Disputes",
  "Booking Problems",
  "Technical Issues",
  "Other"
];

const resolutionSteps = [
  {
    title: "Submit Complaint",
    description: "Provide details about your issue and any supporting documentation."
  },
  {
    title: "Review Process",
    description: "Our team will review your complaint within 24 hours."
  },
  {
    title: "Investigation",
    description: "We'll investigate the issue and gather necessary information."
  },
  {
    title: "Resolution",
    description: "We'll work with all parties to reach a fair resolution."
  }
];