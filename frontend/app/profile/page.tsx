'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService, UserProfile } from '@/lib/userDataService';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import { getRandomAnimeAvatar } from '@/lib/animeAvatars';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWatched: 0,
    totalInList: 0,
    watchingCount: 0,
    completedCount: 0,
    planToWatchCount: 0
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserStats();
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

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      const userStats = await userDataService.getUserStats(user.uid);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NewNavbar />
        <DesktopNav />
        
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h1 className="text-3xl font-bold text-white mb-4">Profile</h1>
              <p className="text-gray-400 mb-8">Sign in to view your profile and statistics</p>
            </div>
            
            <button
              onClick={() => window.location.href = '/signin'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Sign In to Continue
            </button>
          </div>
        </div>

        <NewBottomNav />
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <NewNavbar />
      <DesktopNav />
      
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={getRandomAnimeAvatar(user.uid)}
                  alt={user.displayName || 'User'}
                  className="w-20 h-20 rounded-full object-cover border border-gray-600"
                  onError={(e) => {
                    // Fallback to initial if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center hidden"
                  style={{ display: 'none' }}
                >
                  <span className="text-white text-2xl font-bold">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">
                    {user.displayName || 'Anonymous User'}
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Watch History</h3>
                <p className="text-3xl font-bold text-purple-400">{stats.totalWatched}</p>
                <p className="text-sm text-gray-400">Episodes watched</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">My List</h3>
                <p className="text-3xl font-bold text-blue-400">{stats.totalInList}</p>
                <p className="text-sm text-gray-400">Anime in list</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Currently Watching</h3>
                <p className="text-3xl font-bold text-green-400">{stats.watchingCount}</p>
                <p className="text-sm text-gray-400">Active series</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Completed</h3>
                <p className="text-3xl font-bold text-yellow-400">{stats.completedCount}</p>
                <p className="text-sm text-gray-400">Finished series</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Plan to Watch</h3>
                <p className="text-3xl font-bold text-pink-400">{stats.planToWatchCount}</p>
                <p className="text-sm text-gray-400">Saved for later</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                <p className="text-lg font-bold text-green-400">Active</p>
                <p className="text-sm text-gray-400">Premium features available</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/my-list"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors duration-200"
                >
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="font-medium">My List</p>
                </Link>

                <Link
                  href="/watch-history"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors duration-200"
                >
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">Watch History</p>
                </Link>

                <Link
                  href="/"
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors duration-200"
                >
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="font-medium">Browse Anime</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <NewBottomNav />
    </div>
  );
}