import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Divider } from "antd";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { useLocalStorage } from "@mantine/hooks";

export default function ManageUserDataModal({ open, setOpen, fetchData }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useLocalStorage({
    key: "user",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      form.setFieldsValue(response.data.data);
    };
    fetchUserData();
  }, [form, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(`/user`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.data);

      toast.success("User data updated successfully", { duration: 4000 });
      fetchData();
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit form", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title="Update User Data"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Update"
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          className="bg-gray-800 hover:!bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Update
        </Button>,
      ]}
    >
      <Divider />
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input the name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
