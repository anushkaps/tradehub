import React, { useState } from 'react';
import { AlertTriangle, FileText, MessageSquare, CheckCircle, X } from 'lucide-react';

interface DisputeResolutionProps {
  jobId: string;
  jobTitle: string;
  otherPartyName: string;
  userType: 'homeowner' | 'professional';
  onSubmit?: (disputeData: any) => void;
  onCancel?: () => void;
}

const DisputeResolution: React.FC<DisputeResolutionProps> = ({
  jobId,
  jobTitle,
  otherPartyName,
  userType,
  onSubmit,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [disputeType, setDisputeType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disputeId, setDisputeId] = useState<string | null>(null);
  
  const disputeTypes = [
    { id: 'quality', label: 'Quality of Work' },
    { id: 'incomplete', label: 'Incomplete Work' },
    { id: 'payment', label: 'Payment Issue' },
    { id: 'communication', label: 'Communication Problem' },
    { id: 'damage', label: 'Property Damage' },
    { id: 'other', label: 'Other Issue' },
  ];
  
  const outcomeOptions = [
    { id: 'refund', label: 'Full Refund' },
    { id: 'partial_refund', label: 'Partial Refund' },
    { id: 'rework', label: 'Rework/Fix Issues' },
    { id: 'mediation', label: 'Mediation with Admin' },
    { id: 'other', label: 'Other Resolution' },
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // This would be replaced with an actual API call
      // Simulate API call to submit dispute
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const disputeData = {
        jobId,
        disputeType,
        description,
        desiredOutcome,
        attachments: attachments.map(file => file.name), // In a real app, you'd upload these files
        createdBy: userType,
      };
      
      // Mock response
      const mockDisputeId = `disp_${Date.now()}`;
      setDisputeId(mockDisputeId);
      setSuccess(true);
      
      if (onSubmit) {
        onSubmit(disputeData);
      }
    } catch (error) {
      console.error('Error submitting dispute:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  if (success && disputeId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Dispute Submitted</h2>
          <p className="mt-2 text-gray-600">
            Your dispute has been submitted successfully. Our team will review it shortly.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Dispute ID:</span>
            <span className="font-medium">{disputeId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Job:</span>
            <span className="font-medium">{jobTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-yellow-600">Under Review</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          You will receive updates about your dispute via email and notifications. Our support team will contact you if additional information is needed.
        </p>
        
        <button
          onClick={() => window.location.href = `/jobs/details/${jobId}`}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Return to Job Details
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">File a Dispute</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-sm text-gray-600">
            Filing a dispute for job: <span className="font-semibold">{jobTitle}</span>
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex mb-6">
          <div className="flex-1">
            <div className={`h-1 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className="flex justify-center mt-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
            </div>
            <p className="text-xs text-center mt-1">Issue</p>
          </div>
          <div className="flex-1">
            <div className={`h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className="flex justify-center mt-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
            <p className="text-xs text-center mt-1">Details</p>
          </div>
          <div className="flex-1">
            <div className={`h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className="flex justify-center mt-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
            </div>
            <p className="text-xs text-center mt-1">Evidence</p>
          </div>
        </div>
      </div>
      
      {/* Step 1: Issue Type */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">What issue are you experiencing?</h3>
          
          <div className="space-y-2 mb-6">
            {disputeTypes.map((type) => (
              <div
                key={type.id}
                className={`border rounded-lg p-3 cursor-pointer ${
                  disputeType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setDisputeType(type.id)}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="font-medium">{type.label}</p>
                  </div>
                  <div className="ml-3">
                    <input
                      type="radio"
                      checked={disputeType === type.id}
                      onChange={() => setDisputeType(type.id)}
                      className="h-4 w-4 text-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={nextStep}
              disabled={!disputeType}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                !disputeType ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Description and Desired Outcome */}
      {step === 2 && (
        <div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Describe the issue in detail
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide specific details about the issue..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What outcome are you seeking?
            </label>
            
            <div className="space-y-2">
              {outcomeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-3 cursor-pointer ${
                    desiredOutcome === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setDesiredOutcome(option.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="font-medium">{option.label}</p>
                    </div>
                    <div className="ml-3">
                      <input
                        type="radio"
                        checked={desiredOutcome === option.id}
                        onChange={() => setDesiredOutcome(option.id)}
                        className="h-4 w-4 text-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!description || !desiredOutcome}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                !description || !desiredOutcome ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Evidence and Submission */}
      {step === 3 && (
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload supporting evidence (optional)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-3">
              <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Browse Files
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, PDF (Max 5MB each)
              </p>
            </div>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Our support team will review your dispute and may contact both parties for additional information. Most disputes are resolved within 3-5 business days.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !description || !desiredOutcome}
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                loading || !description || !desiredOutcome
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-600'
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Dispute'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeResolution;