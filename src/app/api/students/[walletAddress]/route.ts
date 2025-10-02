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

    const student = await prisma.student.findUnique({
      where: { walletAddress },
      include: {
        redemptions: {
          orderBy: { blockTimestamp: 'desc' }
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { walletAddress } = await params;
    const body = await request.json();
    console.log('PATCH /api/students/[walletAddress] - Received body:', body);
    
    const { name, hostelBlock, roomNumber, avatarUrl } = body;

    if (!walletAddress) {
      console.log('PATCH /api/students/[walletAddress] - Missing wallet address');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('PATCH /api/students/[walletAddress] - Updating student for:', walletAddress);

    // Skip very large base64 images (> 255 chars) to avoid database errors
    // TODO: Implement proper image upload service
    const processedAvatarUrl = avatarUrl && avatarUrl.length > 255 ? null : avatarUrl;
    
    if (avatarUrl && avatarUrl.length > 255) {
      console.log('PATCH /api/students/[walletAddress] - Skipping large avatar image (base64 too long)');
    }

    const student = await prisma.student.update({
      where: { walletAddress },
      data: {
        name,
        hostelBlock,
        roomNumber,
        avatarUrl: processedAvatarUrl
      }
    });

    console.log('PATCH /api/students/[walletAddress] - Student updated:', student);
    return NextResponse.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}