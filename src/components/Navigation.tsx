// src/components/Navigation.tsx
import React, { useState } from "react";
import { Menu, X, User, LogOut, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logoImage from "../assets/logo-image.png";
import logoName from "../assets/logo-name.png";
import { useUser } from "../contexts/UserContext";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { userType, setUserType, isAuthenticated, signOut } = useUser();
  const navigate = useNavigate();

  const currentUserType = userType || "homeowner";

  const handleUserTypeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedType = e.target.value as "homeowner" | "professional";
    await setUserType(selectedType);
    navigate("/");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload();
      navigate("/");
      isAuthenticated === false;
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img src={logoImage} alt="Logo Icon" className="h-12 w-auto" />
              <img src={logoName} alt="Logo Text" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {currentUserType === "homeowner" ? (
              <>
                <Link
                  to="/how-it-works"
                  className="text-gray-700 hover:text-[#105298]"
                >
                  How It Works
                </Link>
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-[#105298]"
                >
                  Services
                </Link>
                <Link
                  to="/find-pros"
                  className="text-gray-700 hover:text-[#105298]"
                >
                  Find Pros
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/professional/how-it-works"
                  className="text-gray-700 hover:text-[#105298]"
                >
                  How It Works
                </Link>
                <Link
                  to="/professional/find-jobs"
                  className="text-gray-700 hover:text-[#105298]"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/professional/membership"
                  className="text-gray-700 hover:text-[#105298]"
                >
                  Membership
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to={`/${currentUserType}/dashboard`}
                  className="text-gray-700 hover:text-[#105298]"
                >
                  Dashboard
                </Link>
                <Link
                  to={`/${currentUserType}/profile`}
                  className="text-gray-700 hover:text-[#105298]"
                >
                  Profile
                </Link>
                <Link
                to={`/${currentUserType}/notifications`}
                className="text-gray-700 hover:text-[#105298]">
                  <Bell className="h-4 w-4 mr-2" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent 
                    text-sm font-medium rounded-md text-white bg-[#e20000] hover:bg-[#cc0000]"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <select
                    value={currentUserType}
                    onChange={handleUserTypeChange}
                    className="appearance-none bg-white border border-gray-300 rounded-md 
                      py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#105298]"
                  >
                    <option value="homeowner">For Homeowners</option>
                    <option value="professional">For Professionals</option>
                  </select>
                </div>
                <Link
                  to={`/${currentUserType}/login`}
                  className="inline-flex items-center px-4 py-2 border border-transparent 
                    text-sm font-medium rounded-md text-white bg-[#e20000] hover:bg-[#cc0000]"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuthenticated && (
              <div className="mb-2">
                <select
                  value={currentUserType}
                  onChange={handleUserTypeChange}
                  className="w-full bg-white border border-gray-300 rounded-md 
                    py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#105298]"
                >
                  <option value="homeowner">For Homeowners</option>
                  <option value="professional">For Professionals</option>
                </select>
              </div>
            )}

            {currentUserType === "homeowner" ? (
              <>
                <Link
                  to="/how-it-works"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/services"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/find-pros"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Find Pros
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/professional/how-it-works"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/professional/find-jobs"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/professional/membership"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Membership
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to={`/${currentUserType}/dashboard`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to={`/${currentUserType}/profile`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/${currentUserType}/signup`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to={`/${currentUserType}/login`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
