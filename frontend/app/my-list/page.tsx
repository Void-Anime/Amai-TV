'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyList } from '@/hooks/useMyList';
import { MyListItem } from '@/lib/userDataService';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';
import Link from 'next/link';
import Image from 'next/image';

export default function MyListPage() {
  const { user } = useAuth();
  const { myList, isLoading, loadMyList } = useMyList();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'plan-to-watch', label: 'Plan to Watch' },
    { value: 'watching', label: 'Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'dropped', label: 'Dropped' }
  ];

  const getStatusColor = (status: MyListItem['status']) => {
    switch (status) {
      case 'watching':
        return 'bg-blue-600 text-blue-100';
      case 'completed':
        return 'bg-green-600 text-green-100';
      case 'plan-to-watch':
        return 'bg-purple-600 text-purple-100';
      case 'dropped':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusText = (status: MyListItem['status']) => {
    switch (status) {
      case 'watching':
        return 'Watching';
      case 'completed':
        return 'Completed';
      case 'plan-to-watch':
        return 'Plan to Watch';
      case 'dropped':
        return 'Dropped';
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    if (user) {
      loadMyList(selectedStatus);
    }
  }, [user, selectedStatus]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <NewNavbar />
        <DesktopNav />
        
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h1 className="text-3xl font-bold text-white mb-4">My List</h1>
              <p className="text-gray-400 mb-8">Sign in to save your favorite anime and track your progress</p>
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

  const filteredList = selectedStatus ? myList.filter(item => item.status === selectedStatus) : myList;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <NewNavbar />
      <DesktopNav />
      
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">My List</h1>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedStatus === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          <p className="text-gray-400">
            {filteredList.length} {selectedStatus ? getStatusText(selectedStatus as MyListItem['status']) : 'total'} anime
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No anime in your list</h3>
            <p className="text-gray-400 mb-6">
              {selectedStatus 
                ? `No anime with status "${getStatusText(selectedStatus as MyListItem['status'])}"`
                : 'Start adding anime to your list to see them here'
              }
            </p>
            <Link
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredList.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="group bg-gray-900 hover:bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="relative">
                  {item.poster ? (
                    <Image
                      src={item.poster}
                      alt={item.title}
                      width={200}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  
                  {/* Rating Badge */}
                  {item.rating && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-600 text-yellow-100 px-2 py-1 text-xs font-semibold rounded">
                        ⭐ {item.rating}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                    {item.notes && (
                      <span className="truncate max-w-20" title={item.notes}>
                        {item.notes}
                      </span>
                    )}
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