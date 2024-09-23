import { prisma } from '../lib/prisma.js';
import { findOpponentByMMR, updateMMR } from '../repositories/mmr-repository.js';
import { getUserAthletes } from '../repositories/athlete-repository.js';
import ApiError from '../errors/api-error.js';

export const playRandomMatch = async ({ Id = null }) => {
  return await prisma.$transaction(async (prisma) => {
    const opponent = await findOpponentByMMR(Id);

    if (!opponent) {
      throw new ApiError('No suitable opponent found', 404);
    }

    return await calculateMatchResult(Id, opponent.id);
  });
};

export const playFriendlyMatch = async ({ Id = null, opponentId }) => {
  return await prisma.$transaction(async (prisma) => {
    const opponentAthletes = await getUserAthletes(opponentId);
    if (!opponentAthletes || opponentAthletes.length !== 3) {
      throw new ApiError('Opponent has not registered a full team of athletes', 400);
    }
    return await calculateMatchResult(Id, opponentId);
  });
};

const calculateMatchResult = async (userId, opponentId) => {
  const userAthletes = await getUserAthletes(userId);
  const opponentAthletes = await getUserAthletes(opponentId);

  const userMMR = await prisma.MMR.findUnique({ where: { userId } });
  const opponentMMR = await prisma.MMR.findUnique({ where: { userId: opponentId } });

  const positionWeights = {
    ATTACKER: { scoringAbility: 1.5, power: 1.2, defence: 0.8 },
    DEFENDER: { scoringAbility: 0.8, power: 1.1, defence: 1.5 },
    MIDDLE: { scoringAbility: 1.0, power: 1.3, defence: 1.0 },
  };

  let userScore = 0;
  let opponentScore = 0;

  ['ATTACKER', 'DEFENDER', 'MIDDLE'].forEach((position) => {
    const userAthlete = userAthletes.find((a) => a.Athlete.athleteType === position);
    const opponentAthlete = opponentAthletes.find((a) => a.Athlete.athleteType === position);

    if (!userAthlete || !opponentAthlete) {
      if (!userAthlete && opponentAthlete) opponentScore++;
      if (!opponentAthlete && userAthlete) userScore++;
      return;
    }

    const userStats = userAthlete.Athlete;
    const opponentStats = opponentAthlete.Athlete;

    const userPower =
      userStats.scoringAbility * positionWeights[position].scoringAbility +
      userStats.power * positionWeights[position].power +
      userStats.defence * positionWeights[position].defence +
      userAthlete.enhance;

    const opponentPower =
      opponentStats.scoringAbility * positionWeights[position].scoringAbility +
      opponentStats.power * positionWeights[position].power +
      opponentStats.defence * positionWeights[position].defence +
      opponentAthlete.enhance;

    if (userPower * Math.random() > opponentPower * Math.random()) {
      userScore++;
    } else {
      opponentScore++;
    }
  });

  const userMMRChange = userScore > opponentScore ? 20 : -10;

  await updateMMR(userId, userMMRChange);

  const updatedUserMMR = userMMR.score + userMMRChange;

  return {
    winner: userScore > opponentScore ? userId : opponentId,
    userScore,
    opponentScore,
    userMMRChange,
    userMMR: updatedUserMMR,
    opponentMMR: opponentMMR.score,
    matchDetails: { userScore, opponentScore },
  };
};
