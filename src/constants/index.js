
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
//
// export const API_URL = 'http://149.107.116.212:8000'; // local
export const API_URL = 'https://api.iclayn.com:8443'; // Live
export const BASE_URL = 'https://api.iclayn.com';
export const X_TENANT_ID = "5024000001";



export const COLORS = {
    PRIMARY_COLOR: '#003C83',
    PRIMARY_COLOR_LIGHT: '#0069d1',
    yellow:"#fdcc39",
    SECONDARY_COLOR: '#ffffff',


    BLUE_COLOR: '#1F45AB',
    // LIGHT_COLOR: '#8A8A8D',
    LIGHT_COLOR: '#cccccc',
    BORDER_LIGHT_COLOR: '#f5f5f5',
    whiteColors: 'white',
    BLACK_COLOR: '#000',
    GREEN_COLOR: '#E6FAEB',
    // COMPLETD_TXT:"#007E17",
    ACTIVE_TEXT_COLOR: '#80C6FF',
    ORANGE_COLOR: '#F7C69C',
    LIGHT_RED: '#ef4f68',
    RED_COLOR: '#F85544',
    GREY_COLOR: '#8A8A8D',
    GREY_COLOR_LIGHT: '#8A8A8D',

    //STATUS COLOR:
    COMPLETE_BG: '#E6FAEB',
    COMPLETD_TXT:"#007E17",
    PENDING_BG:"#D2F6FF",
    PENDING_TXT:"#3391A4",
}
export const RANDOM_COLOR = ["#6aabed", "#49ac96", "#f28195", "#e7b15f", "#8a7fe6"];

export const PRIMARY_FONT = 'NunitoSans_7pt_Condensed-Regular';

// Now using responsive dimensions for font sizes
export const FONT_SIZE_NORMAL = responsiveFontSize(2.5); // Approx 16px, change 2.5 to adjust ratio
export const FONT_SIZE_REGULAR = responsiveFontSize(3);  // Approx 18px
export const FONT_SIZE_LARGE = responsiveFontSize(3.5);  // Approx 20px

export const FONT_WEIGHT_REGULAR = '600';

export const getInitials = (displayName) => {
    if (displayName) {
        const nameParts = displayName.split(' ');
        return nameParts.map(part => part[0]).join('').toUpperCase();
    } else {
        return "";
    }
};

export const formateDate = (date) => {
    const inputDate = new Date(date);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedDate = `${inputDate.getDate()}-${monthNames[inputDate.getMonth()]}-${inputDate.getFullYear()}`;

    return formattedDate;
};

export const formatAmount = (amount = 0) => {
    let amountString = parseFloat(amount).toFixed(2);
    return amountString || 0;
};



export const ImageUri = {
    logo: require('../assets/Images/bgimage.png'),
}
export const IconUri = {
    Home: require('../assets/Icons/home1.png'),
    // clock: require('../assets/Icons/Calender.png'),
    Activities: require('../assets/Icons/Activities.png'),
    Bills: require('../assets/Icons/Bills.png'),
    Tasks: require('../assets/Icons/Tasks.png'),
    folder: require('../assets/Icons/folder.png'),
    word: require('../assets/Icons/word.png'),
    
    //New
    CalenderColor: require('../assets/Icons/CalenderColor.png'),
    CalenderSearch: require('../assets/Icons/CalenderSearch.png'),

    //3d icons
    bill: require('../assets/Icons/bill.png'),
    Calender: require('../assets/Icons/calendarN.png'),
    clock: require('../assets/Icons/clock.png'),
    task: require('../assets/Icons/task.png'),
    more: require('../assets/Icons/more.png'),
    add: require('../assets/Icons/add.png'),
    search: require('../assets/Icons/search.png'),
    matter: require('../assets/Icons/matter.png'),
    profile: require('../assets/Icons/profile.png'),
    logout: require('../assets/Icons/logout.png'),
    checkmark: require('../assets/Icons/checkmark.png'),
    client: require('../assets/Icons/client.png'),
    mail: require('../assets/Icons/mail.png'),

    communication: require('../assets/Icons/communication.png'),
    documents: require('../assets/Icons/documents.png'),
    parties: require('../assets/Icons/parties.png'),
    report: require('../assets/Icons/report.png'),
    Activitie: require('../assets/Icons/Activitie.png'),
    settings: require('../assets/Icons/settings.png'),
}


export const containerStyle = {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
}
export const containerWithoutCenter = {
    flex: 1,
    backgroundColor: "white",
}

export const fontFamily = {

    Black: 'NunitoSans_10pt_SemiCondensed-Black',
    BlackItalic: 'NunitoSans_10pt_SemiCondensed-BlackItalic',
    Bold: 'NunitoSans_10pt_SemiCondensed-Bold',
    BoldItaclic: 'NunitoSans_10pt_SemiCondensed-BoldItalic',


    extraBold: 'NunitoSans_10pt_SemiCondensed-ExtraBold',
    extraBoldItalic: 'NunitoSans_10pt_SemiCondensed-ExtraBoldItalic',
    extraLight: 'NunitoSans_10pt_SemiCondensed-ExtraLight',
    extraLightItalic: 'NunitoSans_10pt_SemiCondensed-ExtraLightItalic',

    italic: 'NunitoSans_10pt_SemiCondensed-Italic',
    light: 'NunitoSans_10pt_SemiCondensed-Light',
    lightItalic: 'NunitoSans_10pt_SemiCondensed-LightItalic',
    medium: 'NunitoSans_10pt_SemiCondensed-Medium',
    mediumItalic: 'NunitoSans_10pt_SemiCondensed-Medium',
    regulaer: 'NunitoSans_10pt_SemiCondensed-Regular',
    semiBold: 'NunitoSans_10pt_SemiCondensed-SemiBold',
    semiBoldItalic: 'NunitoSans_10pt_SemiCondensed-SemiBoldItalic'

}


export const SALUTATIONS = [
    {
        id: 1,
        title: "Mr.",
        onPress: () => { navigation.navigate("CreateInvoice") },
        value: ""
    },
    {
        id: 2,
        title: "Miss",
        value: "15",
        onPress: () => { }
    },
    {
        id: 3,
        title: "Dr.",
        value: "30",
        onPress: () => { }
    },
    {
        id: 4,
        title: "Dr.",
        value: "45",
        onPress: () => { }
    },
    {
        id: 5,
        title: "Mrs.",
        value: "60",
        onPress: () => { }
    },
    {
        id: 6,
        title: "Prof.",
        value: "60",
        onPress: () => { }
    },

]