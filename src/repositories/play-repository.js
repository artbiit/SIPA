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
        middleAthlete: true,  // 미드필더 정보 포함
      },
    });
    return myTeam;
  } catch (error) {
    console.error('팀을 발견하지 못했습니다.', error);
    throw new Error('팀 조회 실패');
  }
};


export const getEnemyTeam = async (enemyUserName) => {
    try {
      const myTeam = await prisma.MyTeam.findMany({
        where: {
          userId: userId,
        },
        include: {
          Users: true, // 유저 정보 포함
          attackerAthlete: true, // 공격수 정보 포함
          defenderAthlete: true, // 수비수 정보 포함
          middleAthlete: true,  // 미드필더 정보 포함
        },
      });
      return myTeam;
    } catch (error) {
      console.error('팀을 발견하지 못했습니다.', error);
      throw new Error('팀 조회 실패');
    }
  };


export const playGame = async (myTeam, enemyTeam) => {
    try {
      const topUsers = await prisma.MMR.findMany({
        orderBy: {
          score: 'desc',
        },
        take: 100,
        include: {
          Users: {
            select: {
              userName: true,
            },
          },
        },
      });
      return topUsers;
    } catch (error) {
      console.error('Error fetching top 100 MMR:', error);
      throw new Error('Could not fetch top 100 MMR users');
    }
  };