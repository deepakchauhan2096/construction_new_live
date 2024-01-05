import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import { combineReducers } from 'redux';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist/es/constants';
import CompanyLoginSlice from "./slices/CompanyLoginSlice";
import AdminSlice from "./slices/AdminSlice";
import AllCompanyDetail from "./slices/getallCompanySlice";
import AllProjectDetail from "./slices/getallProjectSlice"
import AllAttendanceDetail from "./slices/getAttendanceSlice";
import AllEmployeeDetail from "./slices/getEmployee";
import AllContractorDetail from "./slices/getContrctorSlice";
import AllDocumentDetail from "./slices/getAllDocument"
import EmployeeLogin from "./slices/EmployeeLogin"
import setOneCompany  from "./slices/getOneCompanySlice";


const persistConfig = {
  key: 'root',
  version: 1,
  storage:storageSession,
};

const persistedLoginReducer = persistReducer(persistConfig,CompanyLoginSlice);
const persistedAdminReducer = persistReducer(persistConfig,AdminSlice)
const persistedEmployeeReducer = persistReducer(persistConfig,EmployeeLogin)
const persistedCompanyReducer = persistReducer(persistConfig,setOneCompany)
const persistedAllCompanyReducer = persistReducer(persistConfig,AllCompanyDetail)



const rootReducer = combineReducers({
  companyLogin: persistedLoginReducer,
  adminLogin :persistedAdminReducer,
  employeeLogin:persistedEmployeeReducer,
  allCompany:persistedAllCompanyReducer,
  allProject:AllProjectDetail,
  allEmployee:AllEmployeeDetail,
  allContractor:AllContractorDetail,
  allAttendation:AllAttendanceDetail,
  allDocument:AllDocumentDetail,
  setOneCompany:persistedCompanyReducer

  // Add other reducers here if needed
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)

