import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createTimeEntry = (payload) => ({
    id: payload.id, // unique ID
    date: payload.date || '',
    dataObj: payload.dataObj || {},
    selectedDate: payload.selectedDate || '',
    //user
    user: payload.user || '',
    userObj: payload.userObj || {},
    description: payload.description || '',
    duration: payload.duration,
    totalDuration: payload.totalDuration || 0,
    hourlyRate: payload.hourlyRate || 0,
    //tax
    tax: payload.tax,
    taxObj: payload.taxObj || {},
    taxAmount: payload.taxAmount || 0,
    taxTotal: ((payload?.hourlyRate / 100 || 0) * payload?.taxAmount).toFixed(2),
    // taxTotal: payload?.taxAmount?.toFixed(2) || 0,
    total: (payload?.hourlyRate * payload?.totalDuration).toFixed(2) || 0,
});

const timeEntrySlice = createSlice({
    name: 'timeEntry',
    initialState,
    reducers: {
        addTimeEntry: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createTimeEntry(action.payload));
            }
        },

        updateTimeEntry: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
            }
        },

        updateTimeEntryField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },

        removeTimeEntry: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },

        resetTimeEntries: (state) => {
            state.items = [];
        },
    },
});

export const {
    addTimeEntry,
    updateTimeEntry,
    updateTimeEntryField,
    removeTimeEntry,
    resetTimeEntries,
} = timeEntrySlice.actions;

export default timeEntrySlice.reducer;
