import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://todoproject-10181.firebaseio.com/'
});

export default instance;