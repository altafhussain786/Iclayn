// apiHandler.js

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';

export const httpRequest = async ({
    method = "get",
    path = "",
    params = null,
    headers = {},
    baseUrl = API_URL
}) => {
    const url = `${baseUrl}${path}`;

    const token = await AsyncStorage.getItem("access_token");
    let tenantId = await AsyncStorage.getItem("tenantId");
    console.log(token,'===================================================dd==>',tenantId);
    
    let config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-Id': tenantId,
            'Accept-Language': 'en',
            ...headers // Merge additional headers
        }
    };

    try {
        let response;
        if (["put", "post", "patch"].includes(method)) {
            response = await axios[method](url, params, config);
        } else {
            response = await axios[method](url, config);
        }
        // Return the response data
        return { res: response.data, err: null };

    } catch (error) {
        // Handle Axios errors
        const errMsg = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.data.message}`
            : error.message;

        return { res: null, err: errMsg ,statusCode:error.response.status};
    }
};
