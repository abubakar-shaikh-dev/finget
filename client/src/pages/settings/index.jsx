import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Divider, Tabs } from "antd";
import React from "react";
import UserDetails from "./UserDetails";
import PasswordUpdate from "./PasswordUpdate";

export default function index() {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "User Settings",
      icon: <UserOutlined />,
      children: <UserDetails />,
    },
    {
      key: "2",
      label: "Security",
      icon: <KeyOutlined />,
      children: <PasswordUpdate />,
    },
  ];
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-700">Manage User Settings</p>
          </div>
        </div>
        <Divider />
        <div className="mt-3 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden">
                {/* <Card className="shadow"> */}
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                {/* </Card> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
