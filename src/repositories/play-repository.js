import prisma from '../lib/prisma.js';

export const getMyTeam = async (userId) => {
  try {
    const myTeam = await prisma.MyTeam.findMany({
      where: {
        userId: userId,
      },
      include: {
        Users: true, // 유저 정보 포함
        attackerAthlete: true, // 공격수 정보 포함
        defenderAthlete: true, // 수비수 정보 포함
        middleAthlete: true, // 미드필더 정보 포함
      },
    });
    return myTeam;
  } catch (error) {
    console.error('팀을 발견하지 못했습니다.', error);
    throw new Error('팀 조회 실패');
  }
};

export const getEnemyTeam = async (userName) => {
  try {
    // 1. userName으로 Users 테이블에서 userId 조회
    const user = await prisma.users.findUnique({
      where: {
        userName: userName,
      },
      select: {
        id: true, // userId (id)만 선택
      },
    });

    if (!user) {
      console.error('해당 유저를 발견하지 못했습니다.', error);
      throw new Error('User not found');
    }

    const userId = user.id;

    const userTeam = getMyTeam(userId);

    return userTeam;
  } catch (error) {
    console.error('팀을 발견하지 못했습니다.', error);
    throw new Error('팀 조회 실패');
  }
};
