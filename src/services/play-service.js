import { prisma } from '../lib/prisma.js';
import { findOpponentByMMR } from '../repositories/mmr-repository.js';
import { getUserAthletes } from '../repositories/athlete-repository.js';

export const playRandomMatch = async ({ Id = null }) => {
  return await prisma.$transaction(async (prisma) => {
    const opponent = await findOpponentByMMR(Id);

    if (!opponent || !opponent.hasFullTeam) {
      throw new ApiError('No suitable opponent found', 404);
    }

    return await calculateMatchResult(Id, opponent.id);
  });
};

export const playFriendlyMatch = async ({ Id = null, opponentId }) => {
  return await prisma.$transaction(async (prisma) => {
    // 상대 유저의 선수가 모두 등록되어 있는지 확인
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

  // 능력치와 강화 수치에 기반한 경기 결과 시뮬레이션
  let userScore = 0;
  let opponentScore = 0;

  userAthletes.forEach((athlete, index) => {
    const opponentAthlete = opponentAthletes[index];
    const userPower = athlete.Athlete.power + athlete.enhance;
    const opponentPower = opponentAthlete.Athlete.power + opponentAthlete.enhance;

    // 임의의 확률 기반 점수 산정
    const randomFactor = Math.random();
    if (userPower * randomFactor > opponentPower * randomFactor) {
      userScore++;
    } else {
      opponentScore++;
    }
  });

  // MMR 점수 변경 계산
  const userMMRChange = userScore > opponentScore ? 20 : -10;
  //const opponentMMRChange = userScore > opponentScore ? -10 : 20;

  await updateMMR(userId, userMMRChange);
  return {
    winner: userScore > opponentScore ? userId : opponentId,
    userScore,
    opponentScore,
    userMMRChange,
    matchDetails: { userScore, opponentScore },
  };
};
