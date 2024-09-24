import {teamSetting} from '../repositories/team-organize-repository.js'
 
export const teamOrganize=async({userId=null,attacker,defender,middle})=>{
    await teamSetting(userId,attacker,defender,middle);
}

