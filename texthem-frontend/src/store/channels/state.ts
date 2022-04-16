import { SerializedMessage } from 'src/contracts';

export interface ChannelsStateInterface {
    loading: boolean;
    error: Error | null;
    messages: { [channel: string]: SerializedMessage[] };
    active: string | null;
}

function state(): ChannelsStateInterface {
    return {
        loading: false,
        error: null,
        messages: {},
        active: null,
    };
}

export default state;
