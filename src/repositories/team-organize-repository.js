import prisma from '../lib/prisma.js';

export const teamSetting=async(userId,attacker,defender,middle)=>{
	try{
		await prisma.MyTeam.update({
			where: {
				userId:userId,
			},
			data: {
				attacker:attacker,
				defender:defender,
				middle:middle,
			},
		});

	}catch(error){
		throw new Error("Team setting error");
	}
};

