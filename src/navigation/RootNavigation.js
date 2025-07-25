import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import { COLORS } from '../constants';
import Splash from '../screens/splash/Splash';
import BottomTabNavigation from './BottomTabNavigation';
import LoginByPassword from '../screens/auth/login/LoginByPassword';
import ForgetPassword from '../screens/auth/forgetPassword/ForgetPassword';
import Otp from '../screens/auth/otp/Otp';
import Settings from '../screens/settings/Settings';
import MatterDetails from '../screens/tabs/matters/screens/MatterDetails';
import { getToken } from '../helper/Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalenderDetails from '../screens/tabs/calender/screens/CalenderDetails';
import TaskDetails from '../screens/tabs/tasks/screens/TaskDetails';
import Event from '../screens/events/Event';
import TimmerDetails from '../screens/timmerDetails/TimmerDetails';
import CreateMatter from '../screens/tabs/matters/screens/CreateMatter';
import CreateTask from '../screens/tabs/tasks/screens/CreateTask';
import TaskDocuments from '../screens/tabs/tasks/screens/taskDocuments/TaskDocuments';
import TaskFiles from '../screens/tabs/tasks/screens/taskDocuments/TaskFiles';
import Activities from '../screens/tabs/activities/Activities';
import Bills from '../screens/tabs/bills/Bills';
import Clients from '../screens/clients/Clients';
import Parties from '../screens/more/parties/Parties';
import Documents from '../screens/more/documents/Documents';
import Communications from '../screens/more/communications/Communications';
import AppSettings from '../screens/more/appSettings/AppSettings';
import Reports from '../screens/more/reports/Reports';
import EditTimeEntry from '../screens/timeEntry/editTimeEntry/EditTimeEntry';
import EditMatter from '../screens/tabs/matters/screens/EditMatter';
import EditTask from '../screens/tabs/tasks/screens/editTask/EditTask';
import CreateBilling from '../screens/tabs/bills/screens/CreateBilling';
import CreateTimeEntry from '../screens/timeEntry/editTimeEntry/CreateTimeEntry';
import CreateExpense from '../screens/more/expense/screens/CreateExpense';
import CreateClients from '../screens/clients/screens/CreateClients';
import CreateParties from '../screens/more/parties/screens/CreateParties';
import Transaction from '../screens/more/transaction/Transaction';
import CreateTransaction from '../screens/more/transaction/screens/CreateTransaction';
import CreatePhoneLog from '../screens/more/communications/screens/CreatePhoneLog';
import CreateInternalLogs from '../screens/more/communications/screens/CreateInternalLogs';
import EditClient from '../screens/clients/screens/EditClient';
import EditBilling from '../screens/tabs/bills/screens/EditBilling';
import EditParties from '../screens/more/parties/screens/EditParties';



const RootNavigation = () => {
  const Stack = createNativeStackNavigator();
  const tokenFUnction = async () => {
    const token = await getToken();
    return token

  }



  return (
    <>
      {/* <StatusBar hidden /> */}
      <StatusBar hidden backgroundColor={COLORS.PRIMARY_COLOR_LIGHT} barStyle="light-content" />

      <Stack.Navigator

        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // 👈 Smooth left-to-right animation
        }}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginByPassword" component={LoginByPassword} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Activities" component={Activities} />
        <Stack.Screen name="Bills" component={Bills} />
        <Stack.Screen name="EditBilling" component={EditBilling} />
        <Stack.Screen name="CreateBilling" component={CreateBilling} />
        <Stack.Screen name="Clients" component={Clients} />
        <Stack.Screen name="CreateClients" component={CreateClients} />
        <Stack.Screen name="EditClient" component={EditClient} />


        {/* //Matters  */}
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="CreateMatter" component={CreateMatter} />
        <Stack.Screen name="TimmerDetails" component={TimmerDetails} />
        <Stack.Screen name="EditTimeEntry" component={EditTimeEntry} />
        <Stack.Screen name="CreateTimeEntry" component={CreateTimeEntry} />
        <Stack.Screen name="MatterDetails" component={MatterDetails} />
        <Stack.Screen name="EditMatter" component={EditMatter} />
        <Stack.Screen name="CalenderDetails" component={CalenderDetails} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="EditTask" component={EditTask} />
        <Stack.Screen name="TaskDocuments" component={TaskDocuments} />
        <Stack.Screen name="TaskFiles" component={TaskFiles} />
        <Stack.Screen name="CreateExpense" component={CreateExpense} />

        {/* //more  */}
        <Stack.Screen name="Parties" component={Parties} />
        <Stack.Screen name="CreateParties" component={CreateParties} />
        <Stack.Screen name="EditParties" component={EditParties} />
        <Stack.Screen name="Documents" component={Documents} />
        <Stack.Screen name="Communications" component={Communications} />
        <Stack.Screen name="CreatePhoneLog" component={CreatePhoneLog} />
        <Stack.Screen name="CreateInternalLogs" component={CreateInternalLogs} />
        <Stack.Screen name="AppSettings" component={AppSettings} />
        <Stack.Screen name="Reports" component={Reports} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="CreateTransaction" component={CreateTransaction} />





      </Stack.Navigator>
    </>
  );
};


export default RootNavigation;

const styles = StyleSheet.create({});
