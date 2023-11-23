import axios_conf from './axios_conf'

export const api_register = (payload) => new Promise( async(resolve,reject) =>{
    try {
        const res = await axios_conf({
            method: 'post',
            url: '/driver/register',
            data: payload
        })
        resolve(res)
    } catch (error) {
        reject(error)
    }
})