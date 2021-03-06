const CryptoJS = require('crypto-js');
const axios = require('axios');
const qs = require("qs");

function encrypt(url, key) {
    const encryptedKey = CryptoJS.enc.Utf8.parse(key)
    const data = CryptoJS.enc.Utf8.parse(url);
    const hashSign = CryptoJS.HmacSHA512(data, encryptedKey).toString(CryptoJS.enc.Hex);
    return hashSign;
}

function createMainInstance(url, CLIENT_KEY) {
    const mainInstance = axios.create({
    })

    mainInstance.interceptors.request.use((axiosConfig) => {
        Object.assign(axiosConfig.params ? axiosConfig.params : {}, {
            signature: encrypt(axiosConfig.url+`${qs.stringify(axiosConfig.params, { addQueryPrefix: true } )}`, CLIENT_KEY)
        })
        return axiosConfig;
    }, (error) => Promise.reject(error));

    mainInstance.interceptors.request.use((axiosConfig) => {
        const timestamp = Math.floor(Date.now()/1000).toString()
        Object.assign(axiosConfig.params ? axiosConfig.params : {}, {
            timestamp: timestamp
        })
        return axiosConfig;
    }, (error) => Promise.reject(error));

    return mainInstance;
}

module.exports = {
    encrypt: encrypt,
    createMainInstance: createMainInstance
};