import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createPhoneNumberEntry = (payload) => ({
    id: payload.id,
    phoneNumber: payload.phoneNumber || '',
    phoneNumberType: payload.phoneNumberType || '',
    pickerDetails: payload.pickerDetails || '',
    isPhoneNumberPrimary: payload.isPhoneNumberPrimary || false,
});

const addPhoneNumberSlice = createSlice({
    name: 'addPhoneNumber',
    initialState,
    reducers: {
        addPhoneNumber: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createPhoneNumberEntry(action.payload));
            }
        },
        updatePhoneNumberField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },
        removePhoneNumber: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        resetPhoneNumbers: (state) => {
            state.items = [];
        },
    },
});

export const {
    addPhoneNumber,
    updatePhoneNumberField,
    removePhoneNumber,
    resetPhoneNumbers,
} = addPhoneNumberSlice.actions;

export default addPhoneNumberSlice.reducer;
