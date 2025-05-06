import { responsiveFontSize as fp, responsiveHeight as hp, responsiveWidth as wp } from 'react-native-responsive-dimensions';


export const calculatefontSize = (size) => {
    return fp(size);
};

export const getResponsiveHeight = (size) => {
    return hp(size);
};


export const getResponsiveWidth = (size) => {
    return wp(size);
};

export const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Handle empty input
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (userName) => {
    if (!userName) return '';
  
    const nameParts = userName.trim().split(' ');
    const initials = nameParts
      .filter(part => part.length > 0) // Remove any empty parts
      .map(part => part[0].toUpperCase()) // Take first letter and convert to uppercase
      .join('');
  
    return initials;
  };

  