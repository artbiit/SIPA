import prisma from '../lib/prisma.js';

export const getUserCash = async (userId) => {
  try {
    const userCash = await prisma.users.findFirst({
      where: {
        id: userId,
      },
      select: {
        cash: true,
      },
    });

    return userCash;
  } catch (error) {
    throw new Error(`Error: ${error}, Failed to get user's cash`);
  }
};

export const setUserCash = async (userId, amount) => {
  try {
    await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        cash: amount,
      },
    });
  } catch (error) {
    throw new Error(`Error: ${error}, Failed to set user's cash`);
  }
};

export const getAthletes = async () => {
  try {
    const athletes = await prisma.athlete.findMany({
      select: {
        id: true,
        athleteName: true,
        speed: true,
        scoringAbility: true,
        power: true,
        defence: true,
        stamina: true,
        athleteType: true,
        spawnRate: true,
      },
    });

    return athletes;
  } catch (error) {
    throw new Error(`Error: ${error}, Failed to get athletes list`);
  }
};

export const addUsersAthlete = async (athletes) => {
  try {
    const userAthlete = await prisma.usersAthlete.createMany({
      data: athletes,
    });
  } catch (error) {
    throw new Error(error);
  }
};
