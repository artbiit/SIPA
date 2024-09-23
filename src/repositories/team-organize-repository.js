import {prisma} from '../lib/prisma.js';

export const teamSetting=async(userId,attacker,defender,middle)=>{
	try{
		const userExists = await prisma.Users.findUnique({
			where: { id: userId },
		  });
	  
		  if (!userExists) {
			throw new Error("User not found in the Users table.");
		  }
		await prisma.MyTeam.upsert({
			where: {
			  id: userId,		
			},
			update: {
			  attacker: attacker,
			  defender: defender,
			  middle: middle,
			},
			create: {
			  userId: userId,
			  attacker: attacker,
			  defender: defender,
			  middle: middle,
			},
		});

	}catch(error){
		console.log("detail",error);
		throw new Error("Team setting error");
	}
}