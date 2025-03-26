import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import Autocomplete from 'react-google-autocomplete';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';  // Replace with your API Key

const ProfessionalRegistrationStep2 = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    address: '',
    city: '',
    postcode: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (!error && data) {
          setFormData({
            companyName: data.company_name || '',
            registrationNumber: data.registration_number || '',
            address: data.address || '',
            city: data.city || '',
            postcode: data.postcode || '',
          });
        }
      } catch (err) {
        console.error('Error fetching step2 data:', err);
      }
    };
    fetchData();
  }, [user]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Google Maps Autocomplete
  const handlePlaceSelect = (place: any) => {
    if (place) {
      const address = place.formatted_address;
      const city = place.address_components.find((c: any) =>
        c.types.includes('locality')
      )?.long_name;

      setFormData((prev) => ({
        ...prev,
        address,
        city: city || prev.city,
      }));
    }
  };

  // UK Postcode Validation
  const validatePostcode = async (postcode: string) => {
    try {
      const res = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/validate`);
      return res.data.result;
    } catch (error) {
      console.error('Postcode validation error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);

    // Validate postcode
    const isValidPostcode = await validatePostcode(formData.postcode);
    if (!isValidPostcode) {
      toast.error('Invalid UK postcode');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('professionals')
        .upsert([{
          user_id: user.id,
          company_name: formData.companyName,
          registration_number: formData.registrationNumber,
          // address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          updated_at: new Date().toISOString(),
        }])
        .single();

      if (error) throw error;
      toast.success('Step 2 saved!');
      navigate('/professional/registration-step3');
    } catch (err: any) {
      console.error('Error in Step2:', err);
      toast.error('Failed to save step 2');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Company Details</h2>
        <p className="mt-2 text-sm text-gray-600">Step 2 of 4</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:ring-[#105298] focus:border-[#105298] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                name="registrationNumber"
                type="text"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:ring-[#105298] focus:border-[#105298] sm:text-sm"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              {<Autocomplete
                apiKey={GOOGLE_MAPS_API_KEY}
                onPlaceSelected={handlePlaceSelect}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:ring-[#105298] focus:border-[#105298] sm:text-sm"
                options={{ types: ['geocode'] }}
              /> }
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:ring-[#105298] focus:border-[#105298] sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postcode
              </label>
              <input
                name="postcode"
                type="text"
                value={formData.postcode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:ring-[#105298] focus:border-[#105298] sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent 
                  rounded-md shadow-sm text-sm font-medium text-white bg-[#e20000] 
                  hover:bg-[#cc0000] focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-[#105298]"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Next Step'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRegistrationStep2;
