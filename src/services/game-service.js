import { getTop100MMR, getMMRByUserId } from '../repositories/game-repository.js';
import { getPaginatedAthletes } from '../repositories/athlete-repository.js';

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

export const getAthletes = async ({ page = 0, pageCount = 10 }) => {
  if (page < 0 || pageCount <= 0) {
    throw new ApiError('Invalid pagination parameters', 400);
  }

  const { athletes, totalCount } = await getPaginatedAthletes(page, pageCount);

  return {
    totalCount,
    athleteInfos: athletes,
  };
};
