import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    document: null, // sirf aik document store hoga
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        addDocument: (state, action) => {
            state.document = action.payload; // purana document replace hoga
        },
        removeDocument: (state) => {
            state.document = null;
        },
    },
});

export const { addDocument, removeDocument } = documentSlice.actions;
export default documentSlice.reducer;
