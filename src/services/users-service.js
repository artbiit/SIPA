import ApiError from "../errors/api-error.js";
import prisma from "../lib/prisma.js";
import Utils from "../lib/utils.js";
import { createUser } from "../repositories/users-repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';





export const signup = async ({ userId, password, userName }) => {
    // 유저 아이디가 5글자 미만이면 오류 발생
    if (!userId || userId.length < 5) {
        throw new ApiError("아이디는 5글자 이상이어야 합니다.", 400);
    }

   
    // 성공적으로 통과할 경우
    return {
        message: "회원가입 성공",
        userId,
        userName
    };
    const hashedPassword = await bcrypt.hash(password, 10);
};



export const login = async ({ userId, password }) => {

if(!user){
    throw new ApiError("요청하신 정보가 없습니다", 400);
}
if (!(password, user.password)){
    throw new ApiError("비밀번호가 일치하지않습니다", 400);
    }
}