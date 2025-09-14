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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-500/20 mx-auto">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 rounded-2xl blur opacity-20 animate-pulse"></div>
          </div>
          <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Loading your experience...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      <NewNavbar />
      <DesktopNav />
      
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        {/* Very subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-500/3 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Very subtle grid pattern */}
        <div className="absolute inset-0 opacity-3" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Premium Card Container */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-500/20">
                    <span className="text-white font-bold text-2xl">A</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-gray-600 via-slate-600 to-gray-700 rounded-2xl blur opacity-20 animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                {getPageTitle()}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">{getPageDescription()}</p>
            </div>

            {/* Auth Form */}
            <div className="mb-8">
              {renderForm()}
            </div>

            {/* Mode Switcher */}
            {mode === 'login' && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setMode('reset')}
                  className="text-purple-300 hover:text-purple-200 text-sm transition-all duration-200 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Premium Features */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <h3 className="text-white font-semibold mb-6 text-center text-lg">Unlock Premium Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gray-600/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-500/30">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">My List & Bookmarks</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gray-600/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-500/30">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Watch History</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gray-600/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-500/30">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Personalized Feed</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-8 h-8 bg-gray-600/50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-500/30">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Sync Across Devices</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-white transition-all duration-200 hover:underline flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Home</span>
                </button>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <button
                  onClick={() => router.push('/anime')}
                  className="text-gray-400 hover:text-white transition-all duration-200 hover:underline"
                >
                  Browse Anime
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewBottomNav />
    </div>
  );
}
