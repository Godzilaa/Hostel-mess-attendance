import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  walletAddress: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { walletAddress } = await params;
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Get student to ensure they exist
    const student = await prisma.student.findUnique({
      where: { walletAddress }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Calculate total meals
    const totalMeals = await prisma.redemption.aggregate({
      where: { studentId: student.id },
      _sum: { mealCount: true }
    });

    // Calculate this week's meals
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const thisWeekMeals = await prisma.redemption.aggregate({
      where: {
        studentId: student.id,
        blockTimestamp: { gte: weekAgo }
      },
      _sum: { mealCount: true }
    });

    // Calculate current streak
    const recentRedemptions = await prisma.redemption.findMany({
      where: { studentId: student.id },
      orderBy: { blockTimestamp: 'desc' },
      take: 30 // Get last 30 to calculate streak
    });

    let currentStreak = 0;
    if (recentRedemptions.length > 0) {
      const today = new Date();
      const redemptionDates = recentRedemptions.map(r => {
        const date = new Date(r.blockTimestamp);
        return date.toDateString();
      });

      // Remove duplicates and sort
      const uniqueDates = [...new Set(redemptionDates)].sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );

      // Calculate consecutive days from today backwards
      let checkDate = new Date(today);
      for (const dateStr of uniqueDates) {
        const redemptionDate = new Date(dateStr);
        const diffDays = Math.floor((today.getTime() - redemptionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === currentStreak) {
          currentStreak++;
        } else if (diffDays === currentStreak + 1) {
          // Allow for 1 day gap (today might not have redemption yet)
          currentStreak++;
        } else {
          break;
        }
      }
    }

    const stats = {
      totalMeals: totalMeals._sum.mealCount || 0,
      currentStreak,
      thisWeek: thisWeekMeals._sum.mealCount || 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}