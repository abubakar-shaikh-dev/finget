import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Divider } from "antd";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

export default function ManageAccountModal({
  open,
  setOpen,
  fetchData,
  id,
  setId,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAccount = async () => {
      if (id) {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/account/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        form.setFieldsValue(response.data.data);
      }
    };
    fetchAccount();
  }, [id, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const token = localStorage.getItem("token");
      if (id) {
        await axiosInstance.put(`/account/${id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Account updated successfully", { duration: 4000 });
        setId(null);
      } else {
        await axiosInstance.post("/account", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Account added successfully", { duration: 4000 });
      }
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
      title={id ? "Update Account" : "Add Account"}
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={id ? "Update" : "Add"}
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
          {id ? "Update" : "Add"}
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
        <Form.Item
          name="type"
          label="Type"
          rules={[
            {
              required: true,
              message: "Please select the type!",
            },
          ]}
        >
          <Select placeholder="Select a type">
            <Select.Option value="CASH">CASH</Select.Option>
            <Select.Option value="BANK">BANK</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="balance"
          label="Balance"
          rules={[
            {
              required: true,
              message: "Please input the balance!",
            },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Amount should not be negative or Zero")
                    ),
            },
          ]}
        >
          <Input min={0} type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
