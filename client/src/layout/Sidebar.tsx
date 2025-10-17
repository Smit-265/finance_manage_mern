import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined, BarChartOutlined, SettingOutlined, DollarOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/salary", icon: <DollarOutlined />, label: "Salary" },
    { key: "/reports", icon: <BarChartOutlined />, label: "Reports" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  return (
    <Sider
      collapsible
      width={220}
      className="min-h-screen bg-white shadow-md"
      style={{ position: "sticky", top: 0, left: 0 }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
