import prisma from '../lib/prisma.js';

export const teamSetting = async (userId, attacker, defender, middle) => {
  try {
    //user가 존재하는지 확인
    const userExists = await prisma.Users.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new Error('User found error!');
    }

    //user가 보유한 attacker인지 확인
    const attackerExists = await prisma.UsersAthlete.findFirst({
      where: {
        userId: userId,
        id: attacker,
      },
    });
    if (!attackerExists) {
      throw new Error('This is not a attacker of this user!');
    }

    //user가 보유한 defender 확인
    const defenderExists = await prisma.UsersAthlete.findFirst({
      where: {
        userId: userId,
        id: defender,
      },
    });
    if (!defenderExists) {
      throw new Error('This is not a defender of this user!');
    }

    //user가 보유한 middle 확인
    const middleExists = await prisma.UsersAthlete.findFirst({
      where: {
        userId: userId,
        id: middle,
      },
    });
    if (!middleExists) {
      throw new Error('This is not a middle of this user!');
    }

    //attacker가 맞는지 확인
    const attackerCheck = await prisma.UsersAthlete.findUnique({
      where: {
        id: attacker,
      },
      select: {
        Athlete: {
          select: {
            athleteType: true,
          },
        },
      },
    });
    if (!attackerCheck || attackerCheck.Athlete.athleteType !== 'ATTACKER') {
      throw new Error('This athlete is not attacker!');
    }

    //defender 맞는지 확인
    const defenderCheck = await prisma.UsersAthlete.findUnique({
      where: {
        id: defender,
      },
      select: {
        Athlete: {
          select: {
            athleteType: true,
          },
        },
      },
    });
    if (!defenderCheck || defenderCheck.Athlete.athleteType !== 'DEFENDER') {
      throw new Error('This athlete is not defender!');
    }

    //middle이 맞는지 확인
    const middleCheck = await prisma.UsersAthlete.findUnique({
      where: {
        id: middle,
      },
      select: {
        Athlete: {
          select: {
            athleteType: true,
          },
        },
      },
    });
    if (!middleCheck || middleCheck.Athlete.athleteType !== 'MIDDLE') {
      throw new Error('This athlete is not middle!');
    }

    //attacker의 중복여부를 확인
    const attackerDuplication = await prisma.MyTeam.findFirst({
      where: {
        attacker: attacker,
      },
    });
    if (attackerDuplication) {
      throw new Error('Attacker is duplication!');
    }

    //defender의 중복여부를 확인
    const defenderDuplication = await prisma.MyTeam.findFirst({
      where: {
        defender: defender,
      },
    });
    if (defenderDuplication) {
      throw new Error('defender is duplication!');
    }

    //middle의 중복여부를 확인
    const middleDuplication = await prisma.MyTeam.findFirst({
      where: {
        middle: middle,
      },
    });
    if (middleDuplication) {
      throw new Error('middle is duplication!');
    }
    //update+insert
    await prisma.MyTeam.upsert({
      where: {
        userId: userId,
      },
      update: {
        attacker: attacker,
        defender: defender,
        middle: middle,
      },
      create: {
        userId: userId,
        attacker: attacker,
        defender: defender,
        middle: middle,
      },
    });
  } catch (error) {
    console.log('detail', error);
    throw new Error('Team setting error');
  }
};
