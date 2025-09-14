'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import NewNavbar from '@/components/NewNavbar';
import NewBottomNav from '@/components/NewBottomNav';
import DesktopNav from '@/components/DesktopNav';

type AuthMode = 'login' | 'signup' | 'reset';

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
            onClose={() => router.push('/')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => setMode('login')}
            onClose={() => router.push('/')}
          />
        );
      case 'reset':
        return (
          <PasswordResetForm
            onBack={() => setMode('login')}
            onClose={() => router.push('/')}
          />
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'signup':
        return 'Create Account';
      case 'reset':
        return 'Reset Password';
      default:
        return 'Authentication';
    }
  };

  const getPageDescription = () => {
    switch (mode) {
      case 'login':
        return 'Welcome back! Sign in to continue your anime journey';
      case 'signup':
        return 'Join AMAI TV and start your anime adventure';
      case 'reset':
        return 'Enter your email to receive a password reset link';
      default:
        return 'Access your account';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <NewNavbar />
      <DesktopNav />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20"></div>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{getPageTitle()}</h1>
            <p className="text-gray-400">{getPageDescription()}</p>
          </div>

          {/* Auth Form */}
          <div className="mb-8">
            {renderForm()}
          </div>

          {/* Additional Links */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <button
                onClick={() => router.push('/')}
                className="hover:text-white transition-colors duration-200"
              >
                ← Back to Home
              </button>
              <span>•</span>
              <button
                onClick={() => router.push('/anime')}
                className="hover:text-white transition-colors duration-200"
              >
                Browse Anime
              </button>
            </div>
            
            {/* Mode Switcher */}
            {mode === 'login' && (
              <div className="text-center">
                <button
                  onClick={() => setMode('reset')}
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>

          {/* Features Preview */}
          <div className="mt-12 bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-4 text-center">What you get with an account:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save anime to My List</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Track watch history</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Sync across devices</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewBottomNav />
    </div>
  );
}
