import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      txHash,
      walletAddress,
      mealCount,
      mealType,
      blockNumber,
      blockTimestamp
    } = body;

    if (!txHash || !walletAddress || !mealCount || !mealType || !blockNumber || !blockTimestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find student by wallet address
    const student = await prisma.student.findUnique({
      where: { walletAddress }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create redemption record
    const redemption = await prisma.redemption.create({
      data: {
        txHash,
        studentId: student.id,
        mealCount: parseInt(mealCount),
        mealType,
        blockNumber: BigInt(blockNumber),
        blockTimestamp: new Date(blockTimestamp)
      }
    });

    return NextResponse.json(redemption);
  } catch (error) {
    console.error('Error creating redemption:', error);
    
    // Handle duplicate transaction hash
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Transaction already recorded' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { walletAddress }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const redemptions = await prisma.redemption.findMany({
      where: { studentId: student.id },
      orderBy: { blockTimestamp: 'desc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json(redemptions);
  } catch (error) {
    console.error('Error fetching redemptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}