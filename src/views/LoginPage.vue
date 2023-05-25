<template>
  <!-- component -->
  <!-- This is an example component -->
   <div class="font-sans">
      <div class="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 ">
          <div class="relative sm:max-w-sm w-full">
              <div class="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
              <div class="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
              <div class="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
                  <label for="" class="block mt-3 text-sm text-gray-700 text-center font-semibold">
                      Login
                  </label>
                  <form  @submit="onSubmit"  class="mt-10">

                      <div>
                          <input v-model="form.username" type="text" placeholder="Username ou Email" class="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0">
                          <label v-show="!emailValidated" for="" class="block  text-sm text-red-400">
                              Username ou Email obligatoire
                          </label>
                      </div>

                      <div class="mt-7">
                          <input v-model="form.password" type="password" placeholder="Password" class="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0">
                          <label  v-show="!passwordValidated" for="" class="block  text-sm text-red-400">
                              Le mot de passe doit avoir au moins 6 caractères
                          </label>
                      </div>

                      <div class="mt-7">
                          <button class="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                              Login
                          </button>
                          <label v-show="!noAuthError" for="" class="block  text-sm text-red-400">
                              Email ou mot de passe incorrect
                          </label>
                      </div>

                      <div class="flex mt-7 items-center text-center">
                          <hr class="border-gray-300 border-1 w-full rounded-md">
                          <label class="block font-medium text-sm text-gray-600 w-full">
                              Smart Recycler
                          </label>
                          <hr class="border-gray-300 border-1 w-full rounded-md">
                      </div>

                  </form>
              </div>
          </div>
      </div>

  </div>
</template>

<script>
import $backend from '../backend'

export default {
  components: {

  },
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      noAuthError: true,
      noSubmitted: true,
      loading: false
    }
  },
  computed: {
    validated () {
      return this.emailValidated && this.passwordValidated
    },
    emailValidated () {
      return this.form.username.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ||
             this.noSubmitted || this.form.username.length >= 1
    },
    passwordValidated () {
      return this.form.password.length >= 6 || this.noSubmitted
    }
  },
  methods: {
    onSubmit (e) {
      this.noSubmitted = false
      e.preventDefault();
      if (this.validated) {
        this.loading = true
        $backend.login({username : this.form.username, password: this.form.password})
          .then(response => {
            this.$store.commit('loginSuccess', response.data)
            this.loading = false
            this.$router.push('dashboard')
          })
          .catch(error => {
            console.log(error)
            this.noAuthError = false
            this.loading = false
          })
      }

    },
    onReset (event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.password = ''
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
