import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createReminderItem = (payload) => ({
    rId: payload.rId, // unique ID
    reminderThrough: payload.reminderThrough || '',  // e.g. 'email', 'sms'
    counts: payload.counts || 0,
    reminderType: payload.reminderType || '',        // e.g. 'daily', 'weekly'
});

const reminderSlice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        addReminderItem: (state, action) => {
            const exists = state.items.find(item => item.rId === action.payload.rId);
            if (!exists) {
                state.items.push(createReminderItem(action.payload));
            }
        },

        updateReminderItem: (state, action) => {
            const item = state.items.find(item => item.rId === action.payload.rId);
            if (item) {
                item.reminderThrough = action.payload.reminderThrough;
                item.counts = action.payload.counts;
                item.reminderType = action.payload.reminderType;
            }
        },

        updateReminderThrough: (state, action) => {
            const item = state.items.find(item => item.rId === action.payload.rId);
            if (item) {
                item.reminderThrough = action.payload.reminderThrough;
            }
        },

        updateCounts: (state, action) => {
            const item = state.items.find(item => item.rId === action.payload.rId);
            if (item) {
                item.counts = action.payload.counts;
            }
        },

        updateReminderType: (state, action) => {
            const item = state.items.find(item => item.rId === action.payload.rId);
            if (item) {
                item.reminderType = action.payload.reminderType;
            }
        },

        removeReminderItem: (state, action) => {
            state.items = state.items.filter(item => item.rId !== action.payload.rId);
        },

        resetReminderItems: (state) => {
            state.items = [];
        },
    },
});

export const {
    addReminderItem,
    updateReminderItem,
    updateReminderThrough,
    updateCounts,
    updateReminderType,
    removeReminderItem,
    resetReminderItems,
} = reminderSlice.actions;

export default reminderSlice.reducer;
