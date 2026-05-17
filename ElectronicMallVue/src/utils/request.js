import axios from 'axios'
import ElementUI from "element-ui";
import router from '../router'

const request = axios.create({
    baseURL: 'http://localhost:9191',  // Global API base URL for local development.
    timeout: 5000
})

// request interceptor
// Process requests before sending
// Add token and shared request headers
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = JSON.parse(localStorage.getItem("user"))
    if(user){
         config.headers['token'] = user.token;  // Set token
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response interceptor
// Process API responses in one place
request.interceptors.response.use(
    response => {
        let res = response.data;
        // Return file responses directly
        if (response.config.responseType === 'blob') {
            return res
        }
        // Support string responses from the server
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        // Redirect to login when token is invalid
        if(res.code==='402'){
            ElementUI.MessageBox({
                title: 'Error',
                message: res.msg
            }).then(() =>{
                router.push('/login')
            } )
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

