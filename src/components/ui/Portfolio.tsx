import React from 'react';
import { ExternalLink } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface PortfolioProps {
  items: PortfolioItem[];
}

export function Portfolio({ items }: PortfolioProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative aspect-video">
            <img
              src={item.image_url}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <button className="mt-4 text-[#105298] hover:text-[#0c3d72] flex items-center text-sm font-medium">
              View Details
              <ExternalLink className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}