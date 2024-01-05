import { createSlice } from "@reduxjs/toolkit";


const allEmployeeSlice = createSlice(
    {
        name: 'auth/companylogin/employee',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setEmployee: (state, action) => {
                state.user = action.payload;
            },
            setEmployeeErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setEmployee, setEmployeeErr} = allEmployeeSlice.actions;
export default allEmployeeSlice.reducer;
