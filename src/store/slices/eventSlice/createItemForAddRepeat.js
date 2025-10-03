import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    repeatObj: {}, // yahan poora AddRepeat ka object aayega
};

const repeatSlice = createSlice({
    name: "repeat",
    initialState,
    reducers: {
        setRepeat: (state, action) => {
            // pura object ek hi bar set karne ke liye
            state.repeatObj = action.payload;
        },
        updateRepeatField: (state, action) => {
            // sirf ek field update karne ke liye
            const { field, value } = action.payload;
            state.repeatObj = {
                ...state.repeatObj,
                [field]: value,
            };
        },
        resetRepeat: (state) => {
            state.repeatObj = {};
        },
    },
});

export const { setRepeat, updateRepeatField, resetRepeat } = repeatSlice.actions;

export default repeatSlice.reducer;
