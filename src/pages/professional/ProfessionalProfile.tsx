import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../services/supabaseClient';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  businessRegistration: string;
  postcode: string;
  trade: string;
  bio: string;
  website: string;
  yearsOfExperience: number;
  hourlyRate: number;
  avatarUrl: string | null;
}

const ProfessionalProfile: React.FC = () => {
  const { user, profile, updateProfile } = useUser();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    businessRegistration: '',
    postcode: '',
    trade: '',
    bio: '',
    website: '',
    yearsOfExperience: 0,
    hourlyRate: 0,
    avatarUrl: null
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user.email || '',
        phone: profile.phone || '',
        companyName: profile.company_name || '',
        businessRegistration: profile.business_registration || '',
        postcode: profile.postcode || '',
        trade: profile.trade || '',
        bio: profile.bio || '',
        website: profile.website || '',
        yearsOfExperience: profile.years_of_experience || 0,
        hourlyRate: profile.hourly_rate || 0,
        avatarUrl: profile.avatar_url || null
      });
      
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (!user || !profile) {
        throw new Error('User profile not found');
      }
      
      let avatarUrl = formData.avatarUrl;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
        }
      }
      
      const updatedProfile = {
        id: profile.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        company_name: formData.companyName,
        business_registration: formData.businessRegistration,
        postcode: formData.postcode,
        trade: formData.trade,
        bio: formData.bio,
        website: formData.website,
        years_of_experience: formData.yearsOfExperience,
        hourly_rate: formData.hourlyRate,
        avatar_url: avatarUrl || undefined,
        updated_at: new Date().toISOString()
      };
      
      await updateProfile(updatedProfile);
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const tradeOptions = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Roofing',
    'HVAC',
    'Landscaping',
    'General Contracting',
    'Masonry',
    'Flooring',
    'Interior Design',
    'Other'
  ];

  return (
    <div>
      <Helmet>
        <title>Professional Profile - TradeHub24</title>
        <meta
          name="description"
          content="Manage and showcase your trade professional profile, skills, and credentials on TradeHub24."
        />
        <meta
          name="keywords"
          content="professional profile, tradehub24, credentials"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Professional Profile - TradeHub24"
        />
        <meta
          property="og:description"
          content="Manage and showcase your trade professional profile, skills, and credentials on TradeHub24."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tradehub24.com/professional/profile"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Professional Profile - TradeHub24"
        />
        <meta
          name="twitter:description"
          content="Manage and showcase your trade professional profile, skills, and credentials on TradeHub24."
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Professional Profile - TradeHub24",
            url: "https://www.tradehub24.com/professional/profile",
            description:
              "Manage and showcase your trade professional profile, skills, and credentials on TradeHub24.",
            publisher: {
              "@type": "Organization",
              name: "TradeHub24",
              url: "https://www.tradehub24.com",
            },
          })}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Professional Profile</h1>
          
          {message && (
            <div className={`p-4 mb-6 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Avatar Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mr-4">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="postcode" className="block text-gray-700 font-medium mb-2">
                    Postcode
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Business Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="businessRegistration" className="block text-gray-700 font-medium mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    id="businessRegistration"
                    name="businessRegistration"
                    value={formData.businessRegistration}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="trade" className="block text-gray-700 font-medium mb-2">
                    Primary Trade
                  </label>
                  <select
                    id="trade"
                    name="trade"
                    value={formData.trade}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a trade</option>
                    {tradeOptions.map(trade => (
                      <option key={trade} value={trade}>{trade}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-gray-700 font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://"
                  />
                </div>
                
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-gray-700 font-medium mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience || ''}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="hourlyRate" className="block text-gray-700 font-medium mb-2">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate || ''}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell potential clients about your experience, skills, and what makes your service unique..."
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
