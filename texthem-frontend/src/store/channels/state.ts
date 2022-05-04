import { SerializedMessage, User } from 'src/contracts';

export interface ChannelsStateInterface {
    loading: boolean;
    error: Error | null;
    messages: { [channel: string]: SerializedMessage[] };
    users: { [channel: string]: User[] };
    active: string | null;
    typing: { [channel: string]: { [user: string]: string} }
}

function state(): ChannelsStateInterface {
    return {
        loading: false,
        error: null,
        messages: {},
        users: {},
        active: null,
        typing: {}
    };
}

export default state;
