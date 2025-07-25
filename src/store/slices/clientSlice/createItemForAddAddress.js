import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const createAddressEntry = (payload) => ({
    id: payload.id,
    country: payload.country || '',
    countryObj: payload.countryObj || {},
    city: payload.city || '',
    cityObj: payload.cityObj || {},
    type: payload.type || '',
    stateAddress: payload.stateAddress || '',
    postCode: payload.postCode || '',
    streetAddress: payload.streetAddress || '',
    isAddressPrimary: payload.isAddressPrimary || false,
    addressObj: payload.addressObj || {},
});

const createAddressSlice = createSlice({
    name: 'createAddress',
    initialState,
    reducers: {
        addAddress: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(createAddressEntry(action.payload));
            }
        },
        updateAddressField: (state, action) => {
            const { id, field, value } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item[field] = value;
            }
        },
        removeAddress: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        },
        resetAddresses: (state) => {
            state.items = [];
        },
    },
});

export const {
    addAddress,
    updateAddressField,
    removeAddress,
    resetAddresses,
} = createAddressSlice.actions;

export default createAddressSlice.reducer;
