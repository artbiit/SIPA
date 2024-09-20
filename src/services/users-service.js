import ApiError from "../errors/api-error";
import { createUser } from "../repositories/users-repository";


export const signup = async ({ usetId, password, userName }) => {
    if(!usetId){
        throw new ApiError("아이디는 5글자 이상", 400);
    }
}