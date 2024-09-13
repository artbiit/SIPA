import ApiError from '../errors/api-error.js';

/**
 * 요청자가 소유한 자원에 접근하는지 확인하는 미들웨어
 * 요청자의 정보와 DB에 저장된 정보가 일치하는지 검사합니다.
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어로 제어를 전달하는 함수
 * @returns {void}
 */
export const verifyOwnership = (req, res, next) => {
  console.log(verifyOwnership);
  try {
    const usernameFromToken = req.user.username; // JWT에서 추출한 username
    const userFromDb = req.user.usernameFromDB;

    if (!userFromDb) {
      return next(new ApiError('User not found', 404));
    }

    // JWT의 username과 DB의 username이 일치하는지 확인
    if (userFromDb !== usernameFromToken) {
      return next(new ApiError('Unauthorized access - username mismatch', 403));
    }
  } catch (error) {
    return next(new ApiError('Database error', 500));
  }
  return next();
};
