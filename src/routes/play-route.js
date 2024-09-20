import { Friendly_Match } from '../services/play-service';

const routes = [
  {
    method: 'get',
    url: '/play/friendly-match',
    action: Friendly_Match,
  },
];

export default routes;
