import prisma from '../lib/prisma.js';
import { signup } from '../services/users-service.js';
// import bcrypt from "bcrypt";




// const hashedPassword = await bcrypt.hash(password, 10);
export const createUser = async ({userId, password, userName}) => {
    return prisma.create({
        data : {
            userId : signup.userId,
            password: hashedPassword,
            userName: signup.userName
        }
    });
    return res.status(201).json({message:'회원가입이 완료되었습니다.'})
};