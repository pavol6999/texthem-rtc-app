import { SerializedMessage, User } from 'src/contracts';

export interface ChannelsStateInterface {
    loading: boolean;
    error: Error | null;
    messages: { [channel: string]: SerializedMessage[] };
    users: { [channel: string]: User[] };
    active: string | null;
}

function state(): ChannelsStateInterface {
    return {
        loading: false,
        error: null,
        messages: {},
        users: {},
        active: null,
    };
}

export default state;
