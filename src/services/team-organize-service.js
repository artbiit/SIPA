import {teamSetting} from '../repositories/team-organize-repository.js'
 
export const teamOrganize=async({userId=null,attacker,defender,middle})=>{
    await teamSetting(userId,attacker,defender,middle);
    console.log(userId,attacker,defender,middle);
}

// export const purchaseCash = async ({ userId = null, cash }) => {
//     const result = {};
  
//     const userCash = await getUserCash(userId);
//     await setUserCash(userId, userCash.cash + cash);
  
//     result.totalCash = userCash.cash + cash;
  
//     return result;
//   };