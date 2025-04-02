import React from 'react';
import { MapPin, Calendar, Shield, Star } from 'lucide-react';
import { Badge } from './Badge';
import { Rating } from './Rating';

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  location?: string;
  joinDate: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  userType: 'homeowner' | 'professional';
  stats?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
}

export function ProfileHeader({
  name,
  avatar,
  location,
  joinDate,
  rating,
  reviewCount,
  verified,
  userType,
  stats
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-500">{name[0]}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="ml-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                {name}
                {verified && (
                  <Shield className="w-5 h-5 text-[#105298] ml-2" />
                )}
              </h1>
              
              {location && (
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location}
                </div>
              )}
              
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                Member since {new Date(joinDate).toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>

            {rating !== undefined && (
              <div className="text-right">
                <div className="flex items-center">
                  <Rating value={rating} />
                  <span className="ml-2 text-gray-600">
                    ({reviewCount} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center">
                  {stat.icon}
                  <div className="ml-3">
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}