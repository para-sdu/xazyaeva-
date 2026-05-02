import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://azhar-fund.onrender.com/api/v1',
  headers: {
    Accept: 'application/json',
  },
})
