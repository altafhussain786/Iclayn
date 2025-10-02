// // apiHandler.js

// import axios from 'axios';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from '../constants';

// export const httpRequest = async ({
//     method = "get",
//     path = "",
//     params = null,
//     headers = {},
//     baseUrl = API_URL
// }) => {
//     const url = `${baseUrl}${path}`;

//     const token = await AsyncStorage.getItem("access_token");
//     let tenantId = await AsyncStorage.getItem("tenantId");
//     console.log(token,'===================================================dd==>',tenantId);

//     let config = {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'X-Tenant-Id': tenantId,
//             'Accept-Language': 'en',
//             ...headers // Merge additional headers
//         }
//     };

//     try {
//         let response;
//         if (["put", "post", "patch"].includes(method)) {
//             response = await axios[method](url, params, config);
//         } else {
//             response = await axios[method](url, config);
//         }
//         // Return the response data
//         return { res: response.data, err: null };

//     } catch (error) {
//         // Handle Axios errors
//         const errMsg = error.response
//             ? `HTTP error! Status: ${error.response.status} - ${error.response.data.message}`
//             : error.message;

//         return { res: null, err: errMsg ,statusCode:error.response.status};
//     }
// };

import axios, { Method } from "axios";
import { API_URL } from '../constants';
// import { getToken, removeToken } from "../../helpers/helpersFunction";
import { getToken, removeToken } from "../helper/Helpers";
import AsyncStorage from "@react-native-async-storage/async-storage";




const httpRequest = async ({
    header = { "Content-Type": "application/json" },
    method = "get",
    path = "",
    navigation,
    params = null,
    baseUrl = API_URL,
    newToken,
}) => {
    let token = newToken || await AsyncStorage.getItem("access_token");

    // console.log(token,"==");

    const headers = {
        ...header,
        ...(token && { "Authorization": `Bearer ${token}` })
    };
    console.log(token, "=======");


    try {
        let response;
        const endPoint = `${baseUrl}${path}`;
        console.log(endPoint, "BASEL URL ====================>", token);


        if (["post", "put", "patch", "delete"].includes(method)) {
            response = await axios({
                method,
                url: endPoint,
                headers,
                data: params, // use params as request body
            });
        } else {
            response = await axios({
                method,
                url: endPoint,
                headers,
            });
        }
        return { res: response?.data, status: response.status };
    } catch (err) {

        if (err.status === 401) {
            removeToken();
            navigation.navigate("Login");
        }
        return {

            err: err?.response?.data || err?.response?.message || err?.response?.data?.message || err?.response?.data?.error || "ERROR",
            status: err?.response?.status || 500, // Return the status code in case of error
        };
    }
};

export default httpRequest;
