import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./components/redux/store";
import AllStudents from "./components/AllStudents";
import LoginPage from "./components/LoginPage";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/all-students" element={<AllStudents />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <ToastContainer />
      </Router>
    </Provider>
  );
};

export default App;
