import { createSlice } from "@reduxjs/toolkit";


const getAllAttendanceSlice = createSlice(
    {
        name: 'auth/companylogin/employee/attendance',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setAttendance: (state, action) => {
                state.user = action.payload;
            },
            setAllAttendanceErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const {  setAttendance, setAllAttendanceErr} = getAllAttendanceSlice.actions;
export default getAllAttendanceSlice.reducer;
