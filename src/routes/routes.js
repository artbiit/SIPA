import Utils from "../lib/utils.js";
import { authenticateToken } from "../middleware/auth-middleware.js";
import { verifyOwnership } from "../middleware/ownership-middleware.js";
import { checkUserRole } from "../middleware/role-middleware.js";
import { tokenVerify } from "../middleware/token-middleware.js";

const allRoutes = [
  // 다른 라우트 추가 가능
];

// 파라미터 및 미들웨어 자동 설정
allRoutes.forEach((route) => {
  route.requiredParams = Utils.getFunctionParams(route.action);

  route.middleware = [tokenVerify];

  if (route.authRequired) {
    route.middleware.push(authenticateToken);
  }

  if (route.ownershipRequired) {
    route.middleware.push(verifyOwnership);
  }
  route.middleware.push(checkUserRole(route.roleRequired));
});

export default allRoutes;
