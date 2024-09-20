import { purchaseCash, gacha } from '../services/purchase-service';
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
    action: gacha,
    authRequired: true,
  },
];

export default routes;
