import { getTop100MMR, getMMRByUserId } from '../repositories/game-repository';

export const TopMMR = async ({ userId = null }) => {
  let result = {};

  const promises = [getTop100MMR()];
  if (userId) {
    promises.push(getMMRByUserId(userId));
  }

  const [topMMR, userRank] = await Promise.all(promises);

  result.ranks = topMMR;
  if (userId) {
    result.userRank = userRank;
  }

  return result;
};
