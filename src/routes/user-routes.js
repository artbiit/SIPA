import { registerUser, loginUser, updateUserTeam } from '../services/user-service.js';

const authRoutes = [
  {
    method: 'post',
    url: '/users/signup', // 회원가입
    action: registerUser,
  },
  {
    method: 'post',
    url: '/users/login', // 로그인
    action: loginUser,
  },
  {
    method: 'patch',
    url: '/users/team', //팀편성
    action: updateUserTeam,
  },
];

export default authRoutes;
