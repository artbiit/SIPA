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
      userId: faker.string.alpha({ length: 15 }),
      password: faker.string.alphanumeric({ length: 15 }),
      userName: faker.string.alpha({ length: 16 }),
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

  const usersAthletes = selectedAthletes.map((athlete) => ({
    userId: newUser.id,
    athleteId: athlete.id,
    enhance: faker.number.int({ min: 1, max: 3 }),
  }));

  await prisma.usersAthlete.createMany({
    data: usersAthletes,
  });

  await prisma.myTeam.create({
    data: {
      userId: newUser.id,
      attacker: attacker.id,
      defender: defender.id,
      middle: middle.id,
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
