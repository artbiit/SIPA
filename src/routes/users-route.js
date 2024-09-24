import { login, signup, enhanceAthletes, sellAthlete } from '../services/users-service.js';
import express from 'express';
const routes = [
  {
    method: 'post',
    url: '/users/signup',
    action: signup,
  },
  {
    method: 'post',
    url: '/users/login',
    action: login,
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
];

export default routes;
