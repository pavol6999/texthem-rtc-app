/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */




<template>
    <q-page>
        <img src="~assets/register_waves.svg" class="waves" />
        <div class="row signin-img-row" style="margin-top: 60px;">
            <div class="col-0 col-md-6 flex justify-center content-center">
                <img src="~assets/register.svg" class="responsive" />
            </div>
            <div
                :class="$q.screen.lt.xl ? 'justify-center' : ''"
                class="col-12 col-md-6 flex content-center"
            >
                <q-card v-bind:style="$q.screen.lt.sm ? { 'width': '80%' } : { 'width': '50%' }">
                    <q-card-section>
                        <!-- <q-avatar size="103px" class="absolute-center avatar">
							<img src="~assets/avatar.png" />
                        </q-avatar>-->
                        <q-avatar size="120px" class="absolute-center avatar">
                            <video
                                width="240"
                                height="140"
                                style="background-size: contain"
                                poster="~assets/avatar.png"
                                autoplay
                                loop
                                muted
                            >
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
                            <q-input
                                label="Nickname"
                                standout="bg-secondary text-black"
                                v-model="nickname"
                            ></q-input>

                            <q-input
                                label="Email Adress"
                                standout="bg-secondary text-black"
                                v-model="email"
                            ></q-input>
                            <q-input
                                label="Password"
                                type="password"
                                standout="bg-secondary text-black"
                                v-model="password"
                            ></q-input>
                            <q-input
                                label="Confirm Password"
                                type="password"
                                standout="bg-secondary text-black"
                                v-model="confirmPassword"
                            ></q-input>
                            <div>
                                <q-btn
                                    class="full-width"
                                    color="primary"
                                    type="submit"
                                    label="Register"
                                    rounded
                                />
                                <div class="text-center q-mt-sm q-gutter-lg">
                                    <router-link class="text-grey-6" to="/">Forgot password?</router-link>
                                    <router-link class="text-grey-6" to="/login">Sign in</router-link>
                                </div>
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script>

import { useQuasar } from 'quasar'

import useVuelidate from '@vuelidate/core'
import {
  minLength,
  maxLength,
  required,
  helpers
} from '@vuelidate/validators'
let $q = useQuasar()
export default {


  setup () {
		return {
			v$: useVuelidate({ $autoDirty: true })
		}
	},

  mounted() {
    $q = useQuasar()
  },

  data() {
    return {
      nickname: '',
      password: '',
      confirmPassword: '',
      email: ''
    }
  },

  name: 'Register',
  methods: {

    async onSubmit() {

      const register_correct = await this.v$.$validate()

      /*
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!this.nickname || !this.password) {

        $q.notify({
          group: false,
          type: 'negative',
          message: 'Please fill in all fields'
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      else if (this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) === null) {
        $q.notify({
          group: false,
          type: 'negative',
          message: 'Password must be at least 8 characters and contain at least one number, one uppercase and one lowercase letter'
        })
      }
      */

     if (!register_correct) {
				this.$q.notify({
					color: 'red-4',
					textColor: 'white',
					icon: 'warning',
					message: this.v$.$errors.map(e => e.$message).join()
				})
				return 
			}
    if (this.password != this.confirmPassword) {
        $q.notify({
          color: 'red-4',
					textColor: 'white',
					icon: 'warning',
          message: 'Passwords do not match'
        })
      }
    }
  },
	validations () {

		const regexcheck = () => {
			let test = this.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/)
			console.log(test)
			if (test === null)
				return false;
			else 
				return true;
		}

    const regexcheck_mail = () => {
      return /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(this.email)
    }

		return {
			nickname: {
				required :helpers.withMessage(' Nickname cannot be empty', required),
				minLength: helpers.withMessage(() => ` Nickname has to be at least 5 characters long`, minLength(5))
			},
			password: {
				required :helpers.withMessage(' Password cannot be empty ', required),
				minLength: helpers.withMessage(() => ` Password has to be at least 8 characters long`, minLength(8)),
				regexcheck: helpers.withMessage(' Password has to be alphanumeric', regexcheck)
			},
      email: {
        required: helpers.withMessage(' Email is required', required),
        regexcheck_mail: helpers.withMessage(' Email is in invalid format', regexcheck_mail)
      }
		}
	}

};
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
