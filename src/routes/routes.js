import Utils from '../lib/utils.js';
import { authenticateToken } from '../middleware/auth-middleware.js';
import { tokenVerify } from '../middleware/token-middleware.js';
<<<<<<< HEAD
import gameRoutes from './game-route.js';
import userRoutes from './users-route.js';
=======
import purchaseRoute from '../routes/purchase-route.js';

>>>>>>> origin/feature/cash_purchase
const allRoutes = [
  ...gameRoutes,
  ...userRoutes
  // 다른 라우트 추가 가능
  ...purchaseRoute,
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
