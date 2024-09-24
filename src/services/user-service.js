import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../errors/api-error.js';
import env from '../lib/env.js';
import Utils from '../lib/utils.js';

import {
  createUser,
  updateUserCash,
  getAthletesByUserId,
  findUserByUserId,
} from '../repositories/user-repository.js';
import {
  checkAthleteOwnership,
  updateTeam,
  getAthletesByIds,
  deleteAthletesByIds,
  createEnhancedAthlete,
  getAthleteById,
  deleteAthleteById,
  checkIfAthletesInTeam,
} from '../repositories/athlete-repository.js';
import logger from '../lib/logger.js';
import { prisma } from '../lib/prisma.js';

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_ALGORITHM, JWT_ISSUER, JWT_AUDIENCE } = env;

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: "User Signup"
 *     description: "Register a new user"
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - password
 *               - userName
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       201:
 *         description: "User created successfully"
 *       400:
 *         description: "Invalid input"
 */
export const registerUser = async ({ userId, password, userName }) => {
  if (!Utils.testUsername(userId)) {
    throw new ApiError(
      'The username must contain at least 5 characters, using only letters and numbers',
      400,
    );
  }

  if (!Utils.testPassword(password)) {
    throw new ApiError(
      'The password must be at least 6 characters long and include letters, numbers, and special characters.',
      400,
    );
  }

  if (!Utils.testNickname(userName)) {
    throw new ApiError(
      'The nickname can contain up to 16 Korean characters, or a mix of letters and numbers up to 32 characters, with no special characters allowed.',
      400,
    );
  }

  try {
    const user = await createUser(userId, password, userName);
    logger.info(`User registered: ${userId}`);
    return { userId: user.id, nickname: user.nickname };
  } catch (error) {
    logger.error(`Error registering user: ${userId}, ${error.message}`);
    throw new ApiError('Error registering user', 500);
  }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: "User Login"
 *     description: "Authenticate a user and return a token"
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "User logged in"
 *       401:
 *         description: "Unauthorized"
 */
export const loginUser = async ({ userId, password }) => {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new ApiError('Invalid username or password', 401);
  }

  if (!(user.password === password)) {
    throw new ApiError('Invalid username or password', 401);
  }

  const token = jwt.sign({ userId, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });

  return { token };
};

/**
 * @swagger
 * /users/team:
 *   patch:
 *     summary: "Update User Team"
 *     description: "Update the user's team by selecting athletes"
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attacker
 *               - defender
 *               - middle
 *             properties:
 *               attacker:
 *                 type: integer
 *               defender:
 *                 type: integer
 *               middle:
 *                 type: integer
 *     responses:
 *       200:
 *         description: "Team updated successfully"
 *       400:
 *         description: "Invalid request"
 */
export const updateUserTeam = async ({ Id = null, attacker, defender, middle }) => {
  const [isAttackerOwned, isDefenderOwned, isMiddleOwned] = await Promise.all([
    checkAthleteOwnership(Id, attacker),
    checkAthleteOwnership(Id, defender),
    checkAthleteOwnership(Id, middle),
  ]);

  if (!isAttackerOwned || !isDefenderOwned || !isMiddleOwned) {
    throw new Error('One or more athletes do not belong to the user.');
  }

  return await updateTeam(Id, attacker, defender, middle);
};

/**
 * @swagger
 * /users/athletes/training:
 *   post:
 *     summary: "Enhance Athletes"
 *     description: "Enhance a user's athletes by combining three identical ones"
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - athleteIds
 *             properties:
 *               athleteIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: "Athletes enhanced successfully"
 *       400:
 *         description: "Invalid athlete data"
 */
export const enhanceAthletes = async ({ Id = null, athleteIds }) => {
  return await prisma.$transaction(async (prisma) => {
    const athletes = await getAthletesByIds(Id, athleteIds);

    if (athletes.length !== 3) {
      throw new ApiError('All athletes must belong to the user.', 400);
    }

    const firstAthlete = athletes[0];

    const isSameAthlete = athletes.every((athlete) => athlete.athleteId === firstAthlete.athleteId);
    const isSameEnhance = athletes.every((athlete) => athlete.enhance === firstAthlete.enhance);

    if (!isSameAthlete || !isSameEnhance) {
      throw new ApiError('All athletes must have the same Athlete ID and enhancement level.', 400);
    }

    const isInTeam = await checkIfAthletesInTeam(Id, athleteIds);
    if (isInTeam) {
      throw new ApiError(
        'One or more athletes are assigned to a team and cannot be enhanced.',
        400,
      );
    }

    await deleteAthletesByIds(Id, athleteIds, prisma);

    const enhancedAthlete = await createEnhancedAthlete(
      Id,
      {
        athleteId: firstAthlete.athleteId,
        enhance: firstAthlete.enhance + 1,
      },
      prisma,
    );

    return enhancedAthlete;
  });
};

/**
 * @swagger
 * /users/athletes/sell:
 *   post:
 *     summary: "Sell Athlete"
 *     description: "Sell a user's athlete and receive cash based on enhancement level"
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - athleteId
 *             properties:
 *               athleteId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: "Athlete sold successfully"
 *       404:
 *         description: "Athlete not found"
 */
export const sellAthlete = async ({ Id = null, athleteId }) => {
  return await prisma.$transaction(async (prisma) => {
    const athlete = await getAthleteById(Id, athleteId);

    if (!athlete) {
      throw new ApiError('Athlete not found or does not belong to the user.', 404);
    }

    const cashEarned = athlete.enhance ** athlete.enhance * 1000;

    await updateUserCash(Id, cashEarned, prisma);

    await deleteAthleteById(athleteId, prisma);

    return { message: 'Athlete sold successfully', cashEarned };
  });
};

/**
 * @swagger
 * /users/athletes:
 *   get:
 *     summary: "Get User's Athletes"
 *     description: "Retrieve all athletes owned by the authenticated user"
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: "List of user's athletes"
 *       401:
 *         description: "Unauthorized"
 */
export const getUserAthletes = async ({ Id = null }) => {
  const athletes = await getAthletesByUserId(Id);
  return { athletes: athletes };
};

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: "Get Specific User"
 *     description: "Retrieve details of a specific user"
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID of the user to retrieve"
 *     responses:
 *       200:
 *         description: "User details"
 *       404:
 *         description: "User not found"
 */
export const getSpecificUser = async ({ Id = null, userId }) => {
  if (!userId) {
    throw new ApiError('userId cannot be null', 404);
  }

  const user = await findUserByUserId(userId, true);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  let result = {
    userId: user.userId,
    name: user.userName,
    score: user.MMR?.score ?? 0,
  };

  if (Id !== null) {
    result.cash = user.cash;
  }

  return result;
};
