import {a} from '../services/team-organize-service';

const routes=[
    {
        method:'patch',
        url:'/users/team',
        action:a,
        autoRequired:true,
    }
]