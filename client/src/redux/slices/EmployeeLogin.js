import { createSlice } from "@reduxjs/toolkit";


const employeeLoginSlice = createSlice(
    {
        name: 'auth/companylogin',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setEmployeeLogin: (state, action) => {
                state.user = action.payload;
            },
            setEmployeeLoginErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setEmployeeLogin, setEmployeeLoginErr} = employeeLoginSlice.actions;
export default employeeLoginSlice.reducer;
