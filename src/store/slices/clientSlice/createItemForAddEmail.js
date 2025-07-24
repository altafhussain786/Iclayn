import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createEmailEntry = (payload) => ({
    id: payload.id,
    email: payload.email || '',
    emailType: payload.emailType || '',
    isEmailPrimary: payload.isEmailPrimary || false,
});

const addEmailSlice = createSlice({
    name: 'addEmail',
    initialState,
    reducers: {
        addEmail: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createEmailEntry(action.payload));
            }
        },
        updateEmailField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },
        removeEmail: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        resetEmails: (state) => {
            state.items = [];
        },
    },
});

export const {
    addEmail,
    updateEmailField,
    removeEmail,
    resetEmails,
} = addEmailSlice.actions;

export default addEmailSlice.reducer;
