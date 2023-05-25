<template>
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
      <div class="container mx-auto px-6 py-8">
          <h3 class="text-gray-700 text-3xl font-medium">Recyclers</h3>

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

          <div class="flex flex-col mt-8">
              <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div
                      class="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                      <table class="min-w-full">
                          <thead>
                              <tr>
                                  <th
                                      class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                      Name</th>
                                  <th
                                      class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                      Bio Level</th>
                                  <th
                                      class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                      Non-Bio Level</th>
                                  <th
                                      class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                      Is Full</th>
                                  <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
                              </tr>
                          </thead>

                          <tbody class="bg-white">
                              <tr v-for="transaction in transactions" :key="transaction.id">
                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    {{transaction.name}}
                                  </td>

                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    {{transaction.levels.bio}}
                                  </td>

                                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                    {{transaction.levels['non-bio']}}
                                  </td>

                                  <td
                                      class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                                      {{transaction.is_full}}</td>

                                  <td
                                      class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                                      <button v-if="canBeExecuted(transaction)" @click="confirmerTransaction(transaction)" class="bg-blue-500 p-1 mr-1 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out  transform hover:-translate-x hover:scale-105">
                                          Confirmer
                                      </button>
                                      <a v-if="canBeExecuted(transaction)" @click="annulerTransaction(transaction)" href="#" class="text-red-400 hover:text-red-900">Annuler</a>
                                  </td>
                              </tr>

                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>
  </main>
</template>

<script>
import $backend from '../backend'
import { CONNEXION_ERROR } from '../values.js'
import AlertMessage from  '../components/AlertMessage.vue'

export default {
  components: {
    AlertMessage
  },
  data () {
    return {
      dropdownOpen: false,
      active: false,
      transaction: {},
      notificationOpen: false,
      type: '',
      state: 'EN_COURS',
      transactions: [],
      loading_infos: false,
      errorLoading: false,
      errorMessage: CONNEXION_ERROR
    }
  },
  created () {
    this.fetchTransactions()
    this.$store.commit('selectItem', 'transactions')
  },
  methods: {
    toggle: function(){
      this.active = !this.active
    },
    fetchTransactions () {
      this.loading_infos = true
      console.log('Recyclers')
      $backend.fetchRecyclers()
        .then(response => {
          const data = Object.values(response.data).map(value => value)
          console.log(data)
          this.transactions = response.data
          this.loading_infos = false
        })
        .catch(error => {
          this.loading_infos = false
          this.errorLoading = true
          console.log(error)
        })
    },
    canBeExecuted (transaction) {
      return transaction?.state == "EN_COURS" &&
        (transaction?.type == "DEPOT" || transaction?.type == "RETRAIT");
    },
    confirmerTransaction (transaction) {
      this.transaction = transaction
      this.toggle()
      this.type = "confirmation"
    },
    annulerTransaction(transaction) {
      this.transaction = transaction
      this.toggle()
      this.type = "annulation"
    }
  },
  computed : {
    filteredTransactions: function() {
      return this.transactions.filter((transaction) => {
        return transaction.state === this.state || this.state === ''
      }).filter((transaction) => {
        return transaction.type === this.type || this.type === ''
      }).filter((transaction) => {
        return transaction.type === 'DEPOT' || transaction.type === 'RETRAIT'
      })
    }
  }
}
</script>
