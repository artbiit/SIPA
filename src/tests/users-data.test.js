import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma.js';

const athleteIds = await prisma.athlete.findMany({
  select: { id: true, athleteType: true },
});

const attackers = athleteIds.filter((a) => a.athleteType === 'ATTACKER');
const defenders = athleteIds.filter((a) => a.athleteType === 'DEFENDER');
const middles = athleteIds.filter((a) => a.athleteType === 'MIDDLE');

async function createDummyUser() {
  const newUser = await prisma.users.create({
    data: {
      userId: faker.string.alphanumeric({ length: 15 }),
      password: faker.internet.password(15),
      userName: faker.person.firstName(),
      cash: faker.number.int({ min: 1000, max: 30000 }),
    },
  });

  const selectedAthletes = [];

  const attacker = faker.helpers.arrayElement(attackers);
  selectedAthletes.push(attacker);

  const defender = faker.helpers.arrayElement(defenders);
  selectedAthletes.push(defender);

  const middle = faker.helpers.arrayElement(middles);
  selectedAthletes.push(middle);

  const remainingAthletesCount = faker.number.int({ min: 0, max: 3 });
  for (let i = 0; i < remainingAthletesCount; i++) {
    const athlete = faker.helpers.arrayElement(athleteIds);
    selectedAthletes.push(athlete);
  }

  // 먼저 UsersAthlete에 데이터를 추가하고 그 id를 가져옴
  const usersAthletes = await prisma.usersAthlete.createMany({
    data: selectedAthletes.map((athlete) => ({
      userId: newUser.id,
      athleteId: athlete.id,
      enhance: faker.number.int({ min: 1, max: 3 }),
    })),
    skipDuplicates: true,
  });

  // 각 UsersAthlete의 id를 가져와서 팀을 구성
  const userAthletes = await prisma.usersAthlete.findMany({
    where: { userId: newUser.id },
  });

  const attackerUserAthlete = userAthletes.find((ua) => ua.athleteId === attacker.id);
  const defenderUserAthlete = userAthletes.find((ua) => ua.athleteId === defender.id);
  const middleUserAthlete = userAthletes.find((ua) => ua.athleteId === middle.id);

  await prisma.myTeam.create({
    data: {
      userId: newUser.id,
      attacker: attackerUserAthlete.id, // UsersAthlete.id 사용
      defender: defenderUserAthlete.id, // UsersAthlete.id 사용
      middle: middleUserAthlete.id, // UsersAthlete.id 사용
    },
  });

  await prisma.MMR.create({
    data: {
      userId: newUser.id,
      score: faker.number.int({ min: 0, max: 3000 }),
    },
  });

  console.log(`Dummy user created with ID: ${newUser.id}`);
}

try {
  for (let i = 0; i < 100; i++) {
    await createDummyUser();
  }
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
