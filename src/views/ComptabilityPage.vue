<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
      <div class="container mx-auto px-6 py-8">
          <h3 class="text-gray-700 text-3xl font-medium">Comptabilité</h3>

          <DialogDepot v-if="active" :active="active" :account="account" :accountId="accountId" :currencyCode="currencyCode" @toggle="toggle()" @depotExecuted="onDepotExecuted()"/>

          <div class="mt-4">
              <div class="flex flex-wrap -mx-6">

                  <div v-for="currencyInfo in currenciesInfos" v-bind:key="currencyInfo.code" class="w-full p-6 sm:w-1/2 xl:w-1/3">
                      <div class="flex items-center shadow-sm px-5 py-6 rounded-md bg-white">
                          <img class="h-20 w-20 rounded-full object-cover mx-1"
                            :src="currencyInfo.image"
                            alt="avatar">

                          <div class="mx-5">
                              <h4 class="text-2xl font-semibold text-gray-700">{{ currencyInfo.fullName }}</h4>
                              <div class="leading-5 font-medium text-gray-900">
                                Total:
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {{
                                     getSolde(comptability.total, currencyInfo.code).toFixed(5) - getSolde(comptability.echange, currencyInfo.code).toFixed(5) - getSolde(comptability.swap, currencyInfo.code).toFixed(5)
                                  }} {{ currencyInfo.code }}
                                </span>
                              </div>
                              <div class="leading-5 font-medium text-gray-900">
                                Admin:
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {{ getSolde(comptability.admin, currencyInfo.code).toFixed(5) }} {{ currencyInfo.code }}
                                </span>
                              </div>
                              <div class="leading-5 font-medium text-gray-900">
                                Wallet:
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  {{ 0 }} {{ currencyInfo.code }}
                                </span>
                              </div>
                              <div class="leading-5 font-medium text-gray-900">
                                Difference:
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  {{ 0 }} {{ currencyInfo.code }}
                                </span>
                              </div>
                              <div class="leading-5 font-medium text-gray-900">
                                Bénefice échange:
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {{ getSolde(comptability.echange, currencyInfo.code).toFixed(5) }} {{ currencyInfo.code }}
                                </span>
                              </div>
                              <div class="leading-5 font-medium text-gray-900">
                                Bénefice swap:
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {{ getSolde(comptability.swap, currencyInfo.code).toFixed(5) }} {{ currencyInfo.code }}
                                </span>
                              </div>
                              <div class="px-4 py-2 flex justify-start space-x-4">
                                <button
                                  @click="executeDepot('Admin', comptability.admin_id, currencyInfo.code)"
                                  class="inline-flex gap-x-2 items-center py-2.5 px-6 bg-gray-200 hover:text-white duration-300 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                                >
                                  <span class="text-sm font-semibold tracking-wide">Deposit</span>
                                </button>
                              </div>
                          </div>
                      </div>
                  </div>


              </div>
          </div>

          <div class="mt-8">
            <div v-if="loading_infos" class="p-8 flex justify-center">
              <svg role="status" class="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            </div>
            <div v-if="errorLoading" class="p-8 flex justify-center">
              <AlertMessage :text="errorMessage" />
            </div>
          </div>

      </div>
  </main>
</template>

<script>
import $backend from '../backend'
import { CONNEXION_ERROR } from '../values.js'
import AlertMessage from  '../components/AlertMessage.vue'
import DialogDepot from  '../components/DialogDepot.vue'

export default {
  components: {
    AlertMessage, DialogDepot
  },
  data () {
    return {
      dropdownOpen: false,
      active: false,
      transaction: {},
      notificationOpen: false,
      type: '',
      currenciesInfos: [],
      comptability: [],
      account: '',
      accountId: null,
      currencyCode: '',
      stats: {
        usersQuantity: 0,
        transactionsQuantity: 0,
        volume: 0
      },
      loading_infos: false,
      errorLoading: false,
      errorMessage: CONNEXION_ERROR
    }
  },
  created () {
    this.fetchDatas()
    this.$store.commit('selectItem', 'comptability')
  },
  methods: {
    toggle: function(){
      this.active = !this.active
    },
    getSolde: function(list, name){
      for(let i=0; i < list.length; i++) {
        if(list[i].name === name) return list[i].solde
      }
      return 0
    },
    fetchDatas () {
      this.loading_infos = true
      $backend.fetchComptability()
        .then(response => {
          this.comptability = response.data
          this.loading_infos = false
          console.log(response.data)
          this.fetchCurrenciesInfos()
        })
        .catch(error => {
          this.loading_infos = false
          this.errorLoading = true
          console.log(error)
        })
    },
    fetchCurrenciesInfos () {
      this.loading_infos = true
      $backend.fetchCurrenciesInfos()
        .then(response => {
          this.currenciesInfos = response.data
          this.loading_infos = false
        })
        .catch(error => {
          this.loading_infos = false
          this.errorLoading = true
          console.log(error)
        })
    },
    executeDepot (account, accountId, currencyCode) {
      this.account = account
      this.accountId = accountId
      this.currencyCode = currencyCode
      this.toggle()
    },
    onDepotExecuted() {
      this.toggle()
      this.fetchDatas()
    }
  }
}
</script>
