import { createSlice } from "@reduxjs/toolkit";


const companyProjectSlice = createSlice(
    {
        name: 'auth/companylogin/document',
        initialState: {
            user: null,
            err: null,
            loading: false,
        },
        reducers: {
            setAllDocument: (state, action) => {
                state.user = action.payload;
            },
            setAllDocumentError: (state, action) => {
                state.err =  action.payload;
            }
        }
    })


export const { setAllDocument, setAllDocumentError} = companyProjectSlice.actions;
export default companyProjectSlice.reducer;
