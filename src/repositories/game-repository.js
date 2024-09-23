import { prisma } from '../lib/prisma.js';

export const getTop100MMR = async () => {
  try {
    const topUsers = await prisma.MMR.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 100,
      include: {
        Users: {
          select: {
            userName: true,
          },
        },
      },
    });
    return topUsers;
  } catch (error) {
    console.error('Error fetching top 100 MMR:', error);
    throw new Error('Could not fetch top 100 MMR users');
  }
};

export const getMMRByUserId = async (Id) => {
  try {
    const userMMR = await prisma.MMR.findFirst({
      where: {
        userId: Id,
      },
      include: {
        Users: {
          select: {
            userName: true,
          },
        },
      },
    });

    return userMMR;
  } catch (error) {
    throw new Error('Could not fetch MMR for the given user');
  }
};
