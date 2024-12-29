
const axios = require('axios');
const redis = require('../config/redis');

const clientId = "ERP_74611";
const clientSecret = "074ff2d1-94fd-44e5-b397-e9e9d5173030";

const getToken = async () => {
    try {
        let key = `COMMUNICATIONTOKEN`;
        const cachedData = await redis.GetKeyRedis(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        const apiURL = `https://api.dev.aieze.in/api/v1/communication/auth/oAuth/token`;
        const paylod = {
            "client_id": clientId,
            "client_secret": clientSecret
        }
        const headers = {
            'Content-Type': 'application/json'
        }
        const response = await axios.post(apiURL, paylod, { headers: headers });
        let res = response.data;
        let status = response.status;
        if(status == 200){
            let token = res.token;
            let exp = res.expiresIn;
            redis.SetRedis(key, token, exp).then().catch(err => console.log(err));
            return token;
        }else{
            throw {"error":"communication Server is down"};
        }
        
    } catch (error) {
        throw error;
    }
};

const sendSMS = async (sms, mobileNumber, templateId) => {
    try {
        let token = await getToken();
        const apiURL = `https://api.dev.aieze.in/api/v1/communication/services/sms`;
        const payload = {
            "sms_body": sms,
            "mobile_number": mobileNumber,
            "template_id": templateId
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        const response = await axios.post(apiURL, payload, { headers: headers });
        let res = response.data;
        if(res){
            return res;
        }else{
            throw {"error":"communication Server is down"};
        }
    } catch (error) {
        let response = error.response
        let status = response.status;
        if(status == 401){
            redis.deleteKey(`COMMUNICATIONTOKEN`);
            return await sendSMS(sms, mobileNumber, templateId);
        }
        throw error;
    }
}

module.exports = {
    getToken,
    sendSMS
}