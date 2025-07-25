import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

const TOKEN_KEY = 'access_token';
const EXPIRATION_KEY = 'expires_in';


export const saveToken = async (token = "", tenantId) => {
    // const expirationDate = new Date().getTime() + expiresIn * 1000; // expiresIn is in seconds
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        // await AsyncStorage.setItem(EXPIRATION_KEY, expirationDate.toString());
        await AsyncStorage.setItem("tenantId", tenantId);
    } catch (e) {
        console.error('Failed to save the token to storage', e);
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        // await AsyncStorage.removeItem(EXPIRATION_KEY);
        await AsyncStorage.removeItem("tenantId");
        // navigation.navigate("Login");
        return "SUCCESS";
    } catch (e) {
        console.error('Failed to remove the token from storage', e);
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const expirationDate = await AsyncStorage.getItem(EXPIRATION_KEY);
        if (!token || !expirationDate) return null;

        if (new Date().getTime() > parseInt(expirationDate, 10)) {
            await removeToken();
            return null;
        }

        return token;
    } catch (e) {
        console.error('Failed to get the token from storage', e);
        return null;
    }
};

export const ApiConfig = async () => {
    let tenantId = await AsyncStorage.getItem("tenantId");
    const tokenData = await getToken();
    let config = {
        headers: {
            'Authorization': `Bearer ${tokenData}`,
            'X-Tenant-Id': tenantId,
            'Accept-Language': 'en',
            'Content-Type': 'application/json'
        }
    };

    return config;
};


