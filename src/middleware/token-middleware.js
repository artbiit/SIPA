import jwt from 'jsonwebtoken';
import env from '../lib/env.js';
import logger from '../lib/logger.js'; // 로깅 시스템 추가
const { JWT_SECRET } = env;
import ApiError from '../errors/api-error.js';

export const tokenVerify = async (req, res, next) => {
  let token = req.headers['authorization'];
  token = token && token.split(' ')[1];

  if (token) {
    try {
      // 토큰 검증
      const user = jwt.verify(token, JWT_SECRET);

      //TODO: DB에서 유저 정보 불러오기
      const userFromDB = {}; //await findUserById(user.userId);
      if (!userFromDB) {
        throw new ApiError('User not found', 401);
      }

      // req.user에 유저 정보 설정
      req.user = {
        userId: user.userId,
        username: user.username,
        role: userFromDB.role,
        usernameFromDB: userFromDB.username,
      };
    } catch (error) {
      logger.warn(`Token verification or user fetch error: ${error.message}`);
      // 인증이 필요 없는 경우 여기서 에러를 반환하지 않고 다음으로 넘어감
    }
  }
  next();
};
