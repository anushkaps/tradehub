import React from 'react';
import { CheckCircle2, AlertTriangle, Search, FileText } from 'lucide-react';

export function HiringGuide() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hiring Guide</h1>
          <p className="text-xl text-gray-600">Everything you need to know about hiring trade professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">How to Hire Right</h2>
            {hiringSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#105298] text-white rounded-full">
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Professional at work"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CheckCircle2 className="w-6 h-6 text-[#105298] mr-2" />
              What to Look For
            </h2>
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-[#105298] mr-3 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-[#e20000] mr-2" />
              Red Flags to Watch Out For
            </h2>
            <div className="space-y-4">
              {redFlags.map((flag, index) => (
                <div key={index} className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-[#e20000] mr-3 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Essential Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <FileText className="w-8 h-8 text-[#105298] mb-4" />
                <h3 className="font-semibold mb-2">{doc.title}</h3>
                <p className="text-gray-600 text-sm">{doc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const hiringSteps = [
  {
    title: "Define Your Project",
    description: "Clearly outline your requirements, budget, and timeline before starting your search."
  },
  {
    title: "Research Professionals",
    description: "Review profiles, ratings, and previous work examples of potential professionals."
  },
  {
    title: "Get Multiple Quotes",
    description: "Compare quotes from at least three different professionals to ensure fair pricing."
  },
  {
    title: "Check Credentials",
    description: "Verify licenses, insurance, and certifications relevant to the job."
  }
];

const checklistItems = [
  "Valid trade licenses and certifications",
  "Comprehensive insurance coverage",
  "Positive customer reviews and ratings",
  "Clear communication and professionalism",
  "Detailed written quotes",
  "Portfolio of similar projects",
  "References from previous clients"
];

const redFlags = [
  "Pressure to make an immediate decision",
  "Unusually low quotes compared to others",
  "Reluctance to provide references",
  "No physical business address",
  "Requests for large upfront payments",
  "Lack of proper documentation",
  "Poor communication or unprofessionalism"
];

const documents = [
  {
    title: "Written Contract",
    description: "A detailed agreement outlining scope of work, timeline, and payment terms."
  },
  {
    title: "Insurance Certificates",
    description: "Proof of liability and workers' compensation insurance."
  },
  {
    title: "License Verification",
    description: "Documentation of required trade licenses and certifications."
  }
];