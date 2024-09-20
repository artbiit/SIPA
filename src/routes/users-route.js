import { signup } from "../services/users-service";

const routes = [
    {
        method: 'POST',
        url: '/users/signup',
        action: signup
    }
];