export interface Todo {
    id: number;
    content: string;
}

export interface Meta {
    totalCount: number;
}

export interface Member {
    username: string;
    online: boolean;
}

export interface Channel {
    channel_name: string;
    ch_type: string;
    // owner: Member;
    // members: Member[];
}

export interface Invitation {
    channel_name: string;
}

export interface Message {
    id: number;
    mention: boolean;
    sender_name: string;
    sender_is_user: boolean;
    msg_text: string;
    msg_age: string;
}
