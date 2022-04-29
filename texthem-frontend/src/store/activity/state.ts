import { User } from 'src/contracts';

export interface ActivityInterface {
    loading: boolean;
    error: Error | null;
    users: { [channel: string]: User[] };
    active: string | null;
}

function state(): ActivityInterface {
    return {
        loading: false,
        error: null,
        users: {},
        active: null,
    };
}

export default state;
