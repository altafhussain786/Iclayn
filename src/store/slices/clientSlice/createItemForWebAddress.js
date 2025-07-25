import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createWebAddressEntry = (payload) => ({
    id: payload.id,
    webAddress: payload.webAddress || '',
    webAddressType: payload.webAddressType || '',
    isWebAddressPrimary: payload.isWebAddressPrimary || false,
    webAddressObj: payload.webAddressObj || {},
});

const createWebAddressSlice = createSlice({
    name: 'createWebAddress',
    initialState,
    reducers: {
        addWebAddress: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createWebAddressEntry(action.payload));
            }
        },
        updateWebAddressField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },
        removeWebAddress: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        resetWebAddresses: (state) => {
            state.items = [];
        },
    },
});

export const {
    addWebAddress,
    updateWebAddressField,
    removeWebAddress,
    resetWebAddresses,
} = createWebAddressSlice.actions;

export default createWebAddressSlice.reducer;
