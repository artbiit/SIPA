import { prisma } from '../lib/prisma.js';

export const getMyTeam = async (userId) => {
  try {
    const myTeam = await prisma.MyTeam.findMany({
      where: {
        userId: userId,
      },
      include: {
        Users: true, // 유저 정보 포함
        UsersAthlete_MyTeam_attackerToUsersAthlete: true, // 공격수 포함
        UsersAthlete_MyTeam_defenderToUsersAthlete: true, // 수비수 포함
        UsersAthlete_MyTeam_middleToUsersAthlete: true, // 미드필더 포함
      },
    });

    if (myTeam.length === 0) {
      throw new Error('팀을 발견하지 못했습니다.');
    }

    const team = {
      attacker: await getAthleteById(myTeam[0].UsersAthlete_MyTeam_attackerToUsersAthlete.athleteId),
      defender: await getAthleteById(myTeam[0].UsersAthlete_MyTeam_defenderToUsersAthlete.athleteId),
      middle: await getAthleteById(myTeam[0].UsersAthlete_MyTeam_middleToUsersAthlete.athleteId),
    };
    console.log(team);
    return team;
  } catch (error) {
    console.error('팀을 발견하지 못했습니다.', error);
    throw new Error('팀 조회 실패');
  }
};

export const getEnemyTeam = async (userName) => {
  try {
    // 1. userName으로 Users 테이블에서 userId 조회
    const user = await prisma.users.findFirst({
      where: {
        userName: userName,
      },
      select: {
        id: true, // userId (id)만 선택
      },
    });

    if (!user) {
      console.error('해당 유저를 발견하지 못했습니다.');
      throw new Error('User not found');
    }

    const userId = user.id;

    // 2. getMyTeam 호출 시 await 추가
    const userTeam = await getMyTeam(userId);

    return userTeam;
  } catch (error) {
    console.error('적팀을 발견하지 못했습니다.', error);
    throw new Error('적팀 조회 실패');
  }
};


const getAthleteById = async (athleteId) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: {
        id: athleteId, // athleteId로 Athlete 찾기
      },
      select: {
        id: true,
        athleteName: true,
        speed: true,
        scoringAbility: true,
        power: true,
        defence: true,
        stamina: true,
      },
    });

    if (!athlete) {
      throw new Error('Athlete not found');
    }

    return athlete;
  } catch (error) {
    console.error('Error retrieving athlete:', error);
    throw new Error('Failed to retrieve athlete');
  }
};