import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createExpenseEntry = (payload) => ({
    id: payload.id || '',
    date: payload.date || '',

    // user
    user: payload.user || '',
    userObj: payload.userObj || {},

    description: payload.description || '',
    hourlyRate: payload.hourlyRate || 0,

    // tax
    tax: payload.tax || '',
    taxObj: payload.taxObj || {},
    taxAmount: payload.taxAmount || 0,
    taxTotal: ((payload?.hourlyRate / 100 || 0) * payload?.taxAmount).toFixed(2),
    total: payload?.hourlyRate || 0,
});

const expenseEntrySlice = createSlice({
    name: 'expenseEntry',
    initialState,
    reducers: {
        addExpenseEntry: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createExpenseEntry(action.payload));
            }
        },

        updateExpenseEntry: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },

        updateExpenseEntryField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },



        removeExpenseEntry: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },

        resetExpenseEntries: (state) => {
            state.items = [];
        },
    },
});

export const {
    addExpenseEntry,
    updateExpenseEntry,
    updateExpenseEntryField,
    removeExpenseEntry,
    resetExpenseEntries,
} = expenseEntrySlice.actions;

export default expenseEntrySlice.reducer;
