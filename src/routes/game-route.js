import { TopMMR } from '../services/game-service';

const routes = [
  {
    method: 'get',
    url: '/game/ranking',
    action: TopMMR,
    authRequired: true,
  },
];

export default routes;
