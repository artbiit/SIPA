import { getMyTeam, getEnemyTeam } from '../repositories/play-repository';
import ApiError from '../errors/api-error';

// 각 포지션별 가중치 설정
const WEIGHTS_ATTACKER = {
  speed: 0.2,
  goal: 0.4,
  shotPower: 0.25,
  defense: 0.05,
  stamina: 0.1,
};

const WEIGHTS_MIDFIELDER = {
  speed: 0.25,
  goal: 0.25,
  shotPower: 0.25,
  defense: 0.25,
  stamina: 0.25,
};

const WEIGHTS_DEFENDER = {
  speed: 0.1,
  goal: 0.05,
  shotPower: 0.1,
  defense: 0.5,
  stamina: 0.2,
};

// 각 선수의 점수를 계산하는 함수 (포지션별 가중치를 사용)
const calculatePlayerScore = (player, weights) => {
  return (
    player.speed * weights.speed +
    player.goal * weights.goal +
    player.shotPower * weights.shotPower +
    player.defense * weights.defense +
    player.stamina * weights.stamina
  );
};

// 팀의 점수를 계산하는 함수 (포지션별 가중치 적용)
const calculateTeamScore = (team) => {
  const attackerScore = calculatePlayerScore(team.attacker, WEIGHTS_ATTACKER);
  const middleScore = calculatePlayerScore(team.middle, WEIGHTS_MIDFIELDER);
  const defenderScore = calculatePlayerScore(team.defender, WEIGHTS_DEFENDER);

  return attackerScore + middleScore + defenderScore;
};

// 두 팀 간의 경기 결과를 계산하는 함수
const playGame = (teamA, teamB) => {
  // 각 팀의 점수 계산
  const teamAScore = calculateTeamScore(teamA);
  const teamBScore = calculateTeamScore(teamB);

  console.log(`MyTeam Rate: ${teamAScore}`);
  console.log(`EnemyTeam Rate: ${teamBScore}`);

  // 랜덤성을 추가해 결과의 다양성을 부여
  const randomValue = Math.random() * (teamAScore + teamBScore);

  if (randomValue < teamAScore) {
    // 팀 A 승리
    const aScore = Math.floor(Math.random() * 4) + 2; // 2 ~ 5 사이 점수
    const bScore = Math.floor(Math.random() * Math.min(3, aScore)); // 팀 B는 A보다 작은 점수
    return `승리 나 ${aScore} : 상대 ${bScore}`;
  } else {
    // 팀 B 승리
    const bScore = Math.floor(Math.random() * 4) + 2; // 2 ~ 5 사이 점수
    const aScore = Math.floor(Math.random() * Math.min(3, bScore)); // 팀 A는 B보다 작은 점수
    return `패배 나 ${aScore} : 상대 ${bScore}`;
  }
};

export const Friendly_Match = async ({ userId = null, enemyUserName }) => {
  let result = {};

  if (!enemyUserName) {
    throw new ApiError('해당 사용자를 찾지 못했습니다.', 404);
  }

  // 내 팀정보 가져오기
  let myTeam = getMyTeam(userId);
  // 상대팀 정보 가져오기
  let enemyTeam = getEnemyTeam(enemyUserName);
  // 매칭결과(내팀, 상대팀)
  return { message: playGame(myTeam, enemyTeam) };
};
