import { prisma } from '../lib/prisma.js';
import ApiError from '../errors/api-error.js';
import Utils from '../lib/utils.js';
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

    const closestOpponent = opponents.reduce((closest, opponent) => {
      const currentDiff = Math.abs(opponent.score - userScore);
      const closestDiff = Math.abs(closest.score - userScore);
      return currentDiff < closestDiff ? opponent : closest;
    }, opponents[0]);

    return closestOpponent;
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
