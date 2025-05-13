import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    userDetails: {} // Single object for billing address
};

const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState, // <-- Yeh add karna zaroori hai
    reducers: {
        adduserDetails: (state, action) => {
            console.log(action.payload,"============payload");
            
            state.userDetails = action.payload; // Directly storing an object
        },
        clearuserDetails: (state) => {
            state.userDetails = {}; // Resetting state to an empty object
        },

    },
});

export const {
    adduserDetails,
    clearuserDetails,

} = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
