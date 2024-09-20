import prisma from '../lib/prisma.js';

export const createUser = async (userId, password, userName) => {
    return prisma.create
};