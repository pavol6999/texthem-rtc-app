/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */




<template>
    <q-page>
        <img src="~assets/register_waves.svg" class="waves" />
        <div class="row signin-img-row" style="margin-top: 60px;">
            <div class="col-0 col-md-6 flex justify-center content-center">
                <img src="~assets/register.svg" class="responsive" />
            </div>
            <div :class="$q.screen.lt.xl ? 'justify-center' : ''" class="col-12 col-md-6 flex content-center">
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
                                <h2 class="text-h2 q-my-none text-weight-regular">Join us</h2>
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
                            <q-input label="Nickname" standout="bg-secondary text-black" v-model.trim="form.nickname">
                            </q-input>

                            <q-input label="Email Adress" standout="bg-secondary text-black" v-model.trim="form.email">
                                <template v-slot:prepend>
                                    <q-icon name="mail" />
                                </template>
                            </q-input>

                            <q-input v-model.trim="form.password" label="Password" :type="isPwd ? 'password' : 'text'"
                                standout="bg-secondary text-black">
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <!-- <q-input label="Password" type="password" standout="bg-secondary text-black"
                                v-model="form.password"></q-input> -->

                            <q-input v-model.trim="form.passwordConfirmation" label="Confirm Password"
                                :type="isPwd ? 'password' : 'text'" standout="bg-secondary text-black">
                                <template v-slot:prepend>
                                    <q-icon name="lock" />
                                </template>
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>

                            <div>
                                <q-btn class="full-width" :loading="loading" color="primary" type="submit"
                                    label="Register" rounded />
                                <div class="text-center q-mt-sm q-gutter-lg">
                                    <router-link class="text-grey-6" to="/">Forgot password?</router-link>
                                    <router-link class="text-grey-6" :to="{ name: 'login' }">Sign in</router-link>
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
    form: {
        nickname: string,
        email: string,
        password: string,
        passwordConfirmation: string
    }
}


import { useQuasar } from 'quasar'
import { defineComponent, PropType, ref } from 'vue';

import useVuelidate from '@vuelidate/core'
import {
    minLength,
    maxLength,
    required,
    helpers
} from '@vuelidate/validators'
import { StateInterface } from 'src/store';
import { RouteLocationRaw } from 'vue-router';
let $q = useQuasar()


export default defineComponent({
    name: 'Register',

    setup() {
        return {
            v$: useVuelidate({ $autoDirty: true }),
            isPwd: ref(true),
        }
    },

    mounted() {
        $q = useQuasar()
    },

    data(): State {
        return {
            form:
            {
                nickname: '',
                password: '',
                passwordConfirmation: '',
                email: ''
            }
        }
    },
    computed: {
        redirectTo(): RouteLocationRaw {
            return { name: 'login' }
        },
        loading(): boolean {
            return this.$store.state.auth.status === 'pending'
        }
    },

    methods: {

        async onSubmit() {

            const register_correct = await this.v$.$validate()

            let first_err = this.v$.$errors.map(e => e.$message)[0]
            if (!register_correct) {
                this.$q.notify({
                    color: 'red-4',
                    textColor: 'white',
                    icon: 'warning',
                    message: <string>first_err
                })
                return
            }
            else if (this.form.password != this.form.passwordConfirmation) {
                $q.notify({
                    color: 'red-4',
                    textColor: 'white',
                    icon: 'warning',
                    message: 'Passwords do not match'
                })
                return
            }
            else {
                this.$store.dispatch('auth/register', this.form).then(() => this.$router.push(this.redirectTo))
            }


        }
    },
    validations() {

        const regexcheck = () => {
            let test = this.form.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/)
            return test === null ? false : true;
        }

        const regexcheck_mail = () => {
            return /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(this.form.email)
        }

        return {
            form:
            {
                nickname: {
                    required: helpers.withMessage(' Nickname cannot be empty', required),
                    minLength: helpers.withMessage(() => ` Nickname has to be at least 5 characters long`, minLength(5))
                },
                password: {
                    required: helpers.withMessage(' Password cannot be empty ', required),
                    minLength: helpers.withMessage(() => ` Password has to be at least 8 characters long`, minLength(8)),
                    regexcheck: helpers.withMessage(' Password must contain at least 1 number and 1 capital letter', regexcheck)
                },
                email: {
                    required: helpers.withMessage(' Email is required', required),
                    regexcheck_mail: helpers.withMessage(' Email is in invalid format', regexcheck_mail)
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

/* video {
	left: 50%;
	min-height: 100%;
	min-width: 100%;
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
} */
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
