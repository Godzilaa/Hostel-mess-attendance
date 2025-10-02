'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '@/components/wallet/ConnectButton';
import { useAutoSwitchToPolygon } from '@/hooks/usePolygonSwitch';
import Header from '@/components/Header';
import StatsSummary from '@/components/dashboard/StatsSummary';
import RedemptionFeed from '@/components/dashboard/RedemptionFeed';
import RedemptionPanel from '@/components/dashboard/RedemptionPanel';
import ProfileForm from '@/components/profile/ProfileForm';
import Onboarding from '@/components/profile/Onboarding';
import TokenBalance from '@/components/tokens/TokenBalance';

// Mock data for demonstration
const mockStudent = {
  id: 'student_1',
  walletAddress: '0x742d35Cc6C4C9C432CD81C9A5C2A067f5B97a52D',
  name: 'Alex Kumar',
  hostelBlock: 'Block A',
  roomNumber: '301',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date('2024-03-15T10:30:00Z')
};

const mockRedemptions = [
  {
    id: 'redemption_1',
    txHash: '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456',
    mealCount: 2,
    mealType: 'DINNER' as const,
    blockTimestamp: new Date('2024-04-20T19:30:00Z')
  },
  {
    id: 'redemption_2',
    txHash: '0x2345678901abcdef2345678901abcdef23456789012345678901abcdef234567',
    mealCount: 1,
    mealType: 'LUNCH' as const,
    blockTimestamp: new Date('2024-04-20T13:15:00Z')
  },
  {
    id: 'redemption_3',
    txHash: '0x3456789012abcdef3456789012abcdef34567890123456789012abcdef345678',
    mealCount: 1,
    mealType: 'BREAKFAST' as const,
    blockTimestamp: new Date('2024-04-20T08:45:00Z')
  },
  {
    id: 'redemption_4',
    txHash: '0x4567890123abcdef4567890123abcdef45678901234567890123abcdef456789',
    mealCount: 3,
    mealType: 'SPECIAL_MEAL' as const,
    blockTimestamp: new Date('2024-04-19T20:00:00Z')
  },
  {
    id: 'redemption_5',
    txHash: '0x5678901234abcdef5678901234abcdef56789012345678901234abcdef567890',
    mealCount: 1,
    mealType: 'DINNER' as const,
    blockTimestamp: new Date('2024-04-19T19:15:00Z')
  }
];

const mockStats = {
  totalMeals: 42,
  currentStreak: 7,
  thisWeek: 5
};

export default function Home() {
  const { isConnected, address } = useAccount();
  const [student, setStudent] = useState(mockStudent);
  const [redemptions, setRedemptions] = useState(mockRedemptions);
  const [stats, setStats] = useState(mockStats);
  const [balance, setBalance] = useState(8); // Mock balance
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Auto-switch to Polygon when connected
  useAutoSwitchToPolygon();

  // Check if user has a profile when wallet connects
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {
        // Check if student profile exists in database
        const response = await fetch(`/api/students/${address}`);
        
        if (response.ok) {
          const studentData = await response.json();
          setStudent(studentData);
          setHasProfile(true);
          setIsOnboarding(false);
        } else if (response.status === 404) {
          // Student not found - trigger onboarding
          setHasProfile(false);
          setIsOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        // Assume new user if API fails
        setHasProfile(false);
        setIsOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected && address) {
      checkUserProfile();
    }
  }, [isConnected, address]);

  // Update student data when wallet is connected
  const connectedStudent = isOnboarding ? {
    id: '',
    walletAddress: address || '',
    name: null,
    hostelBlock: null,
    roomNumber: null,
    avatarUrl: null,
    createdAt: new Date()
  } : {
    ...student,
    walletAddress: address || student.walletAddress
  };

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800">
        <div className="text-center p-8 bg-white/10 backdrop-blur rounded-2xl max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">HM</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">HostelMess</h1>
          <p className="text-purple-200 mb-6">
            Connect your wallet to access your meal attendance dashboard and start collecting your on-chain meal passport
          </p>
          <WalletConnectButton />
          <div className="mt-6 text-sm text-purple-300 flex items-center justify-center space-x-2">
            <span>✨</span>
            <span>Runs on Polygon • Near-zero gas fees</span>
          </div>
        </div>
      </div>
    );
  }

  const handleRedeem = async (mealCount: number, mealType: string) => {
    // Mock redemption process
    console.log(`Redeeming ${mealCount} ${mealType} meal(s)`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new redemption
    const newRedemption = {
      id: `redemption_${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substring(2)}${'0'.repeat(40)}`.substring(0, 66),
      mealCount,
      mealType: mealType as any,
      blockTimestamp: new Date()
    };
    
    // Update state
    setRedemptions(prev => [newRedemption, ...prev]);
    setBalance(prev => prev - mealCount);
    setStats(prev => ({
      ...prev,
      totalMeals: prev.totalMeals + mealCount,
      thisWeek: prev.thisWeek + mealCount
    }));
  };

  const handleProfileSave = async (data: any) => {
    // Save profile for first-time users (onboarding) or updates
    console.log('Saving profile:', data);
    console.log('Wallet address:', address);
    console.log('Is onboarding:', isOnboarding);
    
    setIsLoading(true);
    try {
      const method = isOnboarding ? 'POST' : 'PATCH';
      const url = isOnboarding ? '/api/students' : `/api/students/${address}`;
      
      console.log('Making request:', method, url);
      
      const requestBody = {
        ...data,
        walletAddress: address
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedStudent = await response.json();
        console.log('Updated student:', updatedStudent);
        setStudent(updatedStudent);
        
        if (isOnboarding) {
          setIsOnboarding(false);
          setHasProfile(true);
        }
      } else {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
        throw new Error(`Failed to save profile: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      // For demo purposes, still update local state
      setStudent(prev => ({ ...prev, ...data }));
      if (isOnboarding) {
        setIsOnboarding(false);
        setHasProfile(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show onboarding for new users
  if (isOnboarding) {
    return (
      <Onboarding
        student={connectedStudent}
        onComplete={handleProfileSave}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        student={connectedStudent} 
        balance={balance} 
        onProfileClick={() => setIsProfileOpen(true)} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Summary */}
          <StatsSummary stats={stats} isLoading={isLoading} />

          {/* Main Content Grid */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Redemption Feed - Takes up 2 columns on desktop */}
            <div className="lg:col-span-2 mb-6 lg:mb-0">
              <RedemptionFeed 
                redemptions={redemptions} 
                isLoading={isLoading} 
              />
            </div>

            {/* Right Column - Token Balance & Redemption Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Token Balance Component */}
              <TokenBalance />
              
              {/* Redemption Panel */}
              <RedemptionPanel
                balance={balance}
                isLoading={isLoading}
                onRedeem={handleRedeem}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <ProfileForm
            student={connectedStudent}
            onSave={handleProfileSave}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-orange-100 rounded-full opacity-20 blur-3xl" />
      </div>
    </div>
  );
}
