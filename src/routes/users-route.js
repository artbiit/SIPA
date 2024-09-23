import { login, signup } from "../services/users-service.js";
import express from 'express';
const routes = [
    {
        method: 'post',
        url: '/users/signup',
        action: signup
    },
    {
        method: 'post',
        url: '/users/login',
        action: login
    }
];
 
export default routes;