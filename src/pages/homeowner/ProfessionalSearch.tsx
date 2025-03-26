import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { Star, MapPin, Clock, Briefcase, Filter, Search } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  company_name: string;
  avatar_url: string;
  trade: string;
  location: string;
  distance: number;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  years_experience: number;
  description: string;
  verified: boolean;
}

const ProfessionalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState({
    trade: '',
    minRating: 0,
    maxDistance: 50,
    verified: false
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const tradeOptions = [
    "All Trades",
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Roofer",
    "HVAC Technician",
    "Mason",
    "Landscaper",
    "General Contractor"
  ];

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would be a call to Supabase
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (id: string) => {
    navigate(`/professional/${id}`);
  };

  const handleContactPro = (id: string) => {
    navigate(`/homeowner/messages`, { state: { professionalId: id } });
  };

  const handleFiltersChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const applyFilters = () => {
    // In a real implementation, this would modify the Supabase query
    setShowFilters(false);
  };

  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pro.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pro.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrade = filters.trade === '' || filters.trade === 'All Trades' || pro.trade === filters.trade;
    const matchesRating = pro.rating >= filters.minRating;
    const matchesDistance = pro.distance <= filters.maxDistance;
    const matchesVerified = !filters.verified || pro.verified;
    
    return matchesSearch && matchesTrade && matchesRating && matchesDistance && matchesVerified;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find the Right Professional</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, trade or company..."
            className="pl-10 py-3 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Filter Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trade</label>
              <select
                name="trade"
                value={filters.trade}
                onChange={handleFiltersChange}
                className="w-full p-2 border rounded-md"
              >
                {tradeOptions.map((trade) => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating ({filters.minRating})
              </label>
              <input
                type="range"
                name="minRating"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={handleFiltersChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Distance ({filters.maxDistance} mi)
              </label>
              <input
                type="range"
                name="maxDistance"
                min="5"
                max="100"
                step="5"
                value={filters.maxDistance}
                onChange={handleFiltersChange}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="verified"
                  checked={filters.verified}
                  onChange={handleFiltersChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                Verified Professionals Only
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setFilters({
                  trade: '',
                  minRating: 0,
                  maxDistance: 50,
                  verified: false
                });
                setShowFilters(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-medium mb-2">No professionals found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilters({
                trade: '',
                minRating: 0,
                maxDistance: 50,
                verified: false
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((pro) => (
            <div key={pro.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="h-16 w-16 rounded-full bg-blue-100 overflow-hidden mr-4 flex-shrink-0">
                    {pro.avatar_url ? (
                      <img 
                        src={pro.avatar_url} 
                        alt={pro.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-200 text-blue-700 text-xl font-bold">
                        {pro.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{pro.name}</h3>
                    <p className="text-gray-600">{pro.company_name}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{pro.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({pro.reviews_count} reviews)</span>
                    </div>
                    {pro.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{pro.trade}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{pro.location} ({pro.distance} miles away)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{pro.years_experience} years experience</span>
                  </div>
                </div>
                
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{pro.description}</p>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleViewProfile(pro.id)}
                    className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleContactPro(pro.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalSearch;