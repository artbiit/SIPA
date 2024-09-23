import {
  registerUser,
  loginUser,
  getSpecificUser,
  getUserAthletes,
  enhanceAthletes,
  sellAthlete,
} from '../services/user-service.js';

const routes = [
  {
    method: 'post',
    url: '/users/signup',
    action: registerUser,
  },
  {
    method: 'post',
    url: '/users/login',
    action: loginUser,
  },
  {
    method: 'get',
    url: '/users/athletes',
    action: getUserAthletes,
    authRequired: true,
  },
  {
    method: 'post',
    url: '/users/athletes/training',
    action: enhanceAthletes,
    authRequired: true,
  },
  {
    method: 'post',
    url: '/users/athletes/sell',
    action: sellAthlete,
    authRequired: true,
  },
  {
    method: 'get',
    url: '/users/:userId',
    action: getSpecificUser,
    authRequired: false,
  },
];

export default routes;
