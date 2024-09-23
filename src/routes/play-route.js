import { playRandomMatch, playFriendlyMatch } from '../services/play-service.js';

const routes = [
  {
    method: 'post',
    url: '/play/random-match',
    action: playRandomMatch,
    authRequired: true,
  },
  {
    method: 'post',
    url: '/play/friendly-match',
    action: playFriendlyMatch,
    authRequired: true,
  },
];

export default routes;
