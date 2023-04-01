import axios from 'axios';

const ApiRequester = axios.create({
  baseURL: 'https://dalsamo-api-dev.mskwon.click',
  headers: {},
  timeout: 3000,
});

export default ApiRequester;
