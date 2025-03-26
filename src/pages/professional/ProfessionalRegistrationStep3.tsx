// src/pages/professional/ProfessionalRegistrationStep3.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';

const ProfessionalRegistrationStep3 = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    companySummary: '',
    servicesOffered: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('professionals')
          .select('company_summary, services_offered')
          .eq('user_id', user.id)
          .single();
        if (!error && data) {
          setFormData({
            companySummary: data.company_summary || '',
            servicesOffered: data.services_offered || '',
          });
        }
      } catch (err) {
        console.error('Error fetching step3 data:', err);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({
          company_summary: formData.companySummary,
          services_offered: formData.servicesOffered,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      toast.success('Step 3 saved!');
      navigate('/professional/registration-step4');
    } catch (err: any) {
      console.error('Error in Step3:', err);
      toast.error(err.message || 'Failed to save step 3');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Company Profile</h2>
        <p className="mt-2 text-sm text-gray-600">Step 3 of 4</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Summary
              </label>
              <textarea
                name="companySummary"
                rows={4}
                value={formData.companySummary}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:ring-[#105298] focus:border-[#105298] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Services Offered (comma-separated)
              </label>
              <textarea
                name="servicesOffered"
                rows={3}
                value={formData.servicesOffered}
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
              >
                Next Step
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRegistrationStep3;
