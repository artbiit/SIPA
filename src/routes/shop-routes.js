import { purchaseCash, gachaAthletes } from '../services/shop-service.js';

const routes = [
  {
    method: 'post',
    url: '/shop/purchase',
    action: purchaseCash,
    authRequired: true,
  },
  {
    method: 'post',
    url: '/shop/gacha',
    action: gachaAthletes,
    authRequired: true,
  },
];

export default routes;
