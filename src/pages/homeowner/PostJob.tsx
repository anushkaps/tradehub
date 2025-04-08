import React from 'react';
import { ClipboardList, Clock, Users, CheckCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface JobData{
  title: string;
  serviceType: string;
  location: string;
  description: string;
  budgetRange: string;
  timeline: string;
  photos?: File[];
}

export function PostJob() {

  const [title, setTitle] = React.useState<string>('');
  const [serviceType, setServiceType] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [budgetRange, setBudgetRange] = React.useState<string>('');
  const [timeline, setTimeline] = React.useState<string>('');
  const [photos, setPhotos] = React.useState<File[]>([]);

  const navigate = useNavigate();

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData: JobData = {
      title,
      serviceType,
      location,
      description,
      budgetRange,
      timeline,
      photos
    };
    const {data,error} = await supabase.from('jobs').insert([
      {
        title: jobData.title,
        trade_type: jobData.serviceType,
        location: jobData.location,
        description: jobData.description,
        budgetRange: jobData.budgetRange,
        timeline: jobData.timeline,
        status: 'open',
        bids: 0,
        homeowner_id: localStorage.getItem('user_id'),
      }
    ])
    if (error) {
      console.error('Error inserting job data:', error);
    } else {
      console.log('Job data inserted successfully:', data);
    }
    if (photos.length > 0) {
      const { data: uploadData, error: uploadError } = await supabase.storage.from('post-job').upload(`${photos[0].name}`, photos[0]);
      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
      } else {
        console.log('Photo uploaded successfully:', uploadData);
      }
    }
    navigate('/homeowner/dashboard');

  }

  

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post a Job</h1>
          <p className="text-xl text-gray-600">Find the right professional for your project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
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
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  placeholder="Enter job title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  name="title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select value={serviceType} onChange={e=>setServiceType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]">
                  <option>Select a service</option>
                  {services.map((service, index) => (
                    <option key={index}>{service}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  placeholder="Enter your postcode"
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  name="location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Description</label>
              <textarea
                rows={4}
                placeholder="Describe your project in detail..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                name="description"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                <select onChange={(e)=>setBudgetRange(e.target.value)} value={budgetRange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]">
                  <option>Select budget range</option>
                  <option>Under £500</option>
                  <option>£500 - £1,000</option>
                  <option>£1,000 - £5,000</option>
                  <option>Over £5,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timeline</label>
                <select onChange={(e)=>setTimeline(e.target.value)} value={timeline} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]">
                  <option>Select timeline</option>
                  <option>As soon as possible</option>
                  <option>Within 1 week</option>
                  <option>Within 2 weeks</option>
                  <option>Within 1 month</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Photos (optional)</label>
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
                      <input id="file-upload" onChange={(e) => e.target.files && setPhotos(Array.from(e.target.files))} name="file-upload" type="file" className="sr-only" multiple />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors"
              >
                Post Job
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
    description: "Tell us what you need done, and we'll help you find the right professional"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Get Quotes",
    description: "Receive quotes from qualified professionals in your area"
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Hire the Best",
    description: "Compare quotes, reviews, and hire the best professional for your job"
  }
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
  "Other"
];