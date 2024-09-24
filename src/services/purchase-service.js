import ApiError from '../errors/api-error.js';
import {
  getUserCash,
  setUserCash,
  getAthletes,
  addUsersAthlete,
} from '../repositories/purchase-repository.js';

export const purchaseCash = async ({ Id = null, cash }) => {
  const result = {};

  const userCash = await getUserCash(Id);
  await setUserCash(Id, userCash.cash + cash);

  result.totalCash = userCash.cash + cash;

  return result;
};

// amount는 정수임
export const gacha = async ({ Id = null, amount }) => {
  const result = {};

  // WARN: 임시로 정해둔 상수
  const GACHA_PRICE = 1000;

  const userCash = await getUserCash((Id = null));
  if (userCash.cash - GACHA_PRICE < 0) {
    throw new ApiError('Not enough cash', 403);
  }

  const FINAL_PRICE = GACHA_PRICE * amount;

  await setUserCash((Id = null), userCash.cash - FINAL_PRICE);

  const athletes = await getAthletes();
  const totalWeight = athletes.reduce((total, athlete) => total + athlete.spawnRate, 0);
  const randomGeneratedAthletes = [];
  const weightRandomId = (rand) => {
    for (let i = 0; i < athletes.length; i++) {
      if (athletes[i].spawnRate >= rand) {
        return athletes[i].id;
      }
      rand -= athletes[i].spawnRate;
    }
  };

  for (let i = 0; i < amount; i++) {
    const rand = Math.random() * totalWeight + 1;
    // UsersAthlete: id, userId, athleteId, enhance, createdAt
    randomGeneratedAthletes.push({
      userId: (Id = null),
      athleteId: weightRandomId(rand),
      enhance: 0,
    });
  }

  await addUsersAthlete(randomGeneratedAthletes);

  result.data = randomGeneratedAthletes;
  return result;
};
