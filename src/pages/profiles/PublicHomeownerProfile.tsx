import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Star, Calendar, MapPin, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export function PublicHomeownerProfile() {
  const { username } = useParams();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select(`
      //     *,
      //     jobs:jobs(*),
      //     reviews:reviews(*, professional:professional_profiles(*))
      //   `)
      //   .eq('username', username)
      //   .eq('user_type', 'homeowner')
      //   .single();
      
        const { data, error } = await supabase
        .from('profiles')
        .select("*,jobs(*),reviews(*)")
        .eq('username', username)
        .eq('user_type', 'homeowner')
        .single();

      if (error) throw error;
      console.log('Profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.first_name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-500">
                  {profile.first_name?.[0]}
                </span>
              </div>
            )}
            <div className="ml-6">
              <h1 className="text-2xl font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="w-4 h-4 mr-2" />
                {profile.city}
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                Member since {new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Verification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-[#105298] mr-2" />
              <span>Phone Verified</span>
              {profile.phone_verified && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              )}
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-[#105298] mr-2" />
              <span>Email Verified</span>
              {profile.email_verified && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              )}
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-[#105298] mr-2" />
              <span>ID Verified</span>
              {profile.id_verified && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              )}
            </div>
          </div>
        </div>

        {/* Jobs Posted */}
        {profile.jobs && profile.jobs?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Jobs Posted</h2>
            <div className="space-y-4">
              {profile.jobs.map((job: any) => (
                <div key={job.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <h3 className="font-medium">{job.title}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="mr-4">{job.trade_type}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Given */}
        {/* {profile.reviews?.length > 0 && ( */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Reviews Given</h2>
            <div className="space-y-6">
              {profile.reviews.map((review: any) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{review.professional.company_name}</span>
                      <span className="text-gray-600 text-sm ml-2">({review.professional.trade_type})</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        {/* )} */}
      </div>
    </div>
  );
}