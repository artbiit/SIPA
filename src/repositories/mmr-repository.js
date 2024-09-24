import { prisma } from '../lib/prisma.js';
import ApiError from '../errors/api-error.js';
import logger from '../lib/logger.js';

export const findOpponentByMMR = async (userId) => {
  try {
    const userMMR = await prisma.MMR.findUnique({ where: { userId } });
    const userScore = userMMR?.score || 0;

    const opponents = await prisma.MMR.findMany({
      where: {
        userId: { not: userId },
      },
      orderBy: {
        score: 'asc',
      },
    });

    if (opponents.length === 0) {
      return null;
    }

    const closestOpponents = opponents
      .map((opponent) => ({
        opponent,
        scoreDiff: Math.abs(opponent.score - userScore),
      }))
      .sort((a, b) => a.scoreDiff - b.scoreDiff)
      .slice(0, 5)
      .map(({ opponent }) => opponent);

    const randomOpponent = closestOpponents[Math.floor(Math.random() * closestOpponents.length)];

    return randomOpponent;
  } catch (error) {
    logger.error(`Failed to find opponent. ${error}`);
    throw new ApiError('Failed to find opponent', 500);
  }
};

export const updateMMR = async (userId, mmrChange) => {
  try {
    const currentMMR = await prisma.MMR.findUnique({
      where: { userId },
    });

    if (currentMMR) {
      const newScore = Math.max(currentMMR.score + mmrChange, 0);
      await prisma.MMR.update({
        where: { userId },
        data: {
          score: newScore,
        },
      });
    } else {
      await prisma.MMR.create({
        data: {
          userId,
          score: Math.max(mmrChange, 0),
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    throw new ApiError('Failed to update MMR', 500);
  }
};
