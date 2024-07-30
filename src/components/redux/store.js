import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./studentsSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    students: studentsReducer,
    auth: authReducer,
  },
});

export default store;
