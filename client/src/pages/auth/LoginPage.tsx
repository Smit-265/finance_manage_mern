import React, {useState, useEffect} from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user, login } = useAuth();

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    console.log("Login values:", values);

    setTimeout(() => {
      const fakeUser = { name: "Smit", email: values.email };
      const fakeToken = "mock-jwt-token-123";
      login(fakeUser, fakeToken);
      setLoading(false);
      message.success("Login successful (mock)!");
    }, 1000);
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLoginFailed = (errorInfo: any) => {
    console.log("Validation failed:", errorInfo);
    message.error("Please fill all required fields correctly.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg rounded-2xl">
        <div className="text-center mb-6">
          <Title level={2}>FinTrack</Title>
          <p className="text-gray-500">Login to your account</p>
        </div>

        <Form form={form} name="login" layout="vertical" onFinish={handleLogin} onFinishFailed={handleLoginFailed}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
