import axios from 'axios';

const ApiRequester = axios.create({
  baseURL: process.env.REACT_APP_DALSAMO_BE_HOST,
  headers: {},
  timeout: 3000,
});

export default ApiRequester;
