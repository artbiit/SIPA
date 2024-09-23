import Utils from '../lib/utils.js';
import { authenticateToken } from '../middleware/auth-middleware.js';
import { tokenVerify } from '../middleware/token-middleware.js';
import gameRoutes from './game-route.js';
import playRoutes from './play-route.js';
import shopRoutes from './shop-routes.js';
import userRoutes from './user-routes.js';

const allRoutes = [
  ...gameRoutes,
  ...playRoutes,
  ...shopRoutes,
  ...userRoutes,
  // 다른 라우트 추가 가능
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
