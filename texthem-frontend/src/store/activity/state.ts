import { Channel } from 'src/components/interface/models';
import { User } from 'src/contracts';

export interface ActivityInterface {
    users: User[];
    invitations: any[];
    status: 'pending' | 'success' | 'error' | '';
    errors: { message: string; field?: string }[];
}

function state(): ActivityInterface {
    return {
        users: [],
        invitations: [],
        status: '',
        errors: [],
    };
}

export default state;
