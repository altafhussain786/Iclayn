import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

// 📌 Request Storage Permission (For Android)import { PermissionsAndroid, Platform } from 'react-native';

export const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 30) {
          // Android 10+ (Scoped Storage Fix)
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to manage storage to download files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // Android 9 or below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to download files.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS میں پرمیشن کی ضرورت نہیں ہوتی
  };
  

// 📌 Global Download Function
export const downloadFile = async (url, filename) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        console.log('Storage permission denied');
        return;
      }
  
      const path =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${filename}` // Saves in "Downloads" folder (Android)
          : `${RNFS.DocumentDirectoryPath}/${filename}`; // iOS default directory
  
      console.log('Downloading to:', path);
  
      const downloadResult = await RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
      }).promise;
  
      if (downloadResult.statusCode === 200) {
        console.log('✅ File downloaded successfully:', path);
        return path;
      } else {
        console.log('❌ Download failed:', downloadResult.statusCode);
      }
    } catch (error) {
      console.error('❌ Download error:', error);
    }
  };