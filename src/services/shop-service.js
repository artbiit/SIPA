import {
  updateUserCash,
  drawAthletes,
  addAthletesToUser,
} from '../repositories/user-repository.js';

import { prisma } from '../lib/prisma.js';
export const purchaseCash = async ({ Id = null, cash }) => {
  if (cash <= 0) {
    throw new ApiError('Invalid cash amount', 400);
  }

  const totalCash = await updateUserCash(Id, cash);

  return { totalCash };
};

export const gachaAthletes = async ({ Id = null, gatcha }) => {
  const gachaCost = 5000;
  const totalCost = gatcha * gachaCost;

  if (gatcha <= 0) {
    throw new ApiError('Invalid gatcha count', 400);
  }

  return await prisma.$transaction(async (prisma) => {
    const remainingCash = await updateUserCash(Id, -totalCost);
    if (remainingCash < 0) {
      throw new ApiError('Insufficient cash', 400);
    }

    const athletes = await drawAthletes(gatcha);

    await addAthletesToUser(Id, athletes);

    return { athletes };
  });
};
