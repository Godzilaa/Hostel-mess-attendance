'use client';

import { motion } from 'framer-motion';
import { 
  FireIcon, 
  CalendarDaysIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline';

interface StatsData {
  totalMeals: number;
  currentStreak: number;
  thisWeek: number;
}

interface StatsSummaryProps {
  stats: StatsData;
  isLoading?: boolean;
}

export default function StatsSummary({ stats, isLoading = false }: StatsSummaryProps) {
  const statsCards = [
    {
      title: 'Total Meals',
      value: stats.totalMeals,
      icon: FireIcon,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'All-time redemptions'
    },
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      icon: TrophyIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      description: 'Consecutive days',
      suffix: stats.currentStreak === 1 ? 'day' : 'days'
    },
    {
      title: 'This Week',
      value: stats.thisWeek,
      icon: CalendarDaysIcon,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'Last 7 days'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className={`inline-flex p-3 rounded-lg ${stat.bg} mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              
              <motion.div
                key={stat.value}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-1"
              >
                {stat.value.toLocaleString()}
                {stat.suffix && (
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    {stat.suffix}
                  </span>
                )}
              </motion.div>
              
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {stat.title}
              </h3>
              
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}