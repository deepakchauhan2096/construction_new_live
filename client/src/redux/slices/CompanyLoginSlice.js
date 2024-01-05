import { createSlice } from "@reduxjs/toolkit";


const companyLoginSlice = createSlice(
    {
        name: 'auth/companylogin',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setCompanyuser: (state, action) => {
                state.user = action.payload;
            },
            setCompanyErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setCompanyuser, setCompanyErr} = companyLoginSlice.actions;
export default companyLoginSlice.reducer;
