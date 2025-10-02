'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  CheckBadgeIcon, 
  LinkIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface Redemption {
  id: string;
  txHash: string;
  mealCount: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SPECIAL_MEAL';
  blockTimestamp: Date;
}

interface RedemptionFeedProps {
  redemptions: Redemption[];
  isLoading?: boolean;
}

const mealConfig = {
  BREAKFAST: {
    emoji: '🥣',
    label: 'Breakfast',
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    gradient: 'from-blue-400 to-blue-600'
  },
  LUNCH: {
    emoji: '🍛',
    label: 'Lunch',
    color: 'bg-green-50 text-green-900 border-green-200',
    gradient: 'from-green-400 to-green-600'
  },
  DINNER: {
    emoji: '🍲',
    label: 'Dinner',
    color: 'bg-purple-50 text-purple-900 border-purple-200',
    gradient: 'from-purple-400 to-purple-600'
  },
  SPECIAL_MEAL: {
    emoji: '🎉',
    label: 'Special',
    color: 'bg-orange-50 text-orange-900 border-orange-200',
    gradient: 'from-orange-400 to-orange-600'
  }
};

function RedemptionCard({ redemption, index }: { redemption: Redemption; index: number }) {
  const config = mealConfig[redemption.mealType];
  
  const handleViewTransaction = () => {
    const url = `https://polygonscan.com/tx/${redemption.txHash}`;
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'HostelMess Meal Redemption',
      text: `I redeemed ${redemption.mealCount} ${config.label.toLowerCase()} meal(s) at Hostel Mess!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      {/* Card Header with Gradient */}
      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{config.emoji}</div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
                  {config.label}
                </span>
                {redemption.mealCount > 1 && (
                  <span className="text-sm font-semibold text-gray-700">
                    +{redemption.mealCount} meals
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(redemption.blockTimestamp), 'EEE, MMM dd • h:mm a')}
              </p>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center space-x-1 text-green-600">
            <CheckBadgeIcon className="w-5 h-5" />
            <span className="text-xs font-medium">On-chain verified</span>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>Transaction:</span>
              <code className="font-mono text-xs bg-white px-2 py-1 rounded border">
                {redemption.txHash.slice(0, 8)}...{redemption.txHash.slice(-6)}
              </code>
            </div>
            
            <button
              onClick={handleViewTransaction}
              className="inline-flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              <span>View</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleShare}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
          >
            Share meal 📱
          </button>
          
          <div className="text-xs text-gray-400">
            #{redemption.id.slice(-8)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="text-6xl mb-4">🍛</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No meals redeemed yet!
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Redeem your first meal to start your attendance streak and begin collecting your on-chain meal passport.
      </p>
      <div className="inline-flex items-center space-x-2 text-sm text-purple-600">
        <span>👆</span>
        <span>Use the redemption panel to get started</span>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-16 bg-gray-100 rounded-lg mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RedemptionFeed({ redemptions, isLoading = false }: RedemptionFeedProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (redemptions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Recent Redemptions
      </h2>
      
      <div className="space-y-4">
        {redemptions.map((redemption, index) => (
          <RedemptionCard
            key={redemption.id}
            redemption={redemption}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}