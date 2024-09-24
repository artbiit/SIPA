import { Friendly_Match } from '../services/play-service.js';

const routes = [
  {
    method: 'get',
    url: '/play/friendly-match',
    action: Friendly_Match,
  },
];

export default routes;
