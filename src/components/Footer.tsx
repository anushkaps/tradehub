import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#222] text-white text-sm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 text-left">
          
          <div>
            <h3 className="text-[#e20000] font-semibold mb-3">Need Help</h3>
            <ul className="space-y-2">
              <li><Link to="/help/help-and-faq" className="hover:underline">Help & FAQ</Link></li>
              <li><Link to="/help/contact-us" className="hover:underline">Contact us</Link></li>
              <li><Link to="/help/account" className="hover:underline">Account</Link></li>
              <li><Link to="/help/advice-and-inspiration" className="hover:underline">Advice & Inspiration</Link></li>
              <li><Link to="/help/rate-guide" className="hover:underline">Rate Guide</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#e20000] font-semibold mb-3">Legals</h3>
            <ul className="space-y-2">
              <li><Link to="/legal/terms-and-conditions" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link to="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#e20000] font-semibold mb-3">About us</h3>
            <ul className="space-y-2">
              <li><Link to="/about/company-info" className="hover:underline">Company Information</Link></li>
              <li><Link to="/pricing" className="hover:underline">Membership Pricing</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#e20000] font-semibold mb-3">Homeowners</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
              <li><Link to="/homeowner/support" className="hover:underline">Support & Safety</Link></li>
              <li><Link to="/homeowner/hiring-guide" className="hover:underline">Hiring Guide</Link></li>
              <li><Link to="/homeowner/post-job" className="hover:underline">Post a Job</Link></li>
              <li><Link to="/homeowner/support" className="hover:underline">Support</Link></li>
              <li><Link to="/homeowner/complaints" className="hover:underline">Complaints</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[#e20000] font-semibold mb-3">Trade Professionals</h3>
            <ul className="space-y-2">
              <li><Link to="/join-as-pro" className="hover:underline">Sign Up</Link></li>
              <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:underline">Membership & Benefit</Link></li>
              {/* <li><Link to="/professional/complaints" className="hover:underline">Complaints</Link></li> */}
              <li><Link to="/professional/professional-support" className="hover:underline">Professional Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-xs">
          <p>
            <Link to="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link> | 
            <Link to="/legal/terms-and-conditions" className="hover:underline"> Terms and Conditions</Link> | 
            <Link to="#" className="hover:underline"> Request Personal Data</Link> | 
            <Link to="#" className="hover:underline"> Downloads</Link> | 
            <Link to="#" className="hover:underline"> Access Webmail</Link>
          </p>
          <p className="mt-2">Copyright Atlas South Technical Service 2024</p>
        </div>
      </div>
    </footer>
  );
}
