import { TopMMR } from '../services/game-service';

const routes = [
  {
    method: 'get',
    url: '/game/ranking',
    action: TopMMR,
  },
];

export default routes;
