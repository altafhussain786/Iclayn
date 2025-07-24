import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./slices/CounterSlice";
import userDetailsReducer from "./slices/userDetails";
import createItemforRelatePartiesReducer from "./slices/matterSlice/createItemforRelateParties";
import createItemForBillingRateReducer from "./slices/matterSlice/createItemForBillingRate";
import createItemforReminderReducer from "./slices/taskSlice/createItemforReminder";
import createItemforDocumentsReducer from "./slices/taskSlice/createItemforDocuments";
import createBillingTimeEntryItemReducer from "./slices/billingSlice/createBillingTimeEntryItem";
import createBillingExpenseEntryItemReducer from "./slices/billingSlice/createBillingExpenseEntryItem";
import createItemForAddEmailReducer from "./slices/clientSlice/createItemForAddEmail";
import createItemForAddPhoneReducer from "./slices/clientSlice/createItemForAddPhone";
import createItemForWebAddressReducer from "./slices/clientSlice/createItemForWebAddress";
import createItemForAddAddressReducer from "./slices/clientSlice/createItemForAddAddress";
import createItemForContactPerson from "./slices/clientSlice/createItemForContactPerson";
const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    createItemforRelateParties: createItemforRelatePartiesReducer,
    createItemForBillingRate: createItemForBillingRateReducer,
    //tasks
    createItemforReminder: createItemforReminderReducer,
    createItemforDocuments: createItemforDocumentsReducer,
    //billing
    createBillingTimeEntryItem: createBillingTimeEntryItemReducer,
    createBillingExpenseEntryItem: createBillingExpenseEntryItemReducer,
    //Client
    createItemForAddEmail: createItemForAddEmailReducer,
    createItemForAddPhone: createItemForAddPhoneReducer,
    createItemForWebAddress: createItemForWebAddressReducer,
    createItemForAddAddress: createItemForAddAddressReducer,
    createItemForContactPerson: createItemForContactPerson
  },
});

export default store; 