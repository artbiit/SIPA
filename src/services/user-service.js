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

  // const pepperedPassword = Utils.getPepperedPassword(password);
  // const hashedPassword = await bcrypt.hash(pepperedPassword, 10);

  try {
    const user = await createUser(userId, password, userName);
    logger.info(`User registered: ${userId}`);
    return { userId: user.id, nickname: user.nickname };
  } catch (error) {
    logger.error(`Error registering user: ${userId}, ${error.message}`);
    throw new ApiError('Error registering user', 500);
  }
};

export const loginUser = async ({ userId, password }) => {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new ApiError('Invalid username or password', 401);
  }

  //const pepperedPassword = Utils.getPepperedPassword(password);
  //const validPassword = await bcrypt.compare(pepperedPassword, user.password);
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

export const getUserAthletes = async ({ Id = null }) => {
  const athletes = await getAthletesByUserId(Id);

  return { athletes: athletes };
};

export const getSpecificUser = async ({ Id = null, userId }) => {
  if (!userId) {
    z;
    throw new ApiError('userId can not null', 404);
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
