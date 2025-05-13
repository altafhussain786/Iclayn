import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from './src/screens/auth/Login'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigation from './src/navigation/RootNavigation'
import { ToastProvider } from 'react-native-toast-notifications'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Provider } from 'react-redux'
import store from './src/store'

const App = () => {
  return (
    <>
      <ToastProvider
        placement="top" // Place the toast at the top of the screen
        renderType={{
          info: (toast) => (
            <CustomToast
              icon="info-circle"
              backgroundColor="#007bff"
              textColor="white"
              message={toast.message}
            />
          ),
          success: (toast) => (
            <CustomToast
              icon="check-circle"
              backgroundColor="#28a745"
              textColor="white"
              message={toast.message}
            />
          ),
          warning: (toast) => (
            <CustomToast
              icon="exclamation-circle"
              backgroundColor="#ffc107"
              textColor="black"
              message={toast.message}
            />
          ),
          danger: (toast) => (
            <CustomToast
              icon="times-circle"
              backgroundColor="#F85544"
              textColor="white"
              message={toast.message}
            />
          ),
        }}
      >
        <Provider store={store}>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </Provider>
      </ToastProvider>
    </>
  )
}

const CustomToast = ({ icon, backgroundColor, textColor, message }: any) => {
  return (
    <View style={[styles.toastContainer, { backgroundColor }]}>
      <FontAwesome name={icon} size={24} color={textColor} style={styles.icon} />
      <Text style={[styles.toastText, { color: textColor }]}>{message}</Text>
    </View>
  );
};

export default App

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 30,
    elevation: 5, // Adds shadow for Android
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  toastText: {
    fontSize: 16,
  },
})