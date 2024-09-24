import { updateUserCash, findUserById } from '../repositories/user-repository.js';
import { addAthletesToUser, drawAthletes } from '../repositories/athlete-repository.js';
import ApiError from '../errors/api-error.js';
import { prisma } from '../lib/prisma.js';

/**
 * @swagger
 * /shop/purchase:
 *   post:
 *     summary: "Purchase Cash"
 *     description: "Add cash to the user's account"
 *     tags:
 *       - Shop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cash
 *             properties:
 *               cash:
 *                 type: integer
 *                 description: "Amount of cash to purchase"
 *     responses:
 *       200:
 *         description: "Cash purchased successfully"
 *       400:
 *         description: "Invalid cash amount"
 */
export const purchaseCash = async ({ Id = null, cash }) => {
  if (cash <= 0) {
    throw new ApiError('Invalid cash amount', 400);
  }

  const totalCash = await updateUserCash(Id, cash);
  return { totalCash };
};

/**
 * @swagger
 * /shop/gacha:
 *   post:
 *     summary: "Gacha Athlete Draw"
 *     description: "Perform a gacha draw to get random athletes"
 *     tags:
 *       - Shop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gatcha
 *             properties:
 *               gatcha:
 *                 type: integer
 *                 description: "Number of gacha draws"
 *     responses:
 *       200:
 *         description: "Athletes drawn successfully"
 *       400:
 *         description: "Insufficient cash or invalid gatcha count"
 */
export const gachaAthletes = async ({ Id = null, gatcha }) => {
  const gachaCost = 5000;
  const totalCost = gatcha * gachaCost;

  if (gatcha <= 0) {
    throw new ApiError('Invalid gatcha count', 400);
  }

  return await prisma.$transaction(async (prisma) => {
    const user = await findUserById(Id);
    if (user.cash < totalCost) {
      throw new ApiError('Insufficient cash', 400);
    }

    const remainingCash = await updateUserCash(Id, -totalCost);
    const athletes = await drawAthletes(gatcha);
    await addAthletesToUser(Id, athletes);

    return { cash: remainingCash, athletes };
  });
};
