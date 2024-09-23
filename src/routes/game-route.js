import { TopMMR } from '../services/game-service.js';

const routes = [
  {
    method: 'get',
    url: '/game/ranking',
    action: TopMMR,
  },
];

export default routes;
