import React from "react";
import { Layout, Dropdown, Menu, Modal } from "antd";
import { UserOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      centered: false,
      onOk: () => logout(),
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="flex justify-between items-center px-6 bg-white shadow-sm">
      <h1 className="text-xl font-semibold tracking-wide">FinTrack</h1>

      <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <UserOutlined />
          <span className="font-medium text-gray-700">
            {user?.name || "Admin"}
          </span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
