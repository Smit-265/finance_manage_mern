import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content className="p-6 bg-gray-50">
          <Outlet /> {/* Page content will render here */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
