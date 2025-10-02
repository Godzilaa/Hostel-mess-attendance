'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import ProfileForm from './ProfileForm';

interface OnboardingProps {
  student: {
    id: string;
    walletAddress: string;
    name: string | null;
    hostelBlock: string | null;
    roomNumber: string | null;
    avatarUrl: string | null;
    createdAt: Date;
  };
  onComplete: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function Onboarding({ student, onComplete, isLoading = false }: OnboardingProps) {
  // Ensure proper mobile scrolling
  useEffect(() => {
    // Store original values
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocumentOverflow = document.documentElement.style.overflow;
    
    // Ensure body can scroll for the onboarding component
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocumentOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900 to-indigo-800 z-50"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        height: '100dvh' // Use dynamic viewport height for better mobile support
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-orange-300 rounded-full opacity-10 blur-3xl" />
      </div>

      <div 
        className="relative h-full overflow-y-auto overflow-x-hidden" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        <div className="min-h-full flex items-start justify-center p-4 py-8 sm:py-12 pb-16">
          <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-white font-bold text-2xl sm:text-3xl">HM</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            Welcome to HostelMess! 🎉
          </h1>
          
          <p className="text-purple-200 text-base sm:text-lg mb-2">
            Let's set up your meal passport profile
          </p>
          
          <p className="text-purple-300 text-sm">
            This information helps us personalize your experience and track your meal attendance
          </p>
        </motion.div>

        {/* Onboarding Steps */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-white font-semibold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
            <span className="bg-purple-500 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3">
              1
            </span>
            Complete Your Profile
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="text-purple-200">
              <div className="font-medium text-white mb-1">📝 Basic Info</div>
              <div>Name, hostel block, room number</div>
            </div>
            <div className="text-purple-200">
              <div className="font-medium text-white mb-1">📸 Profile Photo</div>
              <div>Upload your avatar (optional)</div>
            </div>
            <div className="text-purple-200">
              <div className="font-medium text-white mb-1">🍽️ Start Tracking</div>
              <div>Begin your meal attendance journey</div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ProfileForm
            student={student}
            onSave={onComplete}
            isLoading={isLoading}
            isOnboarding={true}
          />
        </motion.div>
        </div>
        </div>
      </div>
    </motion.div>
  );
}