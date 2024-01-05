import { createSlice } from "@reduxjs/toolkit";


const allContractortSlice = createSlice(
    {
        name: 'auth/companylogin/contractor',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setContractor: (state, action) => {
                state.user = action.payload;
            },
            setContractorErr: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setContractor, setContractorErr} = allContractortSlice.actions;
export default allContractortSlice.reducer;
