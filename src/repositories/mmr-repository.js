export const findOpponentByMMR = async (userId) => {
  try {
    const mmrRange = Utils.RandomRangeInt(100, 300);
    const userMMR = await prisma.mmr.findUnique({ where: { userId } });

    const opponents = await prisma.mmr.findMany({
      where: {
        AND: [
          { userId: { not: userId } },
          { value: { gte: userMMR.value - mmrRange, lte: userMMR.value + mmrRange } },
          { hasFullTeam: true },
        ],
      },
    });

    if (opponents.length === 0) {
      return null;
    }

    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

    return randomOpponent;
  } catch (error) {
    throw new ApiError('Failed to find opponent', 500);
  }
};

export const updateMMR = async (userId, mmrChange) => {
  try {
    await prisma.mmr.update({
      where: { userId },
      data: { value: { increment: mmrChange } },
    });
  } catch (error) {
    throw new ApiError('Failed to update MMR', 500);
  }
};
