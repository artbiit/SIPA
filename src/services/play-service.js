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

  for (let i = 0; i < 11; i++) {
    const userMidfielder = userAthletes.find((a) => a.Athlete.athleteType === 'MIDDLE');
    const opponentMidfielder = opponentAthletes.find((a) => a.Athlete.athleteType === 'MIDDLE');

    const userMidfieldControl =
      (userMidfielder.Athlete.scoringAbility + userMidfielder.Athlete.power) *
        positionWeights.MIDDLE.scoringAbility +
      userMidfielder.enhance;
    const opponentMidfieldControl =
      (opponentMidfielder.Athlete.scoringAbility + opponentMidfielder.Athlete.power) *
        positionWeights.MIDDLE.scoringAbility +
      opponentMidfielder.enhance;

    const midfieldResult =
      Math.random() * userMidfieldControl - Math.random() * opponentMidfieldControl;

    let isUserAttacking = midfieldResult > 0;

    if (isUserAttacking) {
      const userAttacker = userAthletes.find((a) => a.Athlete.athleteType === 'ATTACKER');
      const opponentDefender = opponentAthletes.find((a) => a.Athlete.athleteType === 'DEFENDER');

      const userAttackPower =
        userAttacker.Athlete.scoringAbility * positionWeights.ATTACKER.scoringAbility +
        userAttacker.enhance;
      const opponentDefencePower =
        opponentDefender.Athlete.defence * positionWeights.DEFENDER.defence +
        opponentDefender.enhance;

      const attackResult = Math.random() * (userAttackPower - opponentDefencePower);
      if (attackResult > 0) {
        userScore++;
      }
    } else {
      const opponentAttacker = opponentAthletes.find((a) => a.Athlete.athleteType === 'ATTACKER');
      const userDefender = userAthletes.find((a) => a.Athlete.athleteType === 'DEFENDER');

      const opponentAttackPower =
        opponentAttacker.Athlete.scoringAbility * positionWeights.ATTACKER.scoringAbility +
        opponentAttacker.enhance;
      const userDefencePower =
        userDefender.Athlete.defence * positionWeights.DEFENDER.defence + userDefender.enhance;

      const attackResult = Math.random() * (opponentAttackPower - userDefencePower);
      if (attackResult > 0) {
        opponentScore++;
      }
    }
  }

  let userMMRChange = 20;

  if (userScore === opponentScore) {
    userMMRChange = 0;
  } else if (userScore < opponentScore) {
    userMMRChange = -10;
  }

  await updateMMR(userId, userMMRChange);

  const updatedUserMMR = userMMR.score + userMMRChange;

  return {
    opponent: opponentId,
    winner: userScore > opponentScore ? userId : opponentId,
    userScore,
    opponentScore,
    userMMRChange,
    userMMR: updatedUserMMR,
    opponentMMR: opponentMMR.score,
  };
};
