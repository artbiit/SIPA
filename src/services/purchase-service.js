import { getUserCash, setUserCash } from '../repositories/purchase-repository.js';

export const purchaseCash = async ({ userId = null, cash }) => {
  const result = {};

  const userCash = await getUserCash(userId);
  await setUserCash(userId, userCash.cash + cash);

  result.totalCash = userCash.cash + cash;

  return result;
};

export const gacha = async ({ userId = null }) => {
  const result = {};

  // WARN: 임시로 정해둔 상수
  const GACHA_PRICE = 100;

  const userCash = await getUserCash(userId);
  if (userCash - GACHA_PRICE < 0) {
    // TODO: 돈 부족 로직
  }

  // TODO: 팩 몇 개 깔건지 로직 구현
  const amount = 1; // WARN: 임시로 상수 넣어뒀음
  const FINAL_PRICE = GACHA_PRICE * amount;

  await setUserCash(userId, userCash.cash - FINAL_PRICE);

  // TODO: 뽑은 선수의 능력치 및 등급 적용 로직 추가
  const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const athleteIds = [];
  for (let i = 0; i < amount; i++) {
    // TODO: max값을 Athlete 테이블의 갯수로 정하기
    athleteIds.push(rand(0, 40));
  }
};
