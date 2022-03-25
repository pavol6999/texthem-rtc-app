export interface UserStateInterface {
    jwt: string;
    isLogged: boolean;
    username: string;
    notifications: boolean;
}

function state(): UserStateInterface {
    return {
        jwt: 'jwt-token',
        isLogged: true,
        username: 'Pavol Krajkovic',
        notifications: true,
    };
}

export default state;
