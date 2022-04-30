export interface Member {
    username: string;
    online: boolean;
}

export interface Channel {
    name: string;
    type: string;
    ownerId: number;
    id: number;
}

export interface Message {
    id: number;
    mention: boolean;
    sender_name: string;
    sender_is_user: boolean;
    msg_text: string;
    msg_age: string;
}
