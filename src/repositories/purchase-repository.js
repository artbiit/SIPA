import prisma from '../lib/prisma.js';

export const getUserCash = async (userId) => {
  try {
    const userCash = await prisma.Users.findFirst({
      where: {
        id: userId,
      },
      select: {
        cash: true,
      },
    });

    return userCash;
  } catch (error) {
    throw new Error("Failed to get user's cash");
  }
};

export const setUserCash = async (userId, amount) => {
  try {
    await prisma.Users.update({
      where: {
        id: userId,
      },
      data: {
        cash: amount,
      },
    });
  } catch (error) {
    throw new Error("Failed to set user's cash");
  }
};
