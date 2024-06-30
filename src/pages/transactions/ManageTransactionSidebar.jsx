import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  Tag,
} from "antd";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function ManageTransactionSidebar({
  open,
  setOpen,
  fetchData,
  id,
  setId,
}) {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (id) {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        data.date = dayjs(data.date);

        form.setFieldsValue(data);
      }
    };
    fetchTransaction();
  }, [id, form]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(response.data.data);
    };
    fetchAccounts();
  }, [open]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data);
    };
    fetchCategories();
  }, [open]);

  const handleSubmit = async () => {
    try {
      let values = await form.validateFields();
      setLoading(true);
      const token = localStorage.getItem("token");

      // Modify values.date to get the start of the day
      if (values.date) {
        values.date = dayjs(values.date).startOf("day").toDate();
      }
      if (values.amount) {
        values.amount = Number(values.amount);
      }

      if (id) {
        await axiosInstance.put(`/transaction/${id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Transaction updated successfully", { duration: 4000 });
        setId(null);
      } else {
        await axiosInstance.post("/transaction", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Transaction added successfully", { duration: 4000 });
      }
      fetchData();
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setId(null);
    setOpen(false);
    form.resetFields();
  };

  return (
    <Drawer
      title={id ? "Update Transaction" : "Add Transaction"}
      open={open}
      onClose={handleCancel}
      footer={
        <div className="flex justify-between items-center">
          <Button className="w-[25%]" key="back" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="w-[70%] bg-gray-800 hover:!bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            {id ? "Update" : "Add"}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" name="form_in_drawer">
        <Form.Item
          name="date"
          label="Date"
          rules={[
            {
              required: true,
              message: "Please select the date!",
            },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="account"
          label="Account"
          rules={[
            {
              required: true,
              message: "Please select the account!",
            },
          ]}
        >
          <Select placeholder="Select an account">
            {accounts.map((account) => (
              <Select.Option key={account._id} value={account._id}>
                <div className="flex justify-between items-center">
                  <span>{account.name}</span>
                  <Tag>
                    Balance :{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                    }).format(account.balance)}
                  </Tag>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: "Please select the category!",
            },
          ]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                <div className="flex justify-between items-center">
                  <span>{category.name}</span>
                  <Tag color={category.type === "INCOME" ? "green" : "red"}>
                    {category.type}
                  </Tag>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="payee"
          label="Payee"
          rules={[
            {
              required: true,
              message: "Please input the payee!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            {
              required: true,
              message: "Please input the amount!",
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
          <Input min={1} type="number" />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
