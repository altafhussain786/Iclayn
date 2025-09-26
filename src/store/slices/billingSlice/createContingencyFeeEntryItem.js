import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createContingencyFeeEntry = (payload) => {


    return {
        id: payload.id, // unique ID
        date: payload.date || '',

        // user
        user: payload.user || '',
        userObj: payload.userObj || {},
        description: payload.description || '',

        // contingency fields
        awardedAmount: payload?.awardedAmount,
        contingencyRate: payload?.contingencyRate,


        // tax
        tax: payload.tax,
        taxObj: payload.taxObj || {},
        taxAmount: payload.taxAmount || 0,


    };
};

const contingencyFeeSlice = createSlice({
    name: 'contingencyFee',
    initialState,
    reducers: {
        addContingencyFee: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createContingencyFeeEntry(action.payload));
            }
        },

        updateContingencyFee: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },

        updateContingencyFeeField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },

        removeContingencyFee: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },

        resetContingencyFees: (state) => {
            state.items = [];
        },
    },
});

export const {
    addContingencyFee,
    updateContingencyFee,
    updateContingencyFeeField,
    removeContingencyFee,
    resetContingencyFees,
} = contingencyFeeSlice.actions;

export default contingencyFeeSlice.reducer;
