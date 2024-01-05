import { createSlice } from "@reduxjs/toolkit";


const getOneCompanySlice = createSlice(
    {
        name: 'auth/admin/company',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setOneCompany: (state, action) => {
                state.user = action.payload;
            },
            setOneCompanyErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setOneCompany, setOneCompanyErr} = getOneCompanySlice.actions;
export default getOneCompanySlice.reducer;