export const formatNumber = (num) => {
    if (!num && num !== 0) return "0.00"; // Handle null/undefined
    return num?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getTotalDuration = (durationStr) => {
    // HH (2+ digits), MM (00–59), SS (00–59)
    const durationRegex = /^(\d{2,}):([0-5][0-9]):([0-5][0-9])$/;

    const match = durationStr.match(durationRegex);

    if (!match) {
        Alert.alert('Invalid Format', 'Please enter duration in HH:MM:SS format (e.g. 01:30:00, 100:59:59)');
        return null;
    }

    const [, hhStr, mmStr, ssStr] = match;
    const hh = parseInt(hhStr, 10);
    const mm = parseInt(mmStr, 10);
    const ss = parseInt(ssStr, 10);

    const totalHours = hh + mm / 60 + ss / 3600;
    return totalHours;
}


// const imageURL = `data:image/jpeg;base64,${userProfileDTO?.image}`;



// export const calculateDateRange = (option) => {
//     const today = moment();
//     let dateFrom, dateTo;

//     switch (option) {
//         case "Last 30 Days":
//             dateFrom = today.clone().subtract(29, "days").format("YYYY-MM-DD");
//             dateTo = today.format("YYYY-MM-DD");
//             break;

//         case "This Month":
//             dateFrom = today.clone().startOf("month").format("YYYY-MM-DD");
//             dateTo = today.format("YYYY-MM-DD");
//             break;


//         case "This Quarter":
//             const fiscalYearStart = moment([today.year() - 1, 11, 31]); // Dec 31 of last year

//             if (today.isSameOrAfter(fiscalYearStart) && today.isBefore(fiscalYearStart.clone().add(3, "months"))) {
//                 dateFrom = fiscalYearStart.format("YYYY-MM-DD");
//                 dateTo = fiscalYearStart.clone().add(3, "months").subtract(1, "days").format("YYYY-MM-DD");
//             } else if (today.isSameOrAfter(fiscalYearStart.clone().add(3, "months")) && today.isBefore(fiscalYearStart.clone().add(6, "months"))) {
//                 dateFrom = fiscalYearStart.clone().add(3, "months").format("YYYY-MM-DD");
//                 dateTo = fiscalYearStart.clone().add(6, "months").subtract(1, "days").format("YYYY-MM-DD");
//             } else if (today.isSameOrAfter(fiscalYearStart.clone().add(6, "months")) && today.isBefore(fiscalYearStart.clone().add(9, "months"))) {
//                 dateFrom = fiscalYearStart.clone().add(6, "months").format("YYYY-MM-DD");
//                 dateTo = fiscalYearStart.clone().add(9, "months").subtract(1, "days").format("YYYY-MM-DD");
//             } else {
//                 dateFrom = fiscalYearStart.clone().add(9, "months").format("YYYY-MM-DD");
//                 dateTo = fiscalYearStart.clone().add(12, "months").subtract(1, "days").format("YYYY-MM-DD");
//             }
//             break;
//         case "This Fiscal Year": 
//             dateFrom = moment([today.year(), 11, 31]).format("YYYY-MM-DD"); // Dec 31 (Start)
//             dateTo = moment([today.year() + 1, 11, 30]).format("YYYY-MM-DD"); // Dec 30 (End)
//             break;

//         case "Last Month":
//             dateFrom = today.clone().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
//             dateTo = today.clone().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
//             break;

//         case "Last Fiscal Year":
//             dateFrom = moment([today.year() - 1, 11, 31]).format("YYYY-MM-DD"); // Dec 31 (Start)
//             dateTo = moment([today.year(), 11, 30]).format("YYYY-MM-DD"); // Dec 30 (End)
//             break;

//         default:
//             dateFrom = today.clone().subtract(29, "days").format("YYYY-MM-DD");
//             dateTo = today.format("YYYY-MM-DD");
//             break;
//     }

//     return { dateFrom, dateTo };
// };


// export default calculateDateRange;



export const calculateDateRange = (option) => {
    const today = moment();
    let dateFrom, dateTo;
    console.log(option);

    switch (option) {
        case "Last 30 Days":
            dateFrom = today.clone().subtract(29, "days").format("YYYY-MM-DD");
            dateTo = today.format("YYYY-MM-DD");
            break;

        case "This Month":
            dateFrom = today.clone().startOf("month").format("YYYY-MM-DD");
            dateTo = today.format("YYYY-MM-DD");
            break;

        case "This Quarter":
            if (today.month() >= 0 && today.month() <= 2) { // Jan - Mar
                dateFrom = today.clone().startOf("year").format("YYYY-MM-DD");
                dateTo = today.clone().startOf("year").add(3, "months").subtract(1, "days").format("YYYY-MM-DD");
            } else if (today.month() >= 3 && today.month() <= 5) { // Apr - Jun
                dateFrom = today.clone().startOf("year").add(3, "months").format("YYYY-MM-DD");
                dateTo = today.clone().startOf("year").add(6, "months").subtract(1, "days").format("YYYY-MM-DD");
            } else if (today.month() >= 6 && today.month() <= 8) { // Jul - Sep
                dateFrom = today.clone().startOf("year").add(6, "months").format("YYYY-MM-DD");
                dateTo = today.clone().startOf("year").add(9, "months").subtract(1, "days").format("YYYY-MM-DD");
            } else { // Oct - Dec
                dateFrom = today.clone().startOf("year").add(9, "months").format("YYYY-MM-DD");
                dateTo = today.clone().endOf("year").format("YYYY-MM-DD");
            }
            break;

        case "This fiscal Year": // 1st July to 30th June (Pakistan)
            dateFrom = moment([today.year() - 1, 11, 31]).format("YYYY-MM-DD");
            // dateFrom: '2025-02-26', dateTo: '2025-03-27'
            dateTo = moment([today.year(), 11, 30]).format("YYYY-MM-DD");
            break;

        case "Last Month":
            dateTo = today.clone().subtract(2, "month").endOf("month").format("YYYY-MM-DD");
            dateFrom = today.clone().subtract(1, "month").format("YYYY-MM-DD");

            // dateFrom: '2025-02-27', dateTo: '2025-01-31'
            // ?dateFrom=2025-02-27&dateTo=2025-01-31
            break;

        case "Last fiscal Year": // 1st July (previous year) to 30th June (current year)
            dateFrom = moment([today.year() - 2, 11, 31]).format("YYYY-MM-DD");
            // dateFrom: '2025-02-26', dateTo: '2025-03-27'
            dateTo = moment([today.year() - 1, 11, 30]).format("YYYY-MM-DD");
            break;

        default:
            dateFrom = today.clone().subtract(29, "days").format("YYYY-MM-DD");
            dateTo = today.format("YYYY-MM-DD");
            break;
    }

    return { dateFrom, dateTo };
};
