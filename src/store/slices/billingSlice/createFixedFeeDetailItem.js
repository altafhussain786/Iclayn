import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

const initialState = {
    items: [],
};

const createFixedFeeEntry = (payload) => ({
    id: payload.id, // unique ID
    date: payload.date || '',

    // user
    user: payload.user || '',
    userObj: payload.userObj || {},
    description: payload.description || '',
    selectedDate: payload.selectedDate || '',
    // fixed amount
    hourlyRate: payload.hourlyRate || 0, // yaha hourlyRate ko hi fixed fee amount treat kar rahe hain

    //serviceItem
    serviceItem: "",
    serviceItemObj: payload.serviceItemObj || {},
    // tax
    tax: payload.tax,
    taxObj: payload.taxObj || {},
    taxAmount: payload.taxAmount || 0,

    // calculations
    taxTotal: ((payload?.hourlyRate * payload?.taxAmount) / 100).toFixed(2),
    total: (Number(payload?.hourlyRate) + ((payload?.hourlyRate * payload?.taxAmount) / 100)).toFixed(2),
});

const fixedFeeSlice = createSlice({
    name: 'fixedFee',
    initialState,
    reducers: {
        addFixedFee: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createFixedFeeEntry(action.payload));
            }
        },

        updateFixedFee: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },

        updateFixedFeeField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },

        removeFixedFee: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },

        resetFixedFees: (state) => {
            state.items = [];
        },
    },
});

export const {
    addFixedFee,
    updateFixedFee,
    updateFixedFeeField,
    removeFixedFee,
    resetFixedFees,
} = fixedFeeSlice.actions;

export default fixedFeeSlice.reducer;
