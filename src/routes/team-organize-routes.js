import {teamOrganize} from '../services/team-organize-service.js';

const routes=[
    {
        method:'patch',
        url:'/users/team',
        action:teamOrganize,
        autoRequired:true,
    },
    
]

export default routes;