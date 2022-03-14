import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';

const mutation: MutationTree<UserStateInterface> = {
    setJWT(state: UserStateInterface, jwt: string) {
        state.jwt = jwt;
    },
    changeLoggedStatus(state: UserStateInterface) {
        state.isLogged = !state.isLogged;
    },
    setUsername(state: UserStateInterface, username: string) {
        state.username = username;
    },
};

export default mutation;
