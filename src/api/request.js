import axios from 'axios'

// export const baseURL = process.env.NODE_ENV === 'production' ? 'https://xxx' : '/api'
export const baseURL = import.meta.env.MODE === 'production' ? 'http://119.91.143.19/api' : '/api'
// console.log("import.meta.env: ", import.meta.env)
const instance = axios.create({
  timeout: 100000,
  baseURL: baseURL
})

instance.interceptors.use
instance.interceptors.response.use(function onResolve(response) {
  if ([200, 201].includes(response.status)) {
    if ([200, 0].includes(response.data.code)) {
      return response.data.data
    }
  }
  return response;
}, function (error) {
  return Promise.reject(error)
})

export const http = instance