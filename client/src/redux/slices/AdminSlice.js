import { createSlice } from "@reduxjs/toolkit";

const adminLoginSlice = createSlice({
  name:'auth/admin',
  initialState:{
    user:null,
    error:null,
    loading:false,
  },
  reducers:{
    setAdminUser: (state, action) => {
      state.user = action.payload;
  },
  setAdminErr: (state, action) => {
      state.err =  action.payload;
  }
  },


})

export const {setAdminUser, setAdminErr} = adminLoginSlice.actions;
export default adminLoginSlice.reducer;