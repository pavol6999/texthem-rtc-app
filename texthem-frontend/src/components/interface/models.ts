export interface Todo {
    id: number;
    content: string;
}

export interface Meta {
    totalCount: number;
}

export interface Member {
    username: string;
    online: Boolean;
}

export interface Channel {
    channel_name: string;
    ch_type: string;
    // owner: Member;
    // members: Member[];
}

export interface Invitation {
    //TODO
}
