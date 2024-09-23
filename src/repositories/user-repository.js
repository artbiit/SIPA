import { prisma } from '../lib/prisma.js';

export const createUser = async (userId, password, username, cash = 10000) => {
  return await prisma.user.create({
    data: {
      userId,
      password,
      username,
      cash,
    },
  });
};

export const findUserById = async (userId) => {
  return await prisma.user.findUnique({ where: { id: userId } });
};

export const findUserByUsername = async (userName) => {
  return await prisma.user.findUnique({
    where: { username: userName },
  });
};

export const updateUserCash = async (userId, cash) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { cash: { increment: cash } },
      select: { cash: true },
    });
    return updatedUser.cash;
  } catch (error) {
    throw new ApiError('Failed to update user cash', 500);
  }
};

export const getAthletesByUserId = async (userId) => {
  try {
    const athletes = await prisma.usersAthlete.findMany({
      where: { userId },
      include: {
        Athlete: true,
      },
    });
    return athletes;
  } catch (error) {
    throw new ApiError('Failed to retrieve athletes for the user', 500);
  }
};
