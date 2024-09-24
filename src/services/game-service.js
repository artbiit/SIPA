import { getTop100MMR, getMMRByUserId } from '../repositories/game-repository.js';
import { getPaginatedAthletes } from '../repositories/athlete-repository.js';

/**
 * @swagger
 * /game/ranking:
 *   get:
 *     summary: "Get Top 100 MMR Rankings"
 *     description: "Retrieve the top 100 users based on MMR ranking"
 *     tags:
 *       - Game
 *     responses:
 *       200:
 *         description: "Top 100 MMR rankings returned"
 *       401:
 *         description: "Unauthorized"
 */
export const TopMMR = async ({ Id = null }) => {
  let result = {};

  const promises = [getTop100MMR()];
  if (Id) {
    promises.push(getMMRByUserId(Id));
  }

  const [topMMR, userRank] = await Promise.all(promises);

  result.ranks = topMMR;
  if (userRank) {
    result.userRank = userRank;
  }

  return result;
};

/**
 * @swagger
 * /game/athletes:
 *   get:
 *     summary: "Get Paginated List of Athletes"
 *     description: "Retrieve a paginated list of athletes"
 *     tags:
 *       - Game
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: "Page number"
 *       - in: query
 *         name: pageCount
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Number of athletes per page"
 *     responses:
 *       200:
 *         description: "List of athletes returned"
 *       400:
 *         description: "Invalid pagination parameters"
 */
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
