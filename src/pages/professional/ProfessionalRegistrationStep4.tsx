// src/pages/professional/ProfessionalRegistrationStep4.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';

const ProfessionalRegistrationStep4 = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [proofOfID, setProofOfID] = useState<File | null>(null);
  const [liabilityInsurance, setLiabilityInsurance] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      let proofOfIDUrl: string | null = null;
      let liabilityUrl: string | null = null;

      if (proofOfID) {
        const { data, error } = await supabase.storage
          .from('professional-documents')
          .upload(`proofID/${user.id}-${proofOfID.name}`, proofOfID);
        if (error) throw error;
        proofOfIDUrl = data?.path || null;
      }

      if (liabilityInsurance) {
        const { data, error } = await supabase.storage
          .from('professional-documents')
          .upload(`liability/${user.id}-${liabilityInsurance.name}`, liabilityInsurance);
        if (error) throw error;
        liabilityUrl = data?.path || null;
      }

      const { error: dbError } = await supabase
        .from('professionals')
        .update({
          proof_of_id: proofOfIDUrl,
          liability_insurance: liabilityUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .single();

      if (dbError) throw dbError;

      toast.success('All steps completed! You can now access your dashboard.');
      navigate('/professional/dashboard');
    } catch (err: any) {
      console.error('Error in Step4:', err);
      toast.error(err.message || 'Failed to complete step 4');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Upload Documents</h2>
        <p className="mt-2 text-sm text-gray-600">Step 4 of 4</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof of ID
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setProofOfID)}
                accept="image/*,application/pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public Liability Insurance
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setLiabilityInsurance)}
                accept="image/*,application/pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
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
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalRegistrationStep4;
