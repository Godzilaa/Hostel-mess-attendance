'use client';

import { useState } from 'react';
import { 
  UserCircleIcon, 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisconnect } from 'wagmi';

interface HeaderProps {
  student?: {
    name: string | null;
    avatarUrl: string | null;
    walletAddress: string;
  };
  balance?: number;
  onProfileClick?: () => void;
}

export default function Header({ student, balance = 0, onProfileClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { disconnect } = useDisconnect();

  const formatBalance = (balance: number) => {
    return balance.toLocaleString();
  };

  const handleLogout = () => {
    disconnect();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HM</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">HostelMess</h1>
                <p className="text-xs text-gray-500 -mt-1">Your on-chain meal passport</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Balance Badge */}
            <motion.div 
              className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl">🍽️</span>
              <span className="font-semibold text-purple-900">
                {formatBalance(balance)} tokens
              </span>
            </motion.div>

            {/* Student Avatar */}
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {student?.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name || 'Student'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {student?.name || 'Student'}
                </p>
                <p className="text-xs text-gray-500">
                  {student?.walletAddress ? 
                    `${student.walletAddress.slice(0, 6)}...${student.walletAddress.slice(-4)}` 
                    : 'Connect Wallet'
                  }
                </p>
              </div>
            </button>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Disconnect Wallet"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Balance */}
              <div className="flex items-center justify-center space-x-2 bg-purple-50 px-4 py-3 rounded-lg">
                <span className="text-2xl">🍽️</span>
                <span className="font-semibold text-purple-900">
                  {formatBalance(balance)} tokens
                </span>
              </div>

              {/* Mobile Profile */}
              <button
                onClick={() => {
                  onProfileClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {student?.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.name || 'Student'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-gray-400" />
                )}
                <div className="text-left">
                  <p className="font-medium text-gray-900">
                    {student?.name || 'Student'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student?.walletAddress ? 
                      `${student.walletAddress.slice(0, 6)}...${student.walletAddress.slice(-4)}` 
                      : 'Connect Wallet'
                    }
                  </p>
                </div>
              </button>

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Disconnect Wallet</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}