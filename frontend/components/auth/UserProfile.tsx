'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService, UserProfile as UserProfileType } from '@/lib/userDataService';
import { AuthModal } from './AuthModal';
import { getRandomAnimeAvatar } from '@/lib/animeAvatars';

interface UserProfileProps {
  onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const profile = await userDataService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSignIn = () => {
    window.location.href = '/signin';
    setShowDropdown(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={handleSignIn}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <span>Sign In</span>
        </button>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
      >
        <img
          src={getRandomAnimeAvatar(user.uid)}
          alt={user.displayName || 'User'}
          className="w-8 h-8 rounded-full object-cover border border-gray-600"
          onError={(e) => {
            // Fallback to initial if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div 
          className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hidden"
          style={{ display: 'none' }}
        >
          <span className="text-white text-sm font-semibold">
            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">
          {user.displayName || user.email?.split('@')[0] || 'User'}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={getRandomAnimeAvatar(user.uid)}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full object-cover border border-gray-600"
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div 
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hidden"
                style={{ display: 'none' }}
              >
                <span className="text-white font-semibold">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">
                  {user.displayName || 'Anonymous User'}
                </p>
                <p className="text-gray-400 text-sm">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setShowDropdown(false);
                window.location.href = '/profile';
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowDropdown(false);
                window.location.href = '/my-list';
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>My List</span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowDropdown(false);
                window.location.href = '/watch-history';
              }}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch History</span>
              </div>
            </button>

            <div className="border-t border-gray-700 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
