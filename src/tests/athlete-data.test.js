import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma.js';

// 임의의 선수 데이터를 생성하는 함수
async function createDummyAthletes() {
  const athleteTypes = ['ATTACKER', 'DEFENDER', 'MIDDLE'];
  const numAthletes = 100; // 생성할 선수 수

  const athletes = [];

  for (let i = 0; i < numAthletes; i++) {
    athletes.push({
      athleteName: faker.person.firstName().slice(0, 10),
      speed: faker.number.int({ min: 60, max: 100 }),
      scoringAbility: faker.number.int({ min: 50, max: 100 }),
      power: faker.number.int({ min: 50, max: 100 }),
      defence: faker.number.int({ min: 50, max: 100 }),
      stamina: faker.number.int({ min: 50, max: 100 }),
      athleteType: faker.helpers.arrayElement(athleteTypes),
      spawnRate: faker.number.int({ min: 1, max: 100 }),
    });
  }

  await prisma.athlete.createMany({
    data: athletes,
  });

  console.log(`${numAthletes} dummy athletes created!`);
}

createDummyAthletes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
