import { createSlice } from "@reduxjs/toolkit";


const allCompanySlice = createSlice(
    {
        name: 'auth/admin/company',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setAllCompany: (state, action) => {
                state.user = action.payload;
            },
            setAllCompanyErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setAllCompany, setAllCompanyErr} = allCompanySlice.actions;
export default allCompanySlice.reducer;
