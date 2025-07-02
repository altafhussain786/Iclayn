import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const createBillingRate = (payload) => ({
  pId: payload.pId, // unique ID per item
  firmUserObj: payload.firmUserObj || {},
  firmUser: payload.firmUser || '',
  firmUserId: payload.firmUserId || '',
  hourlyRate: payload.hourlyRate || 0,
});

const billingRateSlice = createSlice({
  name: 'billingRate',
  initialState,
  reducers: {
    addBillingRate: (state, action) => {
      const exists = state.items.find(item => item.pId === action.payload.pId);
      if (!exists) {
        state.items.push(createBillingRate(action.payload));
      }
    },

    updateBillingRate: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.firmUserObj = action.payload.firmUserObj;
        item.firmUser = action.payload.firmUser;
        item.firmUserId = action.payload.firmUserId;
        item.hourlyRate = action.payload.hourlyRate;
      }
    },

    updateFirmUser: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.firmUser = action.payload.firmUser;
        item.firmUserId = action.payload.firmUserId;
      }
    },

    updateHourlyRate: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.hourlyRate = action.payload.hourlyRate;
      }
    },

    removeBillingRate: (state, action) => {
      state.items = state.items.filter(item => item.pId !== action.payload.pId);
    },

    resetBillingRates: (state) => {
      state.items = [];
    },
  },
});

export const {
  addBillingRate,
  updateBillingRate,
  updateFirmUser,
  updateHourlyRate,
  removeBillingRate,
  resetBillingRates,
} = billingRateSlice.actions;

export default billingRateSlice.reducer;
