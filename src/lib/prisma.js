import { PrismaClient } from '@prisma/client';
import logger from './logger.js';
import env from './env.js';
import Utils from './utils.js';
import bcrypt from 'bcryptjs';

const { SERVER_ADMIN_ID, SERVER_ADMIN_PW } = env;
const prisma = new PrismaClient();

//TODO : 관리자 계정 자동 생성 부분 제거
// try {
//   /**
//    * 1. DB에서 admin 계정 존재 여부를 확인합니다.
//    * @type {Object|null} - admin 계정 정보 또는 null
//    */
//   const adminUser = await prisma.user.findUnique({
//     where: { username: SERVER_ADMIN_ID },
//   });

//   /**
//    * 2. admin 계정이 없으면 새로 생성합니다.
//    * 비밀번호는 bcrypt로 해싱되며, 'ADMIN' 권한을 설정합니다.
//    */
//   if (!adminUser) {
//     const hashedPassword = await bcrypt.hash(
//       Utils.getPepperedPassword(SERVER_ADMIN_PW),
//       10
//     );

//     await prisma.user.create({
//       data: {
//         username: SERVER_ADMIN_ID,
//         nickname: SERVER_ADMIN_ID,
//         password: hashedPassword,
//         role: 'ADMIN', // 관리자 권한 설정
//       },
//     });
//     logger.info('Admin account created successfully');
//   }
// } catch (error) {
//   /**
//    * 에러가 발생할 경우 에러 메시지를 로깅합니다.
//    */
//   logger.error('Error checking or creating admin account:', error);
// }

/**
 * Prisma 클라이언트를 내보내어 다른 모듈에서 사용할 수 있게 합니다.
 */
export { prisma };
