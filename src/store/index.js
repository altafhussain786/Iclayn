import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "./slices/CounterSlice";
import userDetailsReducer from "./slices/userDetails";
import createItemforRelatePartiesReducer from "./slices/matterSlice/createItemforRelateParties";
import createItemForBillingRateReducer from "./slices/matterSlice/createItemForBillingRate";
import createItemforReminderReducer from "./slices/taskSlice/createItemforReminder";
import createItemforDocumentsReducer from "./slices/taskSlice/createItemforDocuments";
import createBillingTimeEntryItemReducer from "./slices/billingSlice/createBillingTimeEntryItem";
import createBillingExpenseEntryItemReducer from "./slices/billingSlice/createBillingExpenseEntryItem";

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
    createBillingExpenseEntryItem: createBillingExpenseEntryItemReducer
  },
});

export default store; 