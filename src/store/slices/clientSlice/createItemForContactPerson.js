import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createContactPersonEntry = (payload) => ({
    id: payload.id,
    prefixName: payload.prefixName || '',
    type: payload.type || '',
    firstName: payload.firstName || '',
    middleName: payload.middleName || '',
    lastName: payload.lastName || '',
    email: payload.email || '',
    phoneNumber: payload.phoneNumber || '',
    isContactPersonPrimary: payload.isContactPersonPrimary || false,
});

const createContactPersonSlice = createSlice({
    name: 'createContactPerson',
    initialState,
    reducers: {
        addContactPerson: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createContactPersonEntry(action.payload));
            }
        },
        updateContactPersonField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },
        removeContactPerson: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        resetContactPersons: (state) => {
            state.items = [];
        },
    },
});

export const {
    addContactPerson,
    updateContactPersonField,
    removeContactPerson,
    resetContactPersons,
} = createContactPersonSlice.actions;

export default createContactPersonSlice.reducer;
