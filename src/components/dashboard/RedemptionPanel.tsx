'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MinusIcon, 
  PlusIcon, 
  FireIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface RedemptionPanelProps {
  balance: number;
  isLoading?: boolean;
  onRedeem?: (mealCount: number, mealType: string) => Promise<void>;
}

const mealTypes = [
  { id: 'BREAKFAST', label: 'Breakfast', emoji: '🥣', time: '6:00 - 10:00 AM' },
  { id: 'LUNCH', label: 'Lunch', emoji: '🍛', time: '12:00 - 3:00 PM' },
  { id: 'DINNER', label: 'Dinner', emoji: '🍲', time: '6:00 - 10:00 PM' },
  { id: 'SPECIAL_MEAL', label: 'Special', emoji: '🎉', time: 'Event meals' }
];

export default function RedemptionPanel({ balance, isLoading = false, onRedeem }: RedemptionPanelProps) {
  const [mealCount, setMealCount] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState('DINNER');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleIncrement = () => {
    if (mealCount < balance) {
      setMealCount(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (mealCount > 1) {
      setMealCount(prev => prev - 1);
    }
  };

  const handleRedeem = async () => {
    if (balance === 0 || mealCount > balance || isRedeeming) return;

    setIsRedeeming(true);
    try {
      await onRedeem?.(mealCount, selectedMealType);
      setShowSuccess(true);
      setMealCount(1);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Redemption failed:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const selectedMeal = mealTypes.find(meal => meal.id === selectedMealType);
  const canRedeem = balance > 0 && mealCount <= balance && !isRedeeming;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <RedemptionCard />
        </div>
      </div>

      {/* Mobile Bottom Panel */}
      <div className="lg:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <RedemptionCard />
        </div>
        {/* Spacer for mobile */}
        <div className="h-32" />
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 lg:bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="font-medium">
                ✅ {mealCount} meal{mealCount > 1 ? 's' : ''} redeemed! See your new attendance NFT
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  function RedemptionCard() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-t-2xl lg:rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <FireIcon className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Redeem Meals</h3>
        </div>

        {/* Balance Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {balance.toLocaleString()} 
              <span className="text-lg font-normal text-gray-500 ml-1">tokens</span>
            </p>
          </div>
        </div>

        {balance === 0 ? (
          /* Zero Balance State */
          <div className="text-center py-8">
            <div className="text-4xl mb-4">😔</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Out of meal tokens!
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Contact admin for top-up
            </p>
            <p className="text-xs text-gray-400">
              Last mint: 10 tokens on Apr 10
            </p>
          </div>
        ) : (
          <>
            {/* Meal Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Meal Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mealTypes.map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMealType(meal.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedMealType === meal.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{meal.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {meal.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {meal.time}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Count Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Number of Meals
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleDecrement}
                  disabled={mealCount <= 1}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MinusIcon className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {mealCount}
                  </div>
                  <div className="text-sm text-gray-500">
                    meal{mealCount > 1 ? 's' : ''}
                  </div>
                </div>
                
                <button
                  onClick={handleIncrement}
                  disabled={mealCount >= balance}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PlusIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Redeem Button */}
            <motion.button
              onClick={handleRedeem}
              disabled={!canRedeem}
              whileHover={canRedeem ? { scale: 1.02 } : {}}
              whileTap={canRedeem ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                canRedeem
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isRedeeming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Redeeming...</span>
                </div>
              ) : (
                `Redeem ${mealCount} ${selectedMeal?.label} Meal${mealCount > 1 ? 's' : ''}`
              )}
            </motion.button>

            {/* Cost Display */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Cost: {mealCount} token{mealCount > 1 ? 's' : ''} • 
              Remaining: {balance - mealCount} token{(balance - mealCount) !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </motion.div>
    );
  }
}