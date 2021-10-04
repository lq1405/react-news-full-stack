import axios from 'axios';
import store from '../redux/store'

axios.defaults.baseURL = "http://localhost:8000";

//axios拦截器
axios.interceptors.request.use(
  config => {


    store.dispatch({
      type: 'change',
      payload: true
    })
    return config;
  }, err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {

    store.dispatch({
      type: 'change',
      payload: false
    })
    return response
  },

  error => {
    return Promise.reject(error.response.status)
  })