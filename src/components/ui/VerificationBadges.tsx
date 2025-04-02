import React from 'react';
import { Shield, Phone, Mail, CheckCircle } from 'lucide-react';

interface VerificationBadgesProps {
  verifications: {
    phone?: boolean;
    email?: boolean;
    id?: boolean;
    trade?: boolean;
    insurance?: boolean;
    business?: boolean;
  };
}

export function VerificationBadges({ verifications }: VerificationBadgesProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {verifications.phone !== undefined && (
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-[#105298] mr-2" />
          <span>Phone Verified</span>
          {verifications.phone && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
          )}
        </div>
      )}

      {verifications.email !== undefined && (
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-[#105298] mr-2" />
          <span>Email Verified</span>
          {verifications.email && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
          )}
        </div>
      )}

      {verifications.id !== undefined && (
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-[#105298] mr-2" />
          <span>ID Verified</span>
          {verifications.id && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
          )}
        </div>
      )}

      {verifications.trade !== undefined && (
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-[#105298] mr-2" />
          <span>Trade License</span>
          {verifications.trade && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
          )}
        </div>
      )}

      {verifications.insurance !== undefined && (
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-[#105298] mr-2" />
          <span>Insurance</span>
          {verifications.insurance && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
          )}
        </div>
      )}

      {verifications.business !== undefined && (
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-[#105298] mr-2" />
          <span>Business Registration</span>
          {verifications.business && (
            <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
          )}
        </div>
      )}
    </div>
  );
}