const axios = require('axios');

exports.axiosService = (url,method,accessToken,data) => {
   return new Promise((resolve,reject)=> {
    axios({
        method,
        url,
        headers : {
            accept : "application/json",
            Authorization: `Bearer ${accessToken}`
        },
        data 
    }). then( res => {
        resolve(res)
    }).catch( err => {
        console.log("error in axios service",err)
        reject(err)
    })    
    })
}