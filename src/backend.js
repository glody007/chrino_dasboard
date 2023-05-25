import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8090/',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token-mcapital')
  if (token != undefined) {
    console.log('token'+ token )
    config.headers["Authorization"] = "Token " + token;
  }
  return config
})

// Response Interceptor to handle and log errors
api.interceptors.response.use(function (response) {
  return response
}, function (error) {
  // Handle Error
  console.log(error)
  return Promise.reject(error)
})


export default {
  login (data) {
    console.log(data)
    return api.post('/api-token-auth/', data)
  },
  fetchRecyclers() {
    return api.get('/recyclers')
  },
  fetchTransactions() {
    return api.get('/transactions/')
  },
  executeTransaction(id) {
    return api.post(`transactions/${id}/execute`)
  },
  executeOperation(data) {
    return api.post('operations/', data)
  },
  annulerTransaction(id, motif) {
    return api.post(`transactions/${id}/annuler`, {
      motif: motif
    })
  },
  fetchStats() {
    return api.get('/stats/')
  },
  fetchCurrenciesInfos() {
    return api.get('/currencies-infos/')
  },
  fetchComptability() {
    return api.get('/comptability/')
  },
  fetchUserSolde(id) {
    return api.get(`/users/${id}/soldes`)
  },
  fetchUsers() {
    return api.get('/users/')
  }
}
