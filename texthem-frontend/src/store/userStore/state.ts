export interface UserStateInterface {
    jwt: string;
    isLogged: boolean;
    username: string;
}

function state(): UserStateInterface {
    return {
        jwt: 'jwt-token',
        isLogged: true,
        username: 'xkrajkovic',
    };
}

export default state;
