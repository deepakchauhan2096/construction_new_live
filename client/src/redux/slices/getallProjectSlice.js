import { createSlice } from "@reduxjs/toolkit";


const companyProjectSlice = createSlice(
    {
        name: 'auth/companylogin/project',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setAllProject: (state, action) => {
                state.user = action.payload;
            },
            setAllProjectError: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setAllProject, setAllProjectError} = companyProjectSlice.actions;
export default companyProjectSlice.reducer;
