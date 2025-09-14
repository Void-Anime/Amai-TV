'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userDataService, MyListItem } from '@/lib/userDataService';

interface MyListButtonProps {
  animeId: string;
  animeTitle: string;
  animePoster?: string;
  animeUrl: string;
  className?: string;
}

export const MyListButton: React.FC<MyListButtonProps> = ({
  animeId,
  animeTitle,
  animePoster,
  animeUrl,
  className = ''
}) => {
  const { user } = useAuth();
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<MyListItem['status']>('plan-to-watch');

  useEffect(() => {
    if (user) {
      checkIfInList();
    }
  }, [user, animeId]);

  const checkIfInList = async () => {
    if (!user) return;
    
    try {
      const inList = await userDataService.isInMyList(user.uid, animeId);
      setIsInList(inList);
      
      if (inList) {
        const myList = await userDataService.getMyList(user.uid);
        const item = myList.find(item => item.id === animeId);
        if (item) {
          setCurrentStatus(item.status);
        }
      }
    } catch (error) {
      console.error('Error checking if in list:', error);
    }
  };

  const handleToggleList = async () => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    try {
      setIsLoading(true);
      
      if (isInList) {
        await userDataService.removeFromMyList(user.uid, animeId);
        setIsInList(false);
      } else {
        await userDataService.addToMyList(user.uid, {
          id: animeId,
          title: animeTitle,
          poster: animePoster,
          url: animeUrl,
          status: 'plan-to-watch'
        });
        setIsInList(true);
        setCurrentStatus('plan-to-watch');
      }
    } catch (error) {
      console.error('Error toggling list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: MyListItem['status']) => {
    if (!user || !isInList) return;

    try {
      setIsLoading(true);
      await userDataService.updateMyListItem(user.uid, animeId, { status: newStatus });
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <>
      <div className={`relative ${className}`}>
        {isInList ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleList}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              <span className="text-sm font-medium">
                {isLoading ? 'Removing...' : 'Remove from List'}
              </span>
            </button>

            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value as MyListItem['status'])}
                disabled={isLoading}
                className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 ${getStatusColor(currentStatus)} disabled:cursor-not-allowed`}
              >
                <option value="plan-to-watch">Plan to Watch</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>
        ) : (
          <button
            onClick={handleToggleList}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-sm font-medium">
              {isLoading ? 'Adding...' : 'Add to My List'}
            </span>
          </button>
        )}
      </div>

    </>
  );
};
