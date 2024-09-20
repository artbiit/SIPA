import { getMyTeam, getEnemyTeam, playGame } from '../repositories/play-repository';
import ApiError from '../errors/api-error';

export const Friendly_Match = async ({ userId = null, enemyUserName }) => {
  let result = {};

  if(!enemyUserName){
    throw new ApiError("해당 사용자를 찾지 못했습니다.", 404);
  }

  // 내 팀정보 가져오기
  let myTeam = getMyTeam(userId);
  // 상대팀 정보 가져오기
  let enemyTeam = getEnemyTeam(enemyUserName);
  // 매칭결과(내팀, 상대팀)
  playGame(myTeam, enemyTeam);

  return result;
};
