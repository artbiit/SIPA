import { TopMMR, getAthletes } from '../services/game-service.js';

const routes = [
  {
    method: 'get',
    url: '/game/ranking',
    action: TopMMR,
  },
  {
    method: 'get',
    url: '/game/athletes',
    action: getAthletes,
  },
];

export default routes;
