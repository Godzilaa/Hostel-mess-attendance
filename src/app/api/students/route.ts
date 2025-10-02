import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Find or create student
    let student = await prisma.student.findUnique({
      where: { walletAddress },
      include: {
        redemptions: {
          orderBy: { blockTimestamp: 'desc' },
          take: 20
        }
      }
    });

    if (!student) {
      student = await prisma.student.create({
        data: { walletAddress },
        include: {
          redemptions: {
            orderBy: { blockTimestamp: 'desc' },
            take: 20
          }
        }
      });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('POST /api/students - Received body:', body);
    
    const { walletAddress, name, hostelBlock, roomNumber, avatarUrl } = body;

    if (!walletAddress) {
      console.log('POST /api/students - Missing wallet address');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('POST /api/students - Creating/updating student for:', walletAddress);

    // Skip very large base64 images (> 255 chars) to avoid database errors
    // TODO: Implement proper image upload service
    const processedAvatarUrl = avatarUrl && avatarUrl.length > 255 ? null : avatarUrl;
    
    if (avatarUrl && avatarUrl.length > 255) {
      console.log('POST /api/students - Skipping large avatar image (base64 too long)');
    }

    const student = await prisma.student.upsert({
      where: { walletAddress },
      update: {
        name,
        hostelBlock,
        roomNumber,
        avatarUrl: processedAvatarUrl
      },
      create: {
        walletAddress,
        name,
        hostelBlock,
        roomNumber,
        avatarUrl: processedAvatarUrl
      }
    });

    console.log('POST /api/students - Student created/updated:', student);
    return NextResponse.json(student);
  } catch (error) {
    console.error('Error creating/updating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}