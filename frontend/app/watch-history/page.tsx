'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import Image from 'next/image';

export default function WatchHistoryPage() {
  const { user } = useAuth();
  const { watchHistory, isLoading, clearWatchHistory } = useWatchHistory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = async () => {
    try {
      await clearWatchHistory();
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing watch history:', error);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-3xl font-bold text-white mb-4">Watch History</h1>
              <p className="text-gray-400 mb-8">Sign in to track your anime watching progress</p>
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Watch History</h1>
            {watchHistory.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Clear History
              </button>
            )}
          </div>
          
          <p className="text-gray-400">
            {watchHistory.length} episodes watched
          </p>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Clear Watch History</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to clear your entire watch history? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleClearHistory}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear History
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-24 h-16 bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : watchHistory.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No watch history</h3>
            <p className="text-gray-400 mb-6">
              Start watching anime to see your history here
            </p>
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {watchHistory.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href={item.url}
                className="group bg-gray-900 hover:bg-gray-800 rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex space-x-4">
                  <div className="relative flex-shrink-0">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        width={96}
                        height={64}
                        className="w-24 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    
                    {/* Progress Bar */}
                    {item.progress && item.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b">
                        <div 
                          className="h-full bg-purple-600 rounded-b"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                      <span>Episode {item.episode}</span>
                      {item.season && <span>Season {item.season}</span>}
                      {item.duration && (
                        <span>{Math.floor(item.duration / 60)} min</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Watched {new Date(item.watchedAt).toLocaleDateString()}</span>
                      {item.progress && (
                        <span>{Math.round(item.progress)}% watched</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <NewBottomNav />
    </div>
  );
}
