import Utils from '../lib/utils.js';
import { authenticateToken } from '../middleware/auth-middleware.js';
import { tokenVerify } from '../middleware/token-middleware.js';
import teamRoute from './team-organize-routes.js';
import gameRoutes from './game-route.js';
import userRoutes from './users-route.js';
import purchaseRoute from './purchase-route.js';

const allRoutes = [
  ...gameRoutes,
  ...userRoutes,
  ...purchaseRoute,
  // 다른 라우트 추가 가능
  ...teamRoute,
];

// 파라미터 및 미들웨어 자동 설정
allRoutes.forEach((route) => {
  route.requiredParams = Utils.getFunctionParams(route.action);

  route.middleware = [tokenVerify];

  if (route.authRequired) {
    route.middleware.push(authenticateToken);
  }
});

export default allRoutes;
