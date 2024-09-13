import ApiError from '../errors/api-error.js';

const rolePermissions = {
  ADMIN: ['ADMIN'],
  USER: ['USER', 'ADMIN'],
};

/**
 * 요청한 유저의 권한을 확인하는 미들웨어
 * 유저의 역할이 요구되는 권한과 일치하는지 검사하며, 유저가 SUSPENDED 상태일 경우 차단합니다.
 * @param {string} roleRequired - 요구되는 역할 (예: 'ADMIN', 'USER')
 * @returns {Function} - 미들웨어 함수
 */
export const checkUserRole = (roleRequired) => (req, res, next) => {
  const user = req.user;
  // SUSPENDED 상태면 차단
  if (user?.role === 'SUSPENDED') {
    return next(new ApiError('Your account is suspended', 403)); // SUSPENDED인 경우
  }

  if (roleRequired) {
    if (!user) {
      return next(new ApiError('User information is missing', 401)); // 유저 정보가 없는 경우
    }

    // 권한이 요구된 역할과 일치하는지 확인
    const allowedRoles = rolePermissions[roleRequired] || [];
    if (!allowedRoles.includes(user.role)) {
      return next(
        new ApiError(
          `You do not have the required ${roleRequired} permissions`,
          403
        )
      );
    }
  }
  return next(); // 권한 검증 통과 시 다음 미들웨어로 진행
};
