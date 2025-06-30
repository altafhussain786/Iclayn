import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const createRelatedContact = (payload) => ({
  pId: payload.pId, // internal unique ID
  partyType: payload.partyType || '',
  partyTypeId: payload.partyTypeId || '',
  party: payload.party || '',
  partyId: payload.partyId || '',
  relationship: payload.relationship || '',
});

const relatedContactSlice = createSlice({
  name: 'relatedContact',
  initialState,
  reducers: {
    addRelatedContact: (state, action) => {
      const exists = state.items.find(item => item.pId === action.payload.pId);
      if (!exists) {
        state.items.push(createRelatedContact(action.payload));
      }
    },

    updateRelatedContact: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.partyType = action.payload.partyType;
        item.partyTypeId = action.payload.partyTypeId;
        item.party = action.payload.party;
        item.partyId = action.payload.partyId;
        item.relationship = action.payload.relationship;
      }
    },



    updatePartyType: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.partyType = action.payload.partyType;
        item.partyTypeId = action.payload.partyTypeId;
      }
    },

    updateParty: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.party = action.payload.party;
        item.partyId = action.payload.partyId;
      }
    },
    updateRelationShip: (state, action) => {
      const item = state.items.find(item => item.pId === action.payload.pId);
      if (item) {
        item.relationship = action.payload.relationship;
      }
    },

    removeRelatedContact: (state, action) => {
        // console.log(action.payload.pId,"action.payload.pId");
        
      state.items = state.items.filter(item => item.pId !== action.payload.pId);
    },
  

    resetRelatedContacts: (state) => {
      state.items = [];
    },
  },
});

export const {
  addRelatedContact,
  updateRelatedContact,
  removeRelatedContact,
  resetRelatedContacts,
  updatePartyType,
  updateRelationShip,
  updateParty,
} = relatedContactSlice.actions;

export default relatedContactSlice.reducer;
