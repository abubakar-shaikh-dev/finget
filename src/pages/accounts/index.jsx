import React, { useEffect, useState } from "react";
import { Modal, Table } from "antd";
import axiosInstance from "../../api/axiosInstance";
import ManageAccountModal from "./ManageAccountModal";
import toast from "react-hot-toast";

export default function Accounts() {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [id, setId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 10,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "CASH",
          value: "CASH",
        },
        {
          text: "BANK",
          value: "BANK",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.type.startsWith(value),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (text) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(text);
      },
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex items-center justify-start">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => {
              setId(record._id);
              setModalVisible(true);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-900 ml-4"
            onClick={() => {
              setDeleteId(record._id);
              setDeleteModalVisible(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.data);
      setInitLoading(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/account/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Account deleted successfully", { duration: 4000 });
      fetchData();
      setDeleteId(null);
      setDeleteModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account", { duration: 4000 });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ManageAccountModal
        open={modalVisible}
        setOpen={setModalVisible}
        fetchData={fetchData}
        id={id}
        setId={setId}
      />
      <Modal
        confirmLoading={loading}
        title={"Attention Required !"}
        open={deleteModalVisible}
        setOpen={setDeleteModalVisible}
        okButtonProps={{
          className:
            "bg-gray-800 hover:!bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50",
        }}
        okText="Delete"
        onOk={deleteAccount}
        cancelText="Cancel"
        onCancel={() => {
          setId(null);
          setDeleteModalVisible(false);
        }}
      >
        Are you sure you want to delete this account?
      </Modal>
      <div className="px-4 sm:px-6 lg:px-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Accounts</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage All the Accounts of your Finance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => setModalVisible(true)}
            >
              Add Account
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table
                  loading={initLoading || loading}
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
