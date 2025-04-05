import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Star, Calendar, MapPin, Phone, Mail, CheckCircle, Clock, Award, Globe, PenTool as Tool } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export function PublicProfessionalProfile() {
  const { username } = useParams();
  const [profile, setProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      // const { data, error } = await supabase
      //   .from('professional_profiles')
      //   .select(`
      //     *,
      //     profile:profiles(*),
      //     reviews:reviews(*),
      //     portfolio:portfolio(*)
      //   `)
      //   .eq('username', username)
      //   .single();
      const { data, error } = await supabase
        .from('professionals')
        .select(`
          *,
          profile:profiles(*),
          reviews:reviews(*)
        `)
        .eq('username', username)
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

  const calculateAverageRating = () => {
    if (!profile.reviews?.length) return 0;
    const total = profile.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return (total / profile.reviews.length).toFixed(1);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.company_name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Tool className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-8 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{profile.company_name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{profile.trade_type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <span className="ml-2 text-2xl font-bold">{calculateAverageRating()}</span>
                    <span className="ml-2 text-gray-500">({profile.reviews?.length || 0} reviews)</span>
                  </div>
                  <button className="mt-4 bg-[#e20000] text-white px-6 py-2 rounded-md hover:bg-[#cc0000]">
                    Contact Pro
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {profile.city}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  Since {profile.establishment_year}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  {profile.response_time || 'Usually responds within 1 hour'}
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-2" />
                  {profile.completed_jobs_count || 0} jobs completed
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-line">{profile.bio}</p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Services Offered</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.services?.map((service: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#105298] mr-2" />
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            {profile.portfolio?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 gap-4">
                  {profile.portfolio.map((item: any) => (
                    <div key={item.id} className="rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.description}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 bg-gray-50">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {profile.reviews?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <div className="space-y-6">
                  {profile.reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="ml-1 font-medium">{review.rating}</span>
                        </div>
                        <span className="text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      {review.response && (
                        <div className="mt-4 pl-4 border-l-4 border-gray-200">
                          <p className="text-sm font-medium">Response from {profile.company_name}</p>
                          <p className="text-gray-600 mt-1">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[#105298] mr-3" />
                  {profile.show_phone ? profile.phone : 'Contact via platform'}
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[#105298] mr-3" />
                  {profile.show_email ? profile.email : 'Contact via platform'}
                </div>
                {profile.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-[#105298] mr-3" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#105298] hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Verification</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-[#105298] mr-3" />
                  <span>Trade License Verified</span>
                  {profile.is_verified && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                  )}
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-[#105298] mr-3" />
                  <span>Insurance Verified</span>
                  {profile.insurance_verified && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                  )}
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-[#105298] mr-3" />
                  <span>Business Registered</span>
                  {profile.business_verified && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                  )}
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Business Hours</h2>
              <div className="space-y-2">
                {Object.entries(profile.working_hours || {}).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize">{day}</span>
                    <span>{hours || 'Closed'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}