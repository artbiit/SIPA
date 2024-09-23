import ApiError from '../errors/api-error.js';
import logger from '../lib/logger.js';
import Utils from '../lib/utils.js';
import { prisma } from '../lib/prisma.js';

export const checkAthleteOwnership = async (userId, athleteId) => {
  try {
    const athlete = await prisma.usersAthlete.findFirst({
      where: {
        userId,
        athleteId,
      },
    });
    return !!athlete;
  } catch (error) {
    throw new Error('Failed to verify athlete ownership', 500);
  }
};

export const updateTeam = async (userId, { attacker, defender, middle }) => {
  try {
    const updatedTeam = await prisma.myTeam.upsert({
      where: { userId },
      update: { attackerId: attacker, defenderId: defender, middleId: middle },
      create: {
        userId,
        attackerId: attacker,
        defenderId: defender,
        middleId: middle,
      },
    });
    return updatedTeam;
  } catch (error) {
    throw new ApiError('Failed to update team', 500);
  }
};

export const getAthletesByIds = async (userId, athleteIds) => {
  try {
    const athletes = await prisma.usersAthlete.findMany({
      where: {
        id: { in: athleteIds },
        userId: userId,
      },
    });
    return athletes;
  } catch (error) {
    throw new ApiError('Failed to retrieve athletes', 500);
  }
};

export const deleteAthletesByIds = async (userId, athleteIds) => {
  try {
    await prisma.usersAthlete.deleteMany({
      where: {
        id: { in: athleteIds },
        userId: userId,
      },
    });
  } catch (error) {
    throw new ApiError('Failed to delete athletes', 500);
  }
};

export const createEnhancedAthlete = async (userId, { athleteId, enhance }) => {
  try {
    const newAthlete = await prisma.usersAthlete.create({
      data: {
        userId,
        athleteId,
        enhance,
      },
    });
    return newAthlete;
  } catch (error) {
    throw new ApiError('Failed to create enhanced athlete', 500);
  }
};

export const deleteAthleteById = async (athleteId) => {
  try {
    await prisma.usersAthlete.delete({
      where: {
        id: athleteId,
      },
    });
  } catch (error) {
    throw new ApiError('Failed to delete athlete', 500);
  }
};

export const drawAthletes = async (gatchaCount) => {
  try {
    const athletesData = await prisma.athlete.findMany();

    const athletes = [];
    for (let i = 0; i < gatchaCount; i++) {
      const athlete = getWeightedRandomAthletes(athletesData);
      athletes.push(athlete);
    }

    return athletes;
  } catch (error) {
    console.error(error);
    throw new ApiError('Failed to draw athletes', 500);
  }
};

const getWeightedRandomAthletes = (athletesData) => {
  const totalWeight = athletesData.reduce((sum, athlete) => sum + athlete.spawnRate, 0);
  let random = Math.random() * totalWeight;

  for (const athlete of athletesData) {
    if (random < athlete.spawnRate) {
      return athlete;
    }
    random -= athlete.spawnRate;
  }
};

export const addAthletesToUser = async (userId, athletes) => {
  try {
    const newAthletes = athletes.map((athlete) => ({
      userId,
      athleteId: athlete.id,
      enhance: 0,
    }));

    await prisma.usersAthlete.createMany({
      data: newAthletes,
    });
  } catch (error) {
    throw new ApiError('Failed to add athletes to user', 500);
  }
};

export const getUserAthletes = async (userId) => {
  try {
    return await prisma.usersAthlete.findMany({
      where: { userId },
      include: { Athlete: true },
    });
  } catch (error) {
    throw new ApiError('Failed to retrieve user athletes', 500);
  }
};

export const getPaginatedAthletes = async (page, pageCount) => {
  try {
    // 총 선수 수 가져오기
    const totalCount = await prisma.athlete.count();

    // 요청한 페이지에 해당하는 선수 목록 가져오기
    const athletes = await prisma.athlete.findMany({
      skip: page * pageCount,
      take: pageCount,
      select: {
        id: true,
        name: true,
        power: true,
        spawnRate: true,
      },
    });

    return { athletes, totalCount };
  } catch (error) {
    throw new ApiError('Failed to retrieve athletes', 500);
  }
};

export const getAthleteById = async (userId, athleteId) => {
  try {
    const athlete = await prisma.usersAthlete.findFirst({
      where: {
        id: athleteId,
        userId: userId,
      },
    });
    return athlete;
  } catch (error) {
    throw new ApiError('Failed to retrieve athlete', 500);
  }
};
