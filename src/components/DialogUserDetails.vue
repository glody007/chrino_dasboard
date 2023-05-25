<script>
import $backend from '../backend'
import { CONNEXION_ERROR } from '../values.js'
import AlertMessage from  '../components/AlertMessage.vue'

export default {
  props: ['active', 'user'],
  components: {
    AlertMessage
  },
  data () {
    return {
      loading_infos: false,
      errorLoading: false,
      transfer: false,
      errorMessage: CONNEXION_ERROR,
      currencies: [],
      currenciesInfos: [],
      currencyCode: '',
      currencyQuantity: ''
    }
  },
  created: function() {
    this.fetchCurrenciesInfos()
  },
  methods : {
    toggle: function(){
      this.$emit('toggle')
    },
    toggleTransfer: function(){
      this.transfer = false
    },
    fetchUserSolde () {
      this.loading_infos = true
      $backend.fetchUserSolde(this.user?.id)
      .then((response) => {
        this.loading_infos = false
        this.currencies = response.data
      })
      .catch((error) => {
        console.log(error)
        this.errorLoading = true
        this.loading_infos = false
      })
    },
    fetchCurrenciesInfos () {
      this.loading_infos = true
      $backend.fetchCurrenciesInfos()
        .then(response => {
          this.currenciesInfos = response.data
          this.loading_infos = false
          this.fetchUserSolde()
        })
        .catch(error => {
          this.loading_infos = false
          this.errorLoading = true
          console.log(error)
        })
    },
    transferCurrency (currencyCode) {
      this.transfer = true
      this.currencyCode = currencyCode
    },
    executeTransfer () {
      this.loading_infos = true
      $backend.executeOperation({
        type: 'TRANSFER',
        taux: 0,
        state: 'EXECUTER',
        to: this.user.id,
        montant: this.currencyQuantity,
        currency: this.currencyCode
      })
      .then(() => {
        this.toggleTransfer()
        this.fetchCurrenciesInfos()
        this.loading_infos = false
      })
      .catch((error) => {
        console.log(error.response)
        this.errorLoading = true
        this.loading_infos = false
        this.errorMessage = CONNEXION_ERROR
        if(error.response.data) this.errorMessage = error.response.data.error
      })
    },
    getSolde (list, name){
      for(let i=0; i < list.length; i++) {
        if(list[i].name === name) return list[i].solde
      }
      return 0
    },
  },
  computed : {
    modal: function() {
      if(this.active) return ''
      return 'hidden'
    }
  }
}
</script>

<template>
    <div id="modal" :class="modal" class="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
    <div class="relative top-40 md:w-1/2 mx-auto shadow-lg rounded-md bg-white">

        <!-- Modal header -->
        <div class="flex justify-between bg-indigo-600 items-center text-white text-xl rounded-t-md px-4 py-2">
            <h3>Utilisateur: {{ user.username }}</h3>
            <button @click="toggle()">x</button>
        </div>

        <!-- Modal body -->
        <div class="overflow-y-scroll">
          <div v-if="loading_infos" class="p-8 flex justify-center">
            <svg role="status" class="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
          <div v-if="errorLoading" class="p-8 flex justify-center">
            <AlertMessage :text="errorMessage" />
          </div>
          <div class="justify-center md:justify-start my-auto py-3 md:pt-0 px-2 md:px-8 lg:px-16">

            <!-- Start list currencies -->
            <div v-if="!transfer" class="flex flex-wrap -mx-6">
                <div v-for="currencyInfo in currenciesInfos" v-bind:key="currencyInfo.code" class="w-full p-6 sm:w-1/2 xl:w-1/3">
                    <div class="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                        <img class="h-10 1-20 rounded-full object-cover mx-1"
                          :src="currencyInfo.image"
                          alt="avatar">

                        <div class="mx-5">
                            <h4 class="text-2xl font-semibold text-gray-700">{{ currencyInfo.fullName }}</h4>
                            <div class="leading-5 font-medium text-gray-900">
                              Solde:
                              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {{ getSolde(currencies, currencyInfo.code).toFixed(5) }} {{ currencyInfo.code }}
                              </span>
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-2 flex justify-start space-x-4">
                      <button
                        @click="transferCurrency(currencyInfo.code)"
                        class="inline-flex gap-x-2 items-center py-2.5 px-6 bg-gray-200 hover:text-white duration-300 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                      >
                        <span class="text-sm font-semibold tracking-wide">Transfer</span>
                      </button>
                    </div>

                </div>
            </div>
            <!-- End list currencies -->

            <!-- Start Transfer -->
            <div v-if="transfer" class="justify-center md:justify-start my-auto py-3 md:pt-0 px-2 md:px-8 lg:px-16">
              <form class="flex flex-col pt-1 md:pt-4 pb-3 md:pb-8" onsubmit="event.preventDefault();">
                  <div class="flex flex-col pt-4">
                      <label for="quantity" class="">Quantité {{ currencyCode }} à transférer:</label>
                      <input v-model="currencyQuantity"  type="number" id="quantity" placeholder="0" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                  </div>
              </form>

              <div class="px-4 py-2 flex justify-start space-x-4">
                <button
                  @click="executeTransfer()"
                  class="inline-flex gap-x-2 items-center py-2.5 px-6 bg-indigo-200 hover:text-white duration-300 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <span class="text-sm font-semibold tracking-wide">Executer</span>
                </button>
                <button
                  @click="toggleTransfer()"
                  class="inline-flex gap-x-2 items-center py-2.5 px-6 bg-red-200 hover:text-white duration-300 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  <span class="text-sm font-semibold tracking-wide">Annuler</span>
                </button>
              </div>
            </div>
            <!-- End Transfer -->

          </div>

        </div>

        <!-- Modal footer -->
        <div class="px-4 py-2 border-t border-t-gray-500 flex justify-end items-center space-x-4">
          <button
            @click="toggle()"
            class="inline-flex gap-x-2 items-center py-2.5 px-6 bg-gray-200 hover:text-white duration-300 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            <span class="text-sm font-semibold tracking-wide">Quitter</span>
          </button>
        </div>
    </div>
    </div>
</template>
