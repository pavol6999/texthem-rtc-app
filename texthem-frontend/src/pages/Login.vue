/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */



<template>
    <q-page>
        <img src="~assets/layered-waves-haikei.svg" class="waves" />
        <div class="row signin-img-row">
            <div class="col-0 col-md-6 flex justify-center content-center">
                <img src="~assets/password.svg" class="responsive" />
            </div>
            <div :class="$q.screen.lt.lg ? 'justify-center' : ''" class="col-12 col-md-6 flex content-center">
                <q-card v-bind:style="$q.screen.lt.sm ? { 'width': '80%' } : { 'width': '50%' }">
                    <q-card-section>
                        <!-- <q-avatar size="103px" class="absolute-center avatar">
							<img src="~assets/avatar.png" />
                        </q-avatar>-->
                        <q-avatar size="120px" class="absolute-center avatar">
                            <video width="240" height="140" style="background-size: contain" poster="~assets/avatar.png"
                                autoplay loop muted>
                                <source type="video/webm" src="~assets/profile.webm" />
                                <source type="video/mp4" src="~assets/profile.mp4" />
                            </video>
                        </q-avatar>
                    </q-card-section>

                    <q-card-section>
                        <div class="q-pt-lg">
                            <div class="col text-h6 ellipsis flex justify-center">
                                <h2 class="text-h2 q-my-none text-weight-regular">Connect</h2>
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
                            <q-input label="Email" name="email" standout="bg-secondary text-black"
                                v-model.trim="credentials.email">
                            </q-input>
                            <q-input label="Password" name="password" standout="bg-secondary text-black"
                                v-model="credentials.password" :type="isPwd ? 'password' : 'text'">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <q-checkbox id="rememberMe" v-model="credentials.remember" label="Remember me" />
                            <div>
                                <q-btn class="full-width" color="primary" type="submit" :loading="loading" label="Login"
                                    rounded />
                                <div class="text-center q-mt-sm q-gutter-lg">
                                    <router-link class="text-grey-6" to="/">Forgot password?</router-link>
                                    <router-link class="text-grey-6" :to="{ name: 'register' }">Sign up</router-link>
                                </div>
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">

interface State {
    credentials: {
        email: string;
        password: string;
        remember: boolean;
    }
}

import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar'
import useVuelidate from '@vuelidate/core'
import {
    minLength,
    required,
    helpers
} from '@vuelidate/validators'
import { RouteLocationRaw } from 'vue-router';
let $q = useQuasar()


export default defineComponent({
    name: 'Login',

    setup() {
        return {
            isPwd: ref(true),
            v$: useVuelidate({ $autoDirty: true })
        }
    },


    mounted() {
        $q = useQuasar()
    },

    data(): State {
        return {
            credentials: {
                email: '',
                password: '',
                remember: false
            }
        }
    },
    methods: {
        async onSubmit() {
            const login_correct = await this.v$.$validate()
            if (!login_correct) {
                this.$q.notify({
                    color: 'red-4',
                    textColor: 'white',
                    icon: 'warning',
                    message: this.v$.$errors.map(e => e.$message).join()
                })
                return
            }
            this.$store.dispatch('auth/login', this.credentials).then((a) => { this.$router.push(this.redirectTo) }).catch(err => {

                this.$q.notify({
                    color: 'red-4',
                    textColor: 'white',
                    icon: 'warning',
                    message: err.response.data.errors.map((err: { message: string; }) => err.message.split(": ")[1])
                })
            })

        }
    },
    computed: {
        redirectTo(): RouteLocationRaw {
            return (this.$route.query.redirect as string) || { name: 'home' }
        },
        loading(): boolean {
            return this.$store.state.auth.status === 'pending'
        }
    },
    validations() {

        const regexcheck = () => {
            let test = this.credentials.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/)
            return test === null ? false : true;
        }
        const regexcheck_mail = () => {
            return /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(this.credentials.email)
        }

        return {
            credentials:
            {
                email: {
                    required: helpers.withMessage(' Email is required', required),
                    regexcheck_mail: helpers.withMessage(' Email is in invalid format', regexcheck_mail)
                },
                password: {
                    required: helpers.withMessage(' Password cannot be empty ', required),
                    minLength: helpers.withMessage(() => ` Password has to be at least 8 characters long`, minLength(8)),
                    regexcheck: helpers.withMessage(' Password has to be alphanumeric', regexcheck)
                }
            }
        }
    }

});
</script>

<style scoped>
.avatar {
    box-shadow: 20px 20px 20px rgba(0, 0, 0, 0.2);
}

.signin-img-row {
    height: 70vh;
}

.waves {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: -1;
    object-fit: cover;
}
</style>
