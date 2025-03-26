import React, { useState } from 'react';
import { Building2, Briefcase, FileCheck } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { updateProfile } from '../../services/profileService';
import { useNavigate } from 'react-router-dom';

const ProfessionalRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    companyName: '',
    companyStatus: '',
    registrationNumber: '',
    employeeCount: '',
    establishmentYear: '',
    insuranceNumber: '',
    tradeType: '',
    // Future: ID upload field etc.
  });
  const { profile } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Status</label>
                <select
                  name="companyStatus"
                  value={formData.companyStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                >
                  <option value="">Select status</option>
                  <option value="limited">Limited Company</option>
                  <option value="corporation">Corporation</option>
                  <option value="sole_trader">Sole Trader</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Employees</label>
                <input
                  type="number"
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Trade Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trade Type</label>
                <select
                  name="tradeType"
                  value={formData.tradeType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                >
                  <option value="">Select trade</option>
                  <option value="plumber">Plumber</option>
                  <option value="electrician">Electrician</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="builder">Builder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Insurance Number</label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year Established</label>
                <input
                  type="number"
                  name="establishmentYear"
                  value={formData.establishmentYear}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // On final submit, update the professional's profile with additional details.
  const handleFinalSubmit = async () => {
    try {
      // TODO: Add UK postcode validation and Google Maps geolocation integration here.
      const updates = {
        company_name: formData.companyName,
        business_registration_number: formData.registrationNumber,
        trade: formData.tradeType,
        // Add other fields as needed
      };
      await updateProfile(profile!.id, updates);
      toast.success('Profile updated successfully.');
      // Redirect to professional dashboard (or next step)
      // navigate('/professional/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join as a Professional</h1>
          <p className="text-xl text-gray-600">Start your 30-day free trial today</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((s, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step > index ? 'bg-[#105298] text-white' : 
                    step === index + 1 ? 'bg-[#105298] text-white' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {s.icon}
                  </div>
                  <div className={`ml-4 ${index < steps.length - 1 ? 'flex-grow' : ''}`}>
                    <p className="text-sm font-medium">{s.title}</p>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block w-full h-0.5 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              <button
                onClick={() => {
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    handleFinalSubmit();
                  }
                }}
                className="ml-auto px-6 py-3 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000]"
              >
                {step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const steps = [
  {
    title: 'Personal Details',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    title: 'Company Info',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    title: 'Trade Details',
    icon: <FileCheck className="w-5 h-5" />,
  },
];

export default ProfessionalRegistration;
