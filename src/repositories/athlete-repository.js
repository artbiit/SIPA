import ApiError from '../errors/api-error';
import Utils from '../lib/utils';

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
    throw new ApiError('Failed to verify athlete ownership', 500);
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
    const athletesData = await prisma.athlete.findMany({
      select: { id: true, name: true, spawnRate: true },
    });

    const athletes = [];
    for (let i = 0; i < gatchaCount; i++) {
      const athlete = getWeightedRandomAthletes(athletesData);
      athletes.push(athlete);
    }

    return athletes;
  } catch (error) {
    throw new ApiError('Failed to draw athletes', 500);
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
