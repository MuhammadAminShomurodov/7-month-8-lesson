// src/components/LoginPage.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "./redux/authSlice"; // Import action for setting user
import { Form, Input, Button, Alert } from "antd";

const LoginPage = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (values) => {
    // Example login logic
    if (values.username === "admin" && values.password === "password") {
      dispatch(setUser({ username: values.username }));
      navigate("/all-students"); // Redirect to AllStudents page on successful login
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      {error && <Alert message={error} type="error" />}
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
